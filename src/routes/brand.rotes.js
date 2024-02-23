const {
  addBrand,
  deleteBrand,
  updateBrand,
} = require("../controllers/brand.controller");

const verifyJWT = require("../middlewares/auth.middleware");

const Router = require("express").Router;
const router = Router();

router.post("/", verifyJWT, addBrand);
router.delete("/", verifyJWT, deleteBrand);
router.put("/", verifyJWT, updateBrand);

module.exports = router;
