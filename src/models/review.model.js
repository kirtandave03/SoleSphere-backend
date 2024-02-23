const mongoose = require("mongoose");

const reviewSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
    rating: {
      type: Number,
    },
    review: {
      type: String,
      trim: true,
    },
    images: [
      {
        type: String,
      },
    ],
  },
  { timestamps: true }
);

const Review = mongoose.model("Review", reviewSchema);
module.exports = Review;

//purpose :-
// 1 if user delete his review than it is very difficult to find his review without unique id as we got problem in address.
