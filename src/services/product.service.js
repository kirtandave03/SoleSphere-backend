const { uploadOnCloudinary } = require("./cloudinary");
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

    console.log(variants);

    const images = req.files.map((image) => image.path);
    const urls = [];

    const imageToUpload = images.map((image) => {
      return new Promise((resolve, reject) => {
        uploadOnCloudinary(image)
          .then((result) => {
            urls.push(result.url); // Push the URL into the urls array
            resolve(result); // Resolve the promise with the result
          })
          .catch((error) => {
            reject(error); // Reject the promise if there is an error
          });
      });
    });

    try {
      // Wait for all uploads to finish
      await Promise.all(imageToUpload);
      // console.log(uploads); // Log upload results
      console.log(urls); // Log URLs array after all uploads

      // Update variants with the uploaded image URLs
      if (variants && variants.length > 0 && urls.length > 0) {
        variants[0].colorAndImage[0].image_urls = urls;
      }

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
    } catch (err) {
      // Handle errors
      console.error("Error in uploading:", err);
      return res.status(500).json({ error: "Error in uploading images" });
    }
  };
}

module.exports = ProductService;
