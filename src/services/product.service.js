const Product = require("../models/product.model");
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
    const urls = [
      "http://res.cloudinary.com/dz9ga1vmp/image/upload/v1709023633/dnidyjrzvivu1wjpouxi.jpg",
      "http://res.cloudinary.com/dz9ga1vmp/image/upload/v1709023634/ebvehsck82iuefhzyby7.png",
      "http://res.cloudinary.com/dz9ga1vmp/image/upload/v1709023634/xaujce8duztsuv2bpeh8.png",
      "http://res.cloudinary.com/dz9ga1vmp/image/upload/v1709023635/rhogdtbh18f0ez5tg0bt.png",
      "http://res.cloudinary.com/dz9ga1vmp/image/upload/v1709023636/w8efqhvkyj30t2n1wvff.png",
    ];
    if (variants && urls.length > 0) {
      variants[0].image_urls = urls;
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
}

module.exports = ProductService;
