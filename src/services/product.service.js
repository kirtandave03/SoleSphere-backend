const apiError = require("../interfaces/apiError");
const Product = require("../models/product.model");
const apiResponse = require("../interfaces/apiResponse");
const User = require("../models/user.model");

class ProductService {
  constructor() {}

  getProducts = async (req, res) => {
    const productName = req.query?.productName || "";
    let category = req.query?.category || "";
    let color = req.query?.color || "";
    let size = req.query?.size || "";
    const sort = req.query?.sort || "";
    let closureType = req.query?.closureType || "";
    let brand = req.query?.brand || "";
    let material = req.query?.material || "";
    let gender = req.query?.gender || "";
    let page = Number(req.query?.page) || 0;
    let limit = Number(req.query?.limit) || 12;

    let sortOptions = {};

    if (category && !Array.isArray(category)) {
      category = [category];
    }

    if (brand && !Array.isArray(brand)) {
      brand = [brand];
    }

    if (closureType && !Array.isArray(closureType)) {
      closureType = [closureType];
    }

    if (material && !Array.isArray(material)) {
      material = [material];
    }

    if (gender && !Array.isArray(gender)) {
      gender = [gender];
    }

    if (color && !Array.isArray(color)) {
      color = [color];
    }

    if (size && !Array.isArray(size)) {
      size = [size];
    }

    let pipeline = [
      {
        $lookup: {
          from: "categories",
          localField: "category",
          foreignField: "_id",
          as: "category",
          pipeline: [
            {
              $project: {
                category: 1,
              },
            },
          ],
        },
      },
      {
        $addFields: {
          category: {
            $arrayElemAt: ["$category", 0],
          },
        },
      },

      {
        $lookup: {
          from: "brands",
          localField: "brand",
          foreignField: "_id",
          as: "brand",
          pipeline: [
            {
              $project: {
                brand: 1,
              },
            },
          ],
        },
      },
      {
        $addFields: {
          brand: { $arrayElemAt: ["$brand", 0] },
        },
      },
      {
        $lookup: {
          from: "reviews",
          localField: "review",
          foreignField: "_id",
          as: "review",
          pipeline: [
            {
              $project: {
                rating: 1,
                review: 1,
              },
            },
          ],
        },
      },
      {
        $match: {
          productName: {
            $regex: `.*${productName.toLowerCase().trim()}.*`,
            $options: "i",
          },
        },
      },
      {
        $addFields: {
          avgReview: { $avg: "$review.rating" },
        },
      },
    ];

    // If categories are provided, filter products based on those categories

    if (category && category.length > 0) {
      pipeline.push({
        $match: { "category.category": { $in: [...category] } },
      });
    }

    if (brand && brand.length > 0) {
      pipeline.push({
        $match: { "brand.brand": { $in: [...brand] } },
      });
    }

    if (closureType && closureType.length > 0) {
      pipeline.push({
        $match: { closureType: { $in: [...closureType] } },
      });
    }

    if (material && material.length > 0) {
      pipeline.push({
        $match: { material: { $in: [...material] } },
      });
    }
    if (gender && gender.length > 0) {
      pipeline.push({
        $match: { gender: { $in: [...gender] } },
      });
    }

    if (color && color.length > 0) {
      pipeline.push({
        $match: { "variants.color": { $in: [...color] } },
      });
    }

    if (size && size.length > 0) {
      pipeline.push({
        $match: { "variants.sizes.size": { $in: [...size] } },
      });
    }

    // sort based on price

    if (sort === "low-to-high") {
      sortOptions = { "variants.0.sizes.0.discounted_price": 1 };
      pipeline.push({
        $sort: sortOptions,
      });
    } else if (sort === "high-to-low") {
      sortOptions = { "variants.0.sizes.0.discounted_price": -1 };
      pipeline.push({
        $sort: sortOptions,
      });
    }

    if (sort === "review") {
      let sortReview = {
        $sort: {
          avgReview: -1,
        },
      };
      pipeline.push(sortReview);
    }

    if (sort === "latest arrivals") {
      pipeline.push({
        $sort: {
          createdAt: -1,
        },
      });
    }

    // MongoDB aggregation to get filtered products
    const products = await Product.aggregate(pipeline)
      .skip(page * limit)
      .limit(limit);

    if (!products || products.length === 0) {
      return res.status(404).json(new apiResponse([], "No products found"));
    }

    const responseData = products.map((item) => {
      return {
        _id: item._id,
        productName: item.productName,
        actual_price: item.variants[0].sizes[0].actual_price,
        discounted_price: item.variants[0].sizes[0].discounted_price,
        colors: item.variants.length,
        category: item.category,
        brand: item.brand,
        shortDescription: item.shortDescription,
        avgRating: item.avgReview,
        image: item.variants[0].image_urls[0],
        totalReview: item.review.length,
      };
    });

    return res
      .status(200)
      .json(new apiResponse(responseData, "Products fetched successfully"));
  };

