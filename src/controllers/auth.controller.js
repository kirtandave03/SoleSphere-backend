const AuthService = require("../sevices/auth.service");
const asyncHandler = require("../utils/asyncHandler");

const authService = new AuthService();

const signupUser = asyncHandler(authService.signupUser);

const verifyOtp = asyncHandler(authService.verifyOtp);

const loginUser = asyncHandler(authService.loginUser);

module.exports = { signupUser, verifyOtp, loginUser };
