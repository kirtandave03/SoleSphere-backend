const Router = require("express").Router;
const {
  signupUser,
  verifyOtp,
  loginUser,
  forgotPassword,
  forgotPasswordotp,
  changePassword,
} = require("../controllers/auth.controller");

const authRouter = Router();

authRouter.post("/login", loginUser);

authRouter.post("/signup", signupUser);

authRouter.post("/verify-otp", verifyOtp);

authRouter.post("/forgot-password", forgotPassword);

authRouter.post("/forgot-password-otp", forgotPasswordotp);

authRouter.post("/change-password", changePassword);

module.exports = authRouter;
