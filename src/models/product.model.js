const mongoose = require("mongoose");
const mongoose_delete = require("mongoose-delete");

const productSchema = new mongoose.Schema(
  {
    productName: {
      type: String,
      required: true,
      lowercase: true,
    },
    shortDescription: {
      type: String,
      trim: true,
    },
    sizeType: {
      type: String,
      required: true,
      enum: ["UK", "US", "EU"],
    },
    variants: [
      {
        color: { type: String },
        image_urls: [String],
        sizes: [
          {
            size: { type: Number, required: true },
            actual_price: { type: Number, required: true },
            discounted_price: { type: Number, required: true },
            stock: { type: Number, required: true },
          },
        ],
      },
    ],
    closureType: {
      type: String,
      lowercase: true,
      enum: [
        "zipper",
        "button",
        "hook and loop",
        "lace-up",
        "buckle",
        "velcro",
      ],
    },
    material: {
      type: String,
      required: true,
      lowercase: true,
      enum: [
        "leather",
        "suede",
        "canvas",
        "mesh",
        "rubber",
        "synthetic",
        "textile",
        "knit",
        "velvet",
        "denim",
        "cork",
        "faux leather",
      ],
    },
    longDescription: {
      type: String,
      trim: true,
    },
    // giftPackaging: {
    //   type: Boolean,
    //   default: false,
    // },
    // qr: {
    //   type: String,
    // },
    gender: {
      type: "String",
      required: true,
      lowercase: true,
      enum: ["male", "female", "unisex"],
    },
    review: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Review",
      },
    ],
    category: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Category",
      required: true,
    },
    brand: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Brand",
    },
  },
  { timestamps: true }
);

productSchema.plugin(mongoose_delete, { overrideMethods: "all" });

const Product = mongoose.model("Product", productSchema);
module.exports = Product;
