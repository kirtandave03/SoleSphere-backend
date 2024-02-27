const asyncHandler = require("../utils/asyncHandler");
const ProductService = require("../services/product.service");

const productService = new ProductService();
const addProduct = asyncHandler(productService.addProduct);

module.exports = { addProduct };
