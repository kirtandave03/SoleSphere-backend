const AuthService = require("../services/auth.service");
const asyncHandler = require("../utils/asyncHandler");

const authService = new AuthService();

const createUser = asyncHandler(authService.createUser);

const signupUser = asyncHandler(authService.signupUser);

const verifyOtp = asyncHandler(authService.verifyOtp);

const loginUser = asyncHandler(authService.loginUser);

const forgotPassword = asyncHandler(authService.forgotPassword);

const forgotPasswordotp = asyncHandler(authService.forgotPasswordotp);

const changePassword = asyncHandler(authService.changePassword);
const deleteUser = asyncHandler(authService.deleteUser);
const sendOtp = asyncHandler(authService.sendOtp);
const verifyAdmin = asyncHandler(authService.verifyAdmin);
const isUser = asyncHandler(authService.isUser);

module.exports = {
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
};
