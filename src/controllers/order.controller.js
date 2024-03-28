const OrderService = require("../services/order.service");
const asyncHandler = require("../utils/asyncHandler");

const orderService = new OrderService();

const getUserOrders = asyncHandler(orderService.getUserOrders);
const purchase = asyncHandler(orderService.purchase);

module.exports = { purchase, getUserOrders };
