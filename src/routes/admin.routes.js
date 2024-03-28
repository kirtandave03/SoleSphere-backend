const Router = require("express").Router;
const router = Router();
const {
  getAllUsers,
  deleteUser,
  restoreUser,
  deletedProduct,
  restoreProduct,
  addProduct,
  addVariant,
  editProduct,
  getAllOrders,
} = require("../controllers/admin.controller");

const verifyJWT = require("../middlewares/auth.middleware");

// Users
router.get("/users", verifyJWT, getAllUsers);
router.delete("/users/:_id", verifyJWT, deleteUser);
router.put("/users/:_id", verifyJWT, restoreUser);

// Products
router.post("/products", verifyJWT, addProduct);
router.post("/products/add-variant", verifyJWT, addVariant);
router.delete("/products/:productName", verifyJWT, deletedProduct);
router.post("/products/edit-product", verifyJWT, editProduct);
router.put("/products/:_id", verifyJWT, restoreProduct);

// Orders
router.get("/orders", verifyJWT, getAllOrders);

module.exports = router;
