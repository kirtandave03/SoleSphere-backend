const {
  getProducts,
  addToCart,
  productDetail,
  getCart,
  deleteCartItem,
  getAllProducts,
  getOrderSummary,
  searchProduct,
  getAllDeletedProducts,
} = require("../controllers/product.controller");

const verifyToken = require("../middlewares/firebase_auth.middleware");
const Router = require("express").Router;

const router = Router();

// Open Routes
router.get("/", getProducts);
router.get("/all-products", getAllProducts);
router.get("/product-detail", productDetail);
router.get("/search", searchProduct);
router.get("/all-deleted-products", getAllDeletedProducts);

// Secure Routes
router.post("/add-to-cart", verifyToken, addToCart);
router.get("/get-cart", verifyToken, getCart);
router.delete("/delete-cart-item", verifyToken, deleteCartItem);
router.get("/order-summary", verifyToken, getOrderSummary);

module.exports = router;
