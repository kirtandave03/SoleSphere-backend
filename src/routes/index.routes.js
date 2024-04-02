const Router = require("express").Router;
const adminRouter = require("./admin.routes");
const authRouter = require("./auth.routes");
const userRouter = require("./user.routes");
const productRouter = require("./product.routes");
const categoryRouter = require("./category.routes");
const brandRouter = require("./brand.routes");
const splashScreenRouter = require("./onBoardScreen.route");
// const subCategoryRouter = require("./subcategory.routes");
const uploadFile = require("../controllers/fileupload.controller");
const reviewRouter = require("../routes/review.routes");
const orderRouter = require("./order.routes");
const enumsRouter = require("./enums.routes");
const paymentRouter = require("./payment.routes");
const upload = require("../middlewares/multer.middleware");
const verifyToken = require("../middlewares/firebase_auth.middleware");
const User = require("../models/user.model");
const router = Router();

router.get("/", verifyToken, async (req, res) => {
  const user = await User.findOne({ UID: req.user.UID });
  res.send(user);
});

router.post("/file-upload", upload.array("images"), uploadFile);

router.use("/admin", adminRouter);
router.use("/auth", authRouter);
router.use("/users", userRouter);
router.use("/products", productRouter);
router.use("/categories", categoryRouter);
router.use("/brands", brandRouter);
router.use("/products/reviews", reviewRouter);
// router.use("/subcategories", subCategoryRouter);
router.use("/onboard", splashScreenRouter);
router.use("/orders", orderRouter);
router.use("/payments", paymentRouter);
router.use("/enums", enumsRouter);

module.exports = router;
