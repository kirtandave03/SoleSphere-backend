const Router = require("express").Router;
const authRouter = require("./auth.routes");
const userRouter = require("./user.routes");

const router = Router();
router.get("/", (req, res) => {
  res.send("Hello word");
});
router.use("/auth", authRouter);
router.use("/users", userRouter);

module.exports = router;
