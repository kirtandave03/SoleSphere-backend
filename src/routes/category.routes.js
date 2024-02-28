const {
  addCategory,
  deleteCategory,
  updateCategory,
  getAllCategories,
} = require("../controllers/category.controller");

const verifyJWT = require("../middlewares/auth.middleware");

const Router = require("express").Router;
const router = Router();

router.post("/", verifyJWT, addCategory);
router.delete("/", verifyJWT, deleteCategory);
router.put("/", verifyJWT, updateCategory);
router.get("/", getAllCategories);

module.exports = router;
