const Razorpay = require("razorpay");
const crypto = require("crypto");
const apiError = require("../interfaces/apiError");
const apiResponse = require("../interfaces/apiResponse");
class PaymentService {
  constructor() {}

  order = async (req, res) => {
    const instance = new Razorpay({
      key_id: process.env.RAZORPAY_ID_KEY,
      key_secret: process.env.RAZORPAY_SECRET_KEY,
    });

    const options = {
      amount: req.body.amount * 100,
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

  verify = async (req, res) => {
    const { razorpay_order_id, razorpay_payment_id, razorpay_signature } =
      req.body;
  };
}

module.exports = PaymentService;
