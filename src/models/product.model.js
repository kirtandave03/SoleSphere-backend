const mongoose = require("mongoose");
const mongoose_delete = require("mongoose-delete");
const mongooseAggregatePaginate = require("mongoose-aggregate-paginate-v2");

const productVariantSchema = new mongoose.Schema({
  colorAndImage: [
    {
      color: {
        type: String,
        required: true,
      },
      image_urls: [
        {
          type: String,
          required: true,
        },
      ],
    },
  ],
  sizeAndPrice: [
    {
      size: {
        type: String,
        required: true,
      },
      actual_price: {
        type: Number,
        required: true,
      },
      discounted_price: {
        type: Number,
        required: true,
      },
      stock: {
        type: Number,
        required: true,
      },
    },
  ],
});

const productSchema = new mongoose.Schema(
  {
    productName: {
      type: String,
      required: true,
      index: true,
    },
    shortDescription: {
      type: String,
      trim: true,
    },
    brand: {
      type: String,
      required: true,
    },
    sizeType: {
      type: String,
      required: true,
    },
    variants: [productVariantSchema], // This is the array of product variants
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
    review: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Review",
    },
  },
  { timestamps: true }
);

productSchema.plugin(mongooseAggregatePaginate);
productSchema.plugin(mongoose_delete, { overrideMethods: "all" });

const Product = mongoose.model("Product", productSchema);
module.exports = Product;
