const {
  addProduct,
  addVariant,
  getProducts,
  deleteProduct,
  addToCart,
} = require("../controllers/product.controller.model");
const verifyJWT = require("../middlewares/auth.middleware");
const upload = require("../middlewares/multer.middleware");
const Router = require("express").Router;

const router = Router();

router.post("/", verifyJWT, addProduct);
router.get("/", getProducts);
router.post("/add-variant", verifyJWT, addVariant);
router.delete("/", verifyJWT, deleteProduct);
router.post("/add-to-cart", verifyJWT, addToCart);

module.exports = router;
