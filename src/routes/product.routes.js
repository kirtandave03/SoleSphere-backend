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
} = require("../controllers/product.controller.model");

const verifyJWT = require("../middlewares/auth.middleware");
const Router = require("express").Router;

const router = Router();

router.post("/", verifyJWT, addProduct);
router.get("/", getProducts);
router.get("/all-products", getAllProducts);
router.post("/add-variant", verifyJWT, addVariant);
router.delete("/", verifyJWT, deleteProduct);
router.post("/add-to-cart", verifyJWT, addToCart);
router.get("/get-cart", verifyJWT, getCart);
router.get("/product-detail", productDetail);
router.delete("/delete-cart-item", verifyJWT, deleteCartItem);
router.get("/order-summary", verifyJWT, getOrderSummary);

module.exports = router;
