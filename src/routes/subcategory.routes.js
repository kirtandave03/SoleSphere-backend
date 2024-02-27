const {
  addSubCategory,
  deleteSubCategory,
  updateSubCategory,
} = require("../controllers/subcategory.controller");

const verifyJWT = require("../middlewares/auth.middleware");

const Router = require("express").Router;
const router = Router();

router.post("/", verifyJWT, addSubCategory);
router.delete("/", verifyJWT, deleteSubCategory);
router.put("/", verifyJWT, updateSubCategory);

module.exports = router;
