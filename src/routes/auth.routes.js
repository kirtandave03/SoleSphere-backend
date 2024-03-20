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
} = require("../controllers/auth.controller");

const authRouter = Router();

authRouter.post("/", createUser);

authRouter.post("/login", loginUser);

authRouter.post("/signup", signupUser);

authRouter.post("/verify-otp", verifyOtp);

authRouter.post("/forgot-password", forgotPassword);

authRouter.post("/forgot-password-verify", forgotPasswordotp);

authRouter.post("/change-password", changePassword);

authRouter.post("/get-otp", sendOtp);

module.exports = authRouter;
