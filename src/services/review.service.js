const Review = require("../models/review.model");
const apiError = require("../interfaces/apiError");
const apiResponse = require("../interfaces/apiResponse");
const Product = require("../models/product.model");
const User = require("../models/user.model");

class ReviewService {
  constructor() {}

  addReview = async (req, res) => {
    const { product_id, rating, review, images } = req.body;

    const user = await User.findOne({ UID: req.user.UID }).select("_id");

    const reviewObj = new Review({
      user: user._id,
      rating,
      review,
      images,
    });

    const reviewData = await reviewObj.save();

    if (!reviewData) {
      throw new apiError(500, "Error while adding review");
    }

    const product = await Product.findById(product_id);

    if (!product) {
      throw new apiError(404, "Product not found");
    }

    product.review.push(reviewData._id.toString());

    const updatedProduct = await product.save();

    return res
      .status(200)
      .json(new apiResponse(reviewData, "Review added successfully"));
  };

  deleteReview = async (req, res) => {
    const { product_id, _id } = req.body;

    const review = await Review.findByIdAndDelete(_id)
      .populate({ path: "user", select: "username" })
      .select("user review rating");

    if (!review) {
      throw new apiError(404, "Review not found");
    }

    const product = await Product.findByIdAndUpdate(
      product_id,
      { $pull: { review: _id } },
      { new: true }
    );

    return res
      .status(200)
      .json(new apiResponse(review, "Review deleted successfully"));
  };
}

module.exports = ReviewService;
