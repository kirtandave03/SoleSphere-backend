const mongoose = require("mongoose");

const orderSchema = new mongoose.Schema(
  {
    transaction_id: {
      type: String,
      required: true,
    },
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },

    products: [
      {
        product_id: { type: mongoose.Schema.Types.ObjectId, ref: "Product" },
        productName: { type: String, lowercase: true },
        image_url: { type: String, lowercase: true },
        color: { type: String },
        size: Number,
        quantity: Number,
        actual_price: Number,
        discounted_price: Number,
      },
    ],

    totalAmount: {
      type: String,
      required: true,
    },

    totalDiscount: {
      type: String,
      required: true,
    },

    orderStatus: {
      type: String,
      required: true,
      enum: ["Delivered", "Pending", "Cancelled"],
    },

    paymentMethod: {
      type: Boolean,
      required: true,
    },

    paymentStatus: {
      type: String,
      required: true,
      enum: ["Pending", "Captured", "Refunded", "Failed"],
    },

    signature: {
      type: String,
    },

    refund_id: {
      type: String,
      default: "",
    },
  },
  { timestamps: true }
);

const Order = mongoose.model("Order", orderSchema);
module.exports = Order;
