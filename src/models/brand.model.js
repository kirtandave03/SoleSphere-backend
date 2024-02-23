const mongoose = require("mongoose");

const brandSchema = new mongoose.Schema(
  {
    brand: {
      type: String,
      required: true,
      lowercase: true,
      trim: true,
      unique: true,
    },
  },
  { timestamps: true }
);

const Brand = mongoose.model("Brand", brandSchema);
module.exports = Brand;
