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

// Open Routes
router.get("/", getAllBrands);

// Admin Routes
router.post("/", verifyJWT, upload.single("brandIcon"), addBrand);
router.delete("/", verifyJWT, deleteBrand);
router.put("/", verifyJWT, upload.single("brandIcon"), updateBrand);

module.exports = router;
