const apiError = require("../interfaces/apiError");
const Product = require("../models/product.model");
const apiResponse = require("../interfaces/apiResponse");
const User = require("../models/user.model");
const Category = require("../models/category.model");
const Brand = require("../models/brand.model");
class ProductService {
  constructor() {}

  addProduct = async (req, res) => {
    const {
      productName,
      shortDescription,
      sizeType,
      closureType,
      material,
      longDescription,
      gender,
      category,
      brand,
      variants,
      discount,
      giftPackaging,
      qr,
    } = req.body;

    const iscategory = await Category.findById(category);
    const isBrand = await Brand.findById(brand);

    if (!iscategory) {
      throw new apiError(404, "Category not found");
    }

    if (!isBrand) {
      throw new apiError(404, "Brand not found");
    }

    const newProduct = new Product({
      productName,
      shortDescription,
      sizeType,
      variants, // Assign the array of variant objects
      discount,
      closureType,
      material,
      longDescription,
      giftPackaging,
      qr,
      gender,
      review: [],
      category,
      brand,
    });

    const savedProduct = await newProduct.save();

    // Respond with the saved product
    return res.status(200).json({
      success: true,
      message: "Product added successfully",
      product: savedProduct,
    });
  };

  addVariant = async (req, res) => {
    const { product_id, variants } = req.body;
    const { color } = variants;

    const existedProduct = await Product.findById(product_id);

    if (!existedProduct) {
      throw new apiError(404, "Product not found");
    }

    const index = existedProduct.variants.findIndex(
      (item) => item.color === color
    );

    if (index !== -1) {
      throw new apiError(400, "Variant already exists");
    }

    const newVariant = [...existedProduct.variants];
    newVariant.push(variants);

    const updatedProduct = await Product.findByIdAndUpdate(
      product_id,
      {
        variants: newVariant,
      },
      { new: true }
    );

    if (!updatedProduct) {
      throw new apiError(500, "Error while adding variant");
    }

    return res
      .status(200)
      .json(new apiResponse(updatedProduct, "Variant added successfully"));
  };

  getProducts = async (req, res) => {
    const productName = req.query?.productName || "";
    let category = req.query?.category || "";
    let color = req.query?.color || "";
    let size = req.query?.size || "";
    const sort = req.query?.sort || "";
    let closureType = req.query?.closureType || "";
    let brand = req.query?.brand || "";
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

    if (sort === "price_asc") {
      sortOptions = { "variants.0.sizes.0.discounted_price": 1 };
      pipeline.push({
        $sort: sortOptions,
      });
    } else if (sort === "price_des") {
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

    if (sort === "timestamp") {
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
    const product = await Product.find().select("productName");

    if (!product) {
      throw new apiError(500, "Error while fetching products");
    }

    return res
      .status(200)
      .json(new apiResponse(product, "Products fetched successfully"));
  };

  deleteProduct = async (req, res) => {
    const { productName } = req.body;

    const product = await Product.findOne({
      productName: productName.toLowerCase(),
    });

    if (!product) {
      throw new apiError(404, "Product not found");
    }

    await product.delete();

    return res
      .status(200)
      .json(new apiResponse(product, "Product deleted successfully"));
  };

  editProduct = async (req, res) => {
    const {
      productName,
      updatedProductName,
      updatedActualPrice,
      updatedDiscountPrice,
    } = req.body;

    const updateObject = {};
    if (updatedProductName) {
      updateObject.productName = updatedProductName;
    }
    if (updatedActualPrice) {
      updateObject.actual_price = updatedActualPrice;
    }
    if (updatedDiscountPrice) {
      updateObject.discounted_price = updatedDiscountPrice;
    }

    const product = await Product.findOneAndUpdate(
      { productName },
      {
        $set: updateObject,
      },
      { new: true }
    );

    if (!product) {
      throw new apiError(404, "Product not found");
    }

    return res
      .status(200)
      .json(new apiResponse(product, "Product Updated Successfully"));
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

    const user = await User.findById(req.user._id).select("cart");

    let cartItems = user.cart.cartItems;
    let variants = product.variants;

    console.log(cartItems);

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
    // res.send("hello");
  };

  // productDetail = async (req, res) => {
  //   const product_id = req.query?.product_id;

  //   const product = await Product.findById(product_id)
  //     .populate({
  //       path: "review",
  //       select: "user rating review images",
  //     })
  //     .populate({ path: "brand", select: "brand brandIcon" })
  //     .populate({ path: "category", select: "category" });

  //   if (!product) {
  //     throw new apiError(404, "Product not found");
  //   }

  //   return res
  //     .status(200)
  //     .json(new apiResponse(product, "Product fetched successfully"));
  // };

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
    const user = await User.findById(req.user._id).select("member cart");

    let cartItems = user.cart.cartItems;
    let deliveryCharge = 0;

    const totalAmount = cartItems.reduce((accumulator, currentValue) => {
      return (
        accumulator + currentValue.quantity * currentValue.discounted_price
      );
    }, 0);

    if (!user.member) {
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

    const user = await User.findById(req.user._id).select("cart");
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
  };

  getOrderSummary = async (req, res) => {
    const index = req.query?.index || 0;
    const paymentMethod = req.query?.paymentMethod || "COD";
    const deliveryCharge = 0;

    const user = await User.findById(req.user._id).select(
      "cart address member"
    );
    const address = user.address[index];
    const cartItems = user.cart.cartItems;

    if (!address) {
      throw new apiError(404, "Address not found");
    }

    if (!cartItems) {
      throw new apiError(400, "Please add something to your cart!");
    }

    if (!user.member) {
      deliveryCharge = 40;
    }

    const TotalActualAmount = cartItems.reduce((acc, currVal) => {
      return acc + currVal.quantity * currVal.actual_price;
    }, 0);

    const TotalDiscountedAmount = cartItems.reduce((acc, currVal) => {
      return acc + currVal.quantity * currVal.discounted_price;
    }, 0);

    const totalDiscount = TotalActualAmount - TotalDiscountedAmount;

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
}

module.exports = ProductService;
