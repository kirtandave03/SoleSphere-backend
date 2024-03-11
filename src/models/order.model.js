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
        product: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "Product",
        },

        quantity: {
          type: Number,
          required: true,
          default: 1,
        },
      },
    ],

    deliveryCharge: {
      chargeAmount: {
        type: Number,
        default: 0,
      },
      charge: {
        type: Boolean,
        default: false,
      },
    },

    totalAmount: {
      type: String,
      required: true,
    },

    orderStatus: {
      type: String,
      required: true,
    },

    paymentMethod: {
      type: String,
      required: true,
    },

    paymentStatus: {
      type: String,
      required: true,
    },
  },
  { timestamps: true }
);

const Order = mongoose.model("Order", orderSchema);
module.exports = Order;
