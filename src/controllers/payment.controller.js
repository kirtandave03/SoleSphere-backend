const PaymentService = require("../services/payment.service");
const asyncHandler = require("../utils/asyncHandler");

const paymentService = new PaymentService();

const order = asyncHandler(paymentService.order);
const verify = asyncHandler(paymentService.verify);

module.exports = { order, verify };
