const {
  addProduct,
  addVariant,
  getProducts,
  deleteProduct,
  addToCart,
  productDetail,
  getCart,
  deleteCartItem,
  getAllProducts,
  getOrderSummary,
  editProduct,
} = require("../controllers/product.controller.model");

const verifyJWT = require("../middlewares/auth.middleware");
const verifyToken = require("../middlewares/firebase_auth.middleware");
const Router = require("express").Router;

const router = Router();

router.post("/", verifyJWT, addProduct);
router.get("/", getProducts);
router.get("/all-products", getAllProducts);
router.post("/add-variant", verifyJWT, addVariant);
router.delete("/", verifyJWT, deleteProduct);
router.get("/product-detail", productDetail);
router.post("/edit-product", verifyJWT, editProduct);

router.post("/add-to-cart", verifyToken, addToCart);
router.get("/get-cart", verifyToken, getCart);
router.delete("/delete-cart-item", verifyToken, deleteCartItem);
router.get("/order-summary", verifyToken, getOrderSummary);

module.exports = router;
