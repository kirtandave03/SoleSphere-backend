const AuthService = require("../services/auth.service");
const asyncHandler = require("../utils/asyncHandler");

const authService = new AuthService();

const signupUser = asyncHandler(authService.signupUser);

const verifyOtp = asyncHandler(authService.verifyOtp);

const loginUser = asyncHandler(authService.loginUser);

const forgotPassword = asyncHandler(authService.forgotPassword);

const forgotPasswordotp = asyncHandler(authService.forgotPasswordotp);

const changePassword = asyncHandler(authService.changePassword);

module.exports = {
  signupUser,
  verifyOtp,
  loginUser,
  forgotPassword,
  forgotPasswordotp,
  changePassword,
};
