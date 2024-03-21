const PaymentService = require("../services/payment.service");
const asyncHandler = require("../utils/asyncHandler");

const paymentService = new PaymentService();

const razorpayOrder = asyncHandler(paymentService.razorpayOrder);
const razorpayVerify = asyncHandler(paymentService.razorpayVerify);

const order = asyncHandler(paymentService.order);

module.exports = { razorpayOrder, razorpayVerify, order };
