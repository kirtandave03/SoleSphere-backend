const AuthService = require("../sevices/auth.service");
const asyncHandler = require("../utils/asyncHandler");
const Otp = require("../models/otp.model");
const apiError = require("../interfaces/apiError");
const apiResponse = require("../interfaces/apiResponse");
const User = require("../models/user.model");

const authService = new AuthService();

const signupUser = asyncHandler(authService.signupUser);

const verifyOtp = asyncHandler(authService.verifyOtp);

const loginUser = asyncHandler(authService.loginUser);

module.exports = { signupUser, verifyOtp, loginUser };
