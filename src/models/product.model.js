const mongoose = require("mongoose");
const mongoose_delete = require("mongoose-delete");
const mongooseAggregatePaginate = require("mongoose-aggregate-paginate-v2");

const productSchema = new mongoose.Schema(
  {
    productName: {
      type: String,
      required: true,
      unique: true,
    },
    shortDescription: {
      type: String,
      trim: true,
    },
    sizeType: {
      type: String,
      required: true,
    },
    variants: [
      {
        color: { type: String, lowercase: true },
        image_urls: [String],
        sizes: [
          {
            size: { type: String, required: true },
            actual_price: { type: Number, required: true },
            discounted_price: { type: Number, required: true },
            stock: { type: Number, required: true },
          },
        ],
      },
    ],
    discount: {
      startDate: {
        type: Date,
      },
      discount: {
        type: Number,
        default: 0,
      },
      endDate: {
        type: Date,
      },
    },
    closureType: {
      type: String,
    },
    material: {
      type: String,
      required: true,
    },
    longDescription: {
      type: String,
      trim: true,
    },
    giftPackaging: {
      type: Boolean,
      default: false,
    },
    qr: {
      type: String,
    },
    gender: {
      type: "String",
      required: true,
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

productSchema.plugin(mongooseAggregatePaginate);
productSchema.plugin(mongoose_delete, { overrideMethods: "all" });

const Product = mongoose.model("Product", productSchema);
module.exports = Product;
