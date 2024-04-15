const OrderService = require("../services/order.service");
const asyncHandler = require("../utils/asyncHandler");

const orderService = new OrderService();

const getUserOrders = asyncHandler(orderService.getUserOrders);
const purchase = asyncHandler(orderService.purchase);
const razorpayRefund = asyncHandler(orderService.razorpayRefund);

module.exports = { purchase, getUserOrders, razorpayRefund };
