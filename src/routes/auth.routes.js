const Router = require("express").Router;
const {
  signupUser,
  verifyOtp,
  loginUser,
  forgotPassword,
  forgotPasswordotp,
  changePassword,
  createUser,
  sendOtp,
  verifyAdmin,
  deleteUser,
  isUser,
} = require("../controllers/auth.controller");
const verifyJWT = require("../middlewares/auth.middleware");

const authRouter = Router();

authRouter.post("/", createUser);

authRouter.post("/login", loginUser);

authRouter.post("/signup", signupUser);

authRouter.post("/verify-otp", verifyOtp);

authRouter.post("/forgot-password", forgotPassword);

authRouter.post("/forgot-password-verify", forgotPasswordotp);

authRouter.post("/change-password", changePassword);

authRouter.post("/get-otp", sendOtp);

authRouter.get("/verify-token", verifyJWT, verifyAdmin);

authRouter.delete("/", deleteUser);

authRouter.post("/isuser", isUser);

module.exports = authRouter;
