const Razorpay = require("razorpay");

let instance = new Razorpay({
  key_id: process.env.RAZORPAY_ID_KEY,
  key_secret: process.env.RAZORPAY_SECRET_KEY,
});

const checkout = (req, res) => {};