  getAllProducts = async (req, res) => {
    const { search } = req.query;

    const products = await Product.find({
      productName: { $regex: search, $options: "i" },
    }).select("productName");

    return res
      .status(200)
      .json(new apiResponse(products, "Products fetched successfully"));
  };

  getAllDeletedProducts = async (req, res) => {
    const page = Number(req.query.page) || 0;
    const limit = Number(req.query.limit) || 5;
    const { search } = req.query;
    const totalCount = (await Product.find()).length;
    const pipeline = [
      {
        $lookup: {
          from: "reviews",
          localField: "review",
          foreignField: "_id",
          as: "reviews",
        },
      },
      {
        $addFields: {
          averageRating: { $avg: "$reviews.rating" },
        },
      },
    ];

    const deletedProducts = await Product.findDeleted({
      deleted: true,
    })
      .populate("category brand review")
      .skip(page * limit)
      .limit(limit);
    let totalRating = deletedProducts.map((product) => {
      const total = product.review.reduce((acc, curr) => acc + curr.rating, 0);
      const avgRating = total / product.review.length;
      return avgRating;
    });
    const resp = [];
    for (let i = 0; i < deletedProducts.length; i++) {
      let op = { ...deletedProducts[i]._doc, averageRating: totalRating[i] };
      resp.push(op);
    }
    const totalDeletedCount = deletedProducts.length;
    if (!search) {
      return res
        .status(200)
        .json(
          new apiResponse(
            { deletedProducts: resp, totalCount: totalDeletedCount },
            "Deleted Products"
          )
        );
    }
    const filteredDeletedProducts = resp.filter((product) =>
      new RegExp(search, "i").test(product.productName)
    );
    return res.status(200).json(
      new apiResponse({
        deletedProducts: filteredDeletedProducts,
        totalCount: filteredDeletedProducts.count,
      })
    );
    // if (!search) {
    //   const product = await Product.find();

    //   const products = await Product.aggregate(pipeline)
    //     .skip(page * limit)
    //     .limit(limit);
    //   const populatedProducts = await Product.populate(products, {
    //     path: "category brand",
    //   });
    //   res
    //     .status(200)
    //     .json(new apiResponse(products, "All products fetched successfully"));
    // }
    // const foundProducts = await Product.find({
    //   productName: { $regex: search, $options: "i" },
    // }).exec();
    // const products = await Product.aggregate([
    //   { $match: { _id: { $in: foundProducts.map((product) => product._id) } } },
    //   ...pipeline,
    // ])
    //   .skip(page * limit)
    //   .limit(limit);
    // const populatedProducts = await Product.populate(products, {
    //   path: "category brand",
    // });
    // const queryProductCount = products.length;
    // res
    //   .status(200)
    //   .json(
    //     new apiResponse(
    //       { products: populatedProducts, totalCount: queryProductCount },
    //       "All products fetched successfully based in the query"
    //     )
    //   );
  };

