const {
  addCategory,
  deleteCategory,
  updateCategory,
  getAllCategories,
} = require("../controllers/category.controller");

const verifyJWT = require("../middlewares/auth.middleware");

const Router = require("express").Router;
const router = Router();

// Open Routes
router.get("/", getAllCategories);

// Admin Routes
router.post("/", verifyJWT, addCategory);
router.delete("/", verifyJWT, deleteCategory);
router.put("/", verifyJWT, updateCategory);

module.exports = router;
