const asyncHandler = require("../utils/asyncHandler");
const ProductService = require("../services/product.service");

const productService = new ProductService();

const getProducts = asyncHandler(productService.getProducts);
const addToCart = asyncHandler(productService.addToCart);
const getAllProducts = asyncHandler(productService.getAllProducts);
const getCart = asyncHandler(productService.getCart);
const productDetail = asyncHandler(productService.productDetail);
const deleteCartItem = asyncHandler(productService.deleteCartItem);
const getOrderSummary = asyncHandler(productService.getOrderSummary);
const searchProduct = asyncHandler(productService.searchProduct);
const getAllDeletedProducts = asyncHandler(
  productService.getAllDeletedProducts
);

module.exports = {
  getProducts,
  addToCart,
  productDetail,
  getCart,
  deleteCartItem,
  getOrderSummary,
  getAllProducts,
  searchProduct,
  getAllDeletedProducts,
};
