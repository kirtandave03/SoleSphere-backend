const asyncHandler = require("../utils/asyncHandler");
const ProductService = require("../services/product.service");

const productService = new ProductService();

const addProduct = asyncHandler(productService.addProduct);
const addVariant = asyncHandler(productService.addVariant);
const getProducts = asyncHandler(productService.getProducts);
const deleteProduct = asyncHandler(productService.deleteProduct);
const addToCart = asyncHandler(productService.addToCart);
// const searchProduct = asyncHandler(productService.searchProduct);
const productDetail = asyncHandler(productService.productDetail);

module.exports = {
  addProduct,
  addVariant,
  getProducts,
  deleteProduct,
  addToCart,
  productDetail,
};
