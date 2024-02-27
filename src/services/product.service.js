const apiError = require("../interfaces/apiError");
const Product = require("../models/product.model");
const apiResponse = require("../interfaces/apiResponse");

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

    console.log(productName);

    // console.log(variants);

    // Update variants with the uploaded image URLs
    // if (variants && variants.length > 0 && urls.length > 0) {
    //   variants[0].colorAndImage[0].image_urls = urls;
    // }

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
      review: null, // Set review to null initially
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

    const updatedProduct = await Product.findByIdAndUpdate(product, {
      variants: newVariant,
    });

    if (!updatedProduct) {
      throw new apiError(500, "Error while adding variant");
    }

    return res
      .status(200)
      .json(new apiResponse(updatedProduct, "Variant added successfully"));
  };
}

module.exports = ProductService;
