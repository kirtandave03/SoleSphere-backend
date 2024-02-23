const Router = require("express").Router;
const authRouter = require("./auth.routes");
const userRouter = require("./user.routes");
const productRouter = require("./product.routes");
const categoryRouter = require("./category.routes");
const brandRouter = require("./brand.rotes");

const router = Router();
router.get("/", (req, res) => {
  res.send("Hello word");
});
router.use("/auth", authRouter);
router.use("/users", userRouter);
router.use("/products", productRouter);
router.use("/categories", categoryRouter);
router.use("/brands", brandRouter);

module.exports = router;
