const asyncHandler = require("../utils/asyncHandler");
const ProductService = require("../services/product.service");

const productService = new ProductService();

const addProduct = asyncHandler(productService.addProduct);
const addVariant = asyncHandler(productService.addVariant);
const getProducts = asyncHandler(productService.getProducts);
const deleteProduct = asyncHandler(productService.deleteProduct);
const addToCart = asyncHandler(productService.addToCart);
const productDetail = asyncHandler(productService.productDetail);
const addToWishList = asyncHandler(productService.addToWishList);

module.exports = {
  addProduct,
  addVariant,
  getProducts,
  deleteProduct,
  addToCart,
  productDetail,
  addToWishList,
};
