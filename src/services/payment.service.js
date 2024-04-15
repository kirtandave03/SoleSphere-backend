const Razorpay = require("razorpay");
const crypto = require("crypto");
const apiError = require("../interfaces/apiError");
const apiResponse = require("../interfaces/apiResponse");
const Product = require("../models/product.model");
const User = require("../models/user.model");
class PaymentService {
  constructor() {}

  razorpayOrder = async (req, res) => {
    const user = await User.findOne({ UID: req.user.UID }).select("cart");

    let cartItems = user.cart.cartItems;
    // console.log("Cart Item", cartItems);

    for (let item of cartItems) {
      const product = await Product.findById(item.product_id);

      const indexOfVariant = product.variants.findIndex(
        (variant) => variant.color === item.color
      );

      // Check if variant and size exist
      if (indexOfVariant === -1) {
        throw new apiError(404, "Variant Not Found");
      }

      const indexOfSize = product.variants[indexOfVariant].sizes.findIndex(
        (size) => size.size == item.size
      );

      if (indexOfSize === -1) {
        throw new apiError(404, "Size Not Found");
      }

      const { actual_price, discounted_price, stock } =
        product.variants[indexOfVariant].sizes[indexOfSize];

      // console.log(actual_price, discounted_price, stock);

      if (!(stock > item.quantity)) {
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
    }
    console.log("New CartItem : ", cartItems);

    user.cart.cartItems = cartItems;
    await user.save();

    let totalAmount = cartItems.reduce(
      (acc, cur) => acc + cur.quantity * cur.discounted_price,
      0
    );

    if (totalAmount < 500) {
      totalAmount += 40;
    }

    console.log(totalAmount);
    const instance = new Razorpay({
      key_id: process.env.RAZORPAY_ID_KEY,
      key_secret: process.env.RAZORPAY_SECRET_KEY,
    });

    const options = {
      amount: totalAmount * 100,
      currency: "INR",
      receipt: crypto.randomBytes(10).toString("hex"),
    };

    instance.orders.create(options, (error, order) => {
      console.log(error);
      if (error) {
        throw new apiError(500, "Something went wrong");
      }

      return res
        .status(200)
        .json(new apiResponse(order, "Order Created Successfully"));
    });
  };

  razorpayVerify = async (req, res) => {
    //   const { razorpay_order_id, razorpay_payment_id, razorpay_signature } =
    //     req.body;

    //   const sign = razorpay_order_id + "|" + razorpay_payment_id;
    //   const expectedSign = crypto
    //     .createHmac("sha256", process.env.RAZORPAY_SECRET_KEY)
    //     .update(sign.toString())
    //     .digest("hex");

    //   if (razorpay_signature === expectedSign) {
    //     return res
    //       .status(200)
    //       .json(
    //         new apiResponse({ success: true }, "Payment verified Successfully")
    //       );
    //   } else {
    //     throw new apiError(400, "Invalid signature sent!");
    //   }

    console.log("Req Body by RazorPay", req.body.payload.payment.entity);
    const shasum = crypto.createHmac(
      "sha256",
      process.env.RAZORPAY_WEBHOOK_SECRET
    );
    shasum.update(JSON.stringify(req.body));
    const digest = shasum.digest("hex");

    console.log(digest, req.headers["x-razorpay-signature"]);

    if (!(digest === req.headers["x-razorpay-signature"])) {
      throw new apiError(400, "Invalid Transaction");
    }

    return res.status(200).json(new apiResponse(true, "Valid Transaction"));
  };
}
module.exports = PaymentService;