  addToCart = async (req, res) => {
    const { product_id, productName, color, size } = req.body;

    const product = await Product.findById(product_id);

    if (!product) {
      throw new apiError(404, "product not found");
    }

    if (product.productName !== productName) {
      throw new apiError(400, "Invalid product name");
    }

    const user = await User.findOne({ UID: req.user.UID }).select("cart");

    let cartItems = user.cart.cartItems;
    let variants = product.variants;

    let indexOfVariant = variants.findIndex((item) => item.color === color);

    if (indexOfVariant === -1) {
      throw new apiError(404, "Variant not found");
    }

    let indexOfSize = variants[indexOfVariant].sizes.findIndex(
      (item) => item.size == size
    );

    if (indexOfSize === -1) {
      throw new apiError(404, "product size not fount");
    }

    const { actual_price, discounted_price, stock } =
      variants[indexOfVariant].sizes[indexOfSize];

    const image_url = variants[indexOfVariant].image_urls[0];

    const index = cartItems.findIndex(
      (item) =>
        item.productName === productName &&
        item.color === color &&
        item.size == size
    );

    if (index != -1 && stock >= cartItems[index].quantity) {
      cartItems[index].quantity++;
      user.cart.cartItems = cartItems;
      await user.save();
      res
        .status(200)
        .json(
          new apiResponse(
            user.cart.cartItems,
            "Product added to the cart successfully!"
          )
        );
    }

    if (index === -1 && stock >= 1) {
      let response = {
        product_id: product._id,
        productName: product.productName,
        image_url,
        actual_price,
        discounted_price,
        color,
        size,
        quantity: 1,
      };
      user.cart.cartItems = [...cartItems, response];
      await user.save();
      return res
        .status(200)
        .json(
          new apiResponse(
            user.cart.cartItems,
            "Product added to the cart successfully!"
          )
        );
    }

    if (index !== -1 && stock < cartItems[index].quantity) {
      return res
        .status(200)
        .json(new apiResponse(cartItems, "Not Enough stock available"));
    }
  };

  productDetail = async (req, res) => {
    const product_id = req.query?.product_id;

    const product = await Product.findById(product_id)
      .populate({
        path: "review",
        select: "rating review images",
        populate: {
          path: "user",
          select: "username profilePic",
        },
      })
      .populate({ path: "brand", select: "brand brandIcon" })
      .populate({ path: "category", select: "category" });

    if (!product) {
      throw new apiError(404, "Product not found");
    }

    return res
      .status(200)
      .json(new apiResponse(product, "Product fetched successfully"));
  };

  getCart = async (req, res) => {
    const user = await User.findOne({ UID: req.user.UID }).select("cart");

    let cartItems = user.cart.cartItems;
    let deliveryCharge = 0;

    const totalAmount = cartItems.reduce((accumulator, currentValue) => {
      return (
        accumulator + currentValue.quantity * currentValue.discounted_price
      );
    }, 0);

    if (totalAmount < 500) {
      deliveryCharge = 40;
    }

    return res
      .status(200)
      .json(
        new apiResponse(
          { cartItems, totalAmount, deliveryCharge },
          "Fetched cartItems successfully"
        )
      );
  };

  deleteCartItem = async (req, res) => {
    const { productName, color, size } = req.body;
    const flag = req.body.flag || 0;

    const user = await User.findOne({ UID: req.user.UID }).select("cart");
    let cartItems = user.cart.cartItems;

    const index = cartItems.findIndex(
      (item) =>
        item.productName === productName &&
        item.color === color &&
        item.size === size
    );

    if (index === -1) {
      throw new apiError(404, "Product not found in cart");
    }

    if (!flag) {
      if (cartItems[index].quantity === 1) {
        cartItems.splice(index, 1);
        user.cart.cartItems = cartItems;
        await user.save();
        res
          .status(200)
          .json(
            new apiResponse(
              user.cart.cartItems,
              "Product removed from the cart successfully"
            )
          );
      }

      cartItems[index].quantity--;
      user.cart.cartItems = cartItems;
      await user.save();

      res
        .status(200)
        .json(
          new apiResponse(
            user.cart.cartItems,
            "Product removed from the cart successfully"
          )
        );
    } else {
      cartItems.splice(index, 1);
      user.cart.cartItems = cartItems;
      await user.save();
      res
        .status(200)
        .json(
          new apiResponse(
            user.cart.cartItems,
            "Product removed from the cart successfully"
          )
        );
    }
  };

