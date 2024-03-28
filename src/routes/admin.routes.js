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
} = require("../controllers/admin.controller");

const verifyJWT = require("../middlewares/auth.middleware");

router.get("/users", verifyJWT, getAllUsers);
router.delete("/users/:_id", verifyJWT, deleteUser);
router.put("/users/:_id", verifyJWT, restoreUser);

router.post("/products", verifyJWT, addProduct);
router.post("/products/add-variant", verifyJWT, addVariant);
router.delete("/products/:productName", verifyJWT, deletedProduct);
router.post("/products/edit-product", verifyJWT, editProduct);
router.put("/products/:_id", verifyJWT, restoreProduct);

module.exports = router;
