const apiError = require("../interfaces/apiError");
const Product = require("../models/product.model");
const apiResponse = require("../interfaces/apiResponse");
const User = require("../models/user.model");
const mongoose = require("mongoose");

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

    // Once all uploads are complete, send the response with the URLs

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
      review: [], // Set review to null initially
      category, // Convert category to ObjectId
      brand, // Convert brand to ObjectId
    });

    // Save the new product to the database
    const savedProduct = await newProduct.save();

    // Respond with the saved product
    return res.status(200).json({
      success: true,
      message: "Product added successfully",
      product: savedProduct,
    });
  };

  addVariant = async (req, res) => {
    const { product, variants } = req.body;

    const existedProduct = await Product.findById(product);

    if (!existedProduct) {
      throw new apiError(404, "Product not found");
    }

    const newVariant = [...existedProduct.variants];
    newVariant.push(variants);

    const updatedProduct = await Product.findByIdAndUpdate(
      product,
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
    const price = req.query?.price || "";
    let closureType = req.query?.closureType || "";
    let brand = req.query?.brand || "";
    let gender = req.query?.gender || "";

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

    // MongoDB aggregation to get filtered products
    const products = await Product.aggregate(pipeline);

    if (!products || products.length === 0) {
      return res.status(404).json(new apiResponse([], "No products found"));
    }

    const responseData = products.map((item) => {
      return {
        productName: item.productName,
        actual_price: item.variants[0].sizes[0].actual_price,
        discounted_price: item.variants[0].sizes[0].discounted_price,
        colors: item.variants.length,
        category: item.category,
        brand: item.brand,
        shortDescription: item.shortDescription,
        totalReview: item.review.length,
        image: item.variants[0].image_urls[0],
        totalRating: item.review.reduce((acc, curr) => acc + curr.rating, 0),
      };
    });

    return res
      .status(200)
      .json(new apiResponse(responseData, "Products fetched successfully"));
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

  addToCart = async (req, res) => {
    const { cartItems, totalAmount } = req.body;

    const cart = {
      cartItems,
      totalAmount: totalAmount,
    };
    console.log(cart);

    const user = await User.findByIdAndUpdate(
      req.user._id,
      {
        cart,
      },
      { new: true }
    ).select("cart");

    if (!user) {
      throw new apiError(404, "User not found");
    }

    return res
      .status(200)
      .json(new apiResponse(user, "Cart updated successfully"));
  };

  productDetail = async (req, res) => {
    const product_id = req.query?.product_id;

    const product = await Product.findById(product_id)
      .populate({
        path: "review",
        select: "user rating review images",
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
}

module.exports = ProductService;