  getOrderSummary = async (req, res) => {
    const index = req.query?.index || 0;
    let paymentMethod = req.query?.paymentMethod || 0;
    let deliveryCharge = 0;

    const user = await User.findOne({ UID: req.user.UID }).select(
      "cart address"
    );
    const address = user.address[index];
    const cartItems = user.cart.cartItems;

    if (!address) {
      throw new apiError(404, "Address not found");
    }

    if (!cartItems) {
      throw new apiError(400, "Please add something to your cart!");
    }

    const TotalActualAmount = cartItems.reduce((acc, currVal) => {
      return acc + currVal.quantity * currVal.actual_price;
    }, 0);

    const TotalDiscountedAmount = cartItems.reduce((acc, currVal) => {
      return acc + currVal.quantity * currVal.discounted_price;
    }, 0);

    if (TotalDiscountedAmount < 500) {
      deliveryCharge = 40;
    }
    const totalDiscount = TotalActualAmount - TotalDiscountedAmount;
    if (paymentMethod == 0) {
      paymentMethod = "Razorpay";
    } else {
      paymentMethod = "Cash On Delivery";
    }

    return res.status(200).json(
      new apiResponse({
        address,
        paymentMethod,
        TotalActualAmount,
        TotalDiscountedAmount,
        totalDiscount,
        deliveryCharge,
        cartItems,
      })
    );
  };

  searchProduct = async (req, res) => {
    const totalProducts = (await Product.find()).length;

    const page = Number(req.query.page) || 0;
    const limit = Number(req.query.limit) || totalProducts;
    const { search } = req.query;

    let pipeline = [
      {
        $lookup: {
          from: "categories",
          localField: "category",
          foreignField: "_id",
          as: "category",
          pipeline: [
            {
              $project: {
                _id: 0,
                category: 1,
              },
            },
          ],
        },
      },
      {
        $addFields: {
          category: {
            $arrayElemAt: ["$category.category", 0],
          },
        },
      },
      {
        $lookup: {
          from: "brands",
          localField: "brand",
          foreignField: "_id",
          as: "brand",
          pipeline: [
            {
              $project: {
                _id: 0,
                brand: 1,
              },
            },
          ],
        },
      },
      {
        $addFields: {
          brand: { $arrayElemAt: ["$brand.brand", 0] },
        },
      },
      {
        $lookup: {
          from: "reviews",
          localField: "review",
          foreignField: "_id",
          as: "review",
          pipeline: [
            {
              $lookup: {
                from: "users",
                localField: "user",
                foreignField: "_id",
                as: "user",
                pipeline: [
                  {
                    $project: {
                      username: 1,
                      _id: 0,
                    },
                  },
                ],
              },
            },

            {
              $project: {
                rating: 1,
                review: 1,
                user: 1,
              },
            },
          ],
        },
      },
      {
        $addFields: {
          avgReview: { $avg: "$review.rating" },
        },
      },
    ];

    if (search) {
      const matchStage = {
        $or: [
          { productName: { $regex: search, $options: "i" } },
          { closureType: { $regex: search, $options: "i" } },
          { material: { $regex: search, $options: "i" } },
          { gender: { $regex: search, $options: "i" } },
          { category: { $regex: search, $options: "i" } },
          { brand: { $regex: search, $options: "i" } },
        ],
      };

      pipeline.push({ $match: matchStage });
    }

    const products = await Product.aggregate(pipeline)
      .skip(page * limit)
      .limit(limit);

    const responseData = products.map((item) => {
      return {
        _id: item._id,
        productName: item.productName,
        actual_price: item.variants[0].sizes[0].actual_price,
        size: item.variants[0].sizes[0].size,
        discounted_price: item.variants[0].sizes[0].discounted_price,
        colors: item.variants.length,
        category: item.category,
        brand: item.brand,
        shortDescription: item.shortDescription,
        avgRating: item.avgReview,
        image: item.variants[0].image_urls[0],
        review: item.review,
        totalReview: item.review.length,
      };
    });

    return res
      .status(200)
      .json(
        new apiResponse(
          { responseData, totalProducts },
          "Products fetched successfully"
        )
      );
  };
}

module.exports = ProductService;
