const apiError = require("../interfaces/apiError");
const User = require("../models/user.model");
const Order = require("../models/order.model");
const apiResponse = require("../interfaces/apiResponse");
const Product = require("../models/product.model");
const crypto = require("crypto");

class OrderService {
  constructor() {}

  getUserOrders = async (req, res) => {
    const user = await User.findOne({ UID: req.user.UID });

    const orders = await Order.find({ user: user._id });
    if (!orders) {
      throw new apiError(500, "Internal Server Error");
    }

    return res
      .status(200)
      .json(new apiResponse(orders, "Orders Fetched Successfully"));
  };

  purchase = async (req, res) => {
    const {
      paymentMethod,
      paymentStatus,
      transaction_id,
      totalAmount,
      totalDiscount,
      signature,
    } = req.body;

    if (!paymentMethod) {
      throw new apiError(400, "Payment method is required");
    }

    const user = await User.findOne({ UID: req.user.UID }).select("cart");

    if (!user) {
      throw new apiError(404, "User Not Found");
    }

    const cartItems = user.cart.cartItems;

    if (!cartItems.length) {
      throw new apiError(400, "Please Add Something in Cart before checkout");
    }

    // console.log(cartItems);

    if (paymentMethod == 0 && paymentStatus) {
      if (!totalAmount || !transaction_id || !totalDiscount || !signature) {
        throw new apiError(
          400,
          "Total Amount , Total Discount, signature and Transaction Id are required"
        );
      }

      for (const item of cartItems) {
        var product = await Product.findById(item.product_id);

        if (!product) {
          throw new apiError(404, "Product Not Found");
        }

        const indexOfVariant = product.variants.findIndex(
          (varinat) => varinat.color === item.color
        );

        if (indexOfVariant === -1) {
          throw new apiError(404, "Variant Not Found");
        }

        const indexOfSize = product.variants[indexOfVariant].sizes.findIndex(
          (size) => size.size == item.size
        );

        if (indexOfSize === -1) {
          throw new apiError(404, "Size not Found");
        }

        if (
          product.variants[indexOfVariant].sizes[indexOfSize].stock <
          item.quantity
        ) {
          throw new apiError(400, "Not Enough Stock");
        }
        product.variants[indexOfVariant].sizes[indexOfSize].stock -=
          item.quantity;

        await product.save();
      }

      const newOrder = new Order({
        transaction_id,
        user: user._id,
        products: cartItems,
        totalAmount,
        totalDiscount,
        orderStatus: "Pending",
        paymentMethod: true,
        paymentStatus: "Captured",
        signature,
      });

      const orderData = await newOrder.save();

      user.cart.cartItems = [];
      await user.save();

      return res
        .status(201)
        .json(new apiResponse({ orderData }, "Product purchased Successfully"));
    } else if (paymentMethod == 1) {
      for (let item of cartItems) {
        const product = await Product.findById(item.product_id);

        const indexOfVariant = product.variants.findIndex(
          (variant) => variant.color === item.color
        );

        // Check if variant and size exist
        if (!indexOfVariant === -1) {
          throw new apiError(404, "Variant Not Found");
        }

        const indexOfSize = product.variants[indexOfVariant].sizes.findIndex(
          (size) => size.size == item.size
        );

        if (!indexOfSize === -1) {
          throw new apiError(404, "Size Not Found");
        }

        const { actual_price, discounted_price, stock } =
          product.variants[indexOfVariant].sizes[indexOfSize];

        // console.log(actual_price, discounted_price, stock);

        if (!(stock >= item.quantity)) {
          throw new apiError(400, "Not Enough Stock");
        }

        if (item.actual_price !== actual_price) {
          console.log("Actual price Changed");
          item.actual_price = actual_price;
        }

        if (item.discounted_price !== discounted_price) {
          console.log("Discounted Price Changed");
          item.discounted_price = discounted_price;
        }

        if (
          product.variants[indexOfVariant].sizes[indexOfSize].stock <
          item.quantity
        ) {
          throw new apiError(400, "Not Enough Stock");
        }

        product.variants[indexOfVariant].sizes[indexOfSize].stock -=
          item.quantity;

        await product.save();
      }
      user.cart.cartItems = cartItems;
      await user.save();

      let totalAmount = cartItems.reduce(
        (acc, cur) => acc + cur.quantity * cur.actual_price,
        0
      );

      let totalDiscountedAmount = cartItems.reduce(
        (acc, cur) => acc + cur.quantity * cur.discounted_price,
        0
      );

      const totalDiscount = totalAmount - totalDiscountedAmount;

      if (totalDiscountedAmount < 500) {
        totalAmount += 40;
      }

      const transaction_id = crypto.randomBytes(10).toString("hex");

      const newOrder = new Order({
        transaction_id,
        user: user._id,
        products: cartItems,
        totalAmount,
        totalDiscount,
        orderStatus: "Pending",
        paymentMethod: false,
        paymentStatus: "Pending",
        signature: "",
      });

      const orderData = await newOrder.save();

      user.cart.cartItems = [];
      await user.save();

      return res
        .status(201)
        .json(new apiResponse({ orderData }, "Product purchased Successfully"));
    } else {
      throw new apiError(400, "Invalid Payment Method");
    }
  };

