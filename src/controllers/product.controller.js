const asyncHandler = require("../utils/asyncHandler");
const ProductService = require("../services/product.service");

const productService = new ProductService();

const addProduct = asyncHandler(productService.addProduct);
const addVariant = asyncHandler(productService.addVariant);
const getProducts = asyncHandler(productService.getProducts);
const deleteProduct = asyncHandler(productService.deleteProduct);
const addToCart = asyncHandler(productService.addToCart);
const getAllProducts = asyncHandler(productService.getAllProducts);
const getCart = asyncHandler(productService.getCart);
const productDetail = asyncHandler(productService.productDetail);
const deleteCartItem = asyncHandler(productService.deleteCartItem);
const getOrderSummary = asyncHandler(productService.getOrderSummary);
const editProduct = asyncHandler(productService.editProduct);

module.exports = {
  addProduct,
  addVariant,
  getProducts,
  deleteProduct,
  addToCart,
  productDetail,
  getCart,
  deleteCartItem,
  getOrderSummary,
  getAllProducts,
  editProduct,
};
