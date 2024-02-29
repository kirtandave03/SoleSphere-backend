const {
  addBrand,
  deleteBrand,
  updateBrand,
  getAllBrands,
} = require("../controllers/brand.controller");

const verifyJWT = require("../middlewares/auth.middleware");
const upload = require("../middlewares/multer.middleware");

const Router = require("express").Router;
const router = Router();

router.post("/", verifyJWT, upload.single("brandIcon"), addBrand);
router.delete("/", verifyJWT, deleteBrand);
router.put("/", verifyJWT, updateBrand);
router.get("/", getAllBrands);

module.exports = router;