  cancelOrder = async (req, res) => {
    // console.log(req.body);
    const paymentMethod = req.body.paymentMethod;
    const orderId = req.body.orderId;

    if (!paymentMethod || !orderId) {
      throw new apiError(400, "Payment method and order id are required");
    }

    const orderToCancel = await Order.findById(orderId);

    if (!orderToCancel) {
      throw new apiError(404, "Orders for this orderId not found");
    }

    if (Date.now() - orderToCancel.createdAt > 24 * 60 * 60 * 1000) {
      throw new apiError(
        400,
        "Cannot cancel the order after 24hrs of placing order"
      );
    }

    if (orderToCancel.orderStatus === "Cancelled") {
      throw new apiError(400, "Order is already cancelled");
    }

    if (orderToCancel.paymentStatus === "Refunded") {
      throw new apiError(400, "Already payment is refunded");
    }

    if (orderToCancel.paymentStatus === "Failed") {
      throw new apiError(400, "Payment status is failed");
    }

    const productsPurchased = orderToCancel.products;

    for (const item of productsPurchased) {
      var product = await Product.findById(item.product_id);

      if (!product) {
        throw new apiError(404, "Product Not Found");
      }

      const indexOfVariant = product.variants.findIndex(
        (variant) => variant.color === item.color
      );

      if (indexOfVariant === -1) {
        throw new apiError(404, "Variant Not Found");
      }

      const indexOfSize = product.variants[indexOfVariant].sizes.findIndex(
        (size) => size.size == item.size
      );

      if (indexOfSize === -1) {
        throw new apiError(404, "Size not Found");
      }

      product.variants[indexOfVariant].sizes[indexOfSize].stock +=
        item.quantity;

      await product.save();
    }

    if (paymentMethod == 0) {
      const updatedOrder = await Order.findByIdAndUpdate(
        orderId,
        {
          $set: {
            orderStatus: "Cancelled",
            paymentStatus: "Refunded",
          },
        },
        { new: true }
      );

      return res.status(201).json(
        new apiResponse(
          {
            orderId,
            transaction_id: orderToCancel.transaction_id,
            totalAmount: orderToCancel.totalAmount,
            signature: orderToCancel.signature,
          },
          "Order Cancelled Successfully"
        )
      );
    } else if (paymentMethod == 1) {
      const updatedOrder = await Order.findByIdAndUpdate(
        orderId,
        {
          $set: {
            orderStatus: "Cancelled",
          },
        },
        { new: true }
      );

      return res.status(201).json(
        new apiResponse(
          {
            orderId,
            transaction_id: orderToCancel.transaction_id,
            totalAmount: orderToCancel.totalAmount,
          },
          "Order cancelled Successfully"
        )
      );
    } else {
      throw new apiError(400, "Invalid Payment Method");
    }
  };
}

module.exports = OrderService;
