const asyncHandler = require("../utils/asyncHandler");
const ReviewService = require("../services/review.service");

const reviewService = new ReviewService();

const addReview = asyncHandler(reviewService.addReview);
const deleteReview = asyncHandler(reviewService.deleteReview);

module.exports = { addReview, deleteReview };
