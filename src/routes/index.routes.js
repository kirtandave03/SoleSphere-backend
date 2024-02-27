const Router = require("express").Router;
const authRouter = require("./auth.routes");
const userRouter = require("./user.routes");
const productRouter = require("./product.routes");
const categoryRouter = require("./category.routes");
const brandRouter = require("./brand.rotes");
const subCategoryRouter = require("./subcategory.routes");
const uploadFile = require("../controllers/fileupload.controller");
const upload = require("../middlewares/multer.middleware");
const router = Router();

router.get("/", (req, res) => {
  res.send("Hello word");
});

router.post("/file-upload", upload.array("images"), uploadFile);

router.use("/auth", authRouter);
router.use("/users", userRouter);
router.use("/products", productRouter);
router.use("/categories", categoryRouter);
router.use("/brands", brandRouter);
router.use("/subcategories", subCategoryRouter);
router.use("/products", productRouter);

module.exports = router;
