const User = require("../models/user.model");
const Otp = require('../models/otp.model');
const apiError = require("../interfaces/apiError");
const asyncHandler = require("../interfaces/asyncHandler");
const apiResponse = require("../interfaces/apiResponse");
const sendMail = require('../sevices/mailer');
const z = require('zod');

const signupUserValidator = z.object({
  username: z.string().min(4).max(32).regex(/^[a-zA-Z0-9]+$/),
  email: z.string().email(),
});

const loginUserValidator = z.object({
  email: z.string().email(),
  password: z.string().min(8).max(12).regex(
    /^(?=.*[a-z]{3})(?=.*[A-Z]{3})(?=.*[!@#$%&*])(?=.*\d)[a-zA-Z\d!@#$%&*]{8,12}$/
  ),
});

const generateOtp = async () => {
  const otp = Math.floor(1000 + Math.random() * 9000)
  return otp;
}

const signupUser = asyncHandler(async (req, res) => {
  const { username, email } = signupUserValidator.parse(req.body);

  if ([username, email].some((field) => field?.trim() === "")) {
    throw new apiError(400, "All fields are required");
  }

  const existingUser = await User.findOne({ email });

  
  if (existingUser) {
    throw new apiError(409, "User with email already exist");
  }

  const otp = await generateOtp();

  await Otp.findOneAndUpdate(
    { email },
    { otp: otp, isVerified: false },
    { new: true, upsert: true, setDefaultsOnInsert: true }
  )

  const content = `<p>Hello , ${username} <br> <b> ${otp} </b>is your one time verification(OTP) for your SoleSphere Account, valid for 90 seconds.
    Please do not share with others.`

  sendMail(email, 'Login otp', content)
  res
    .status(201)
    .json(new apiResponse({ user: { username, email } }, "Otp has been sent successfully!"));
})

const verifyOtp = asyncHandler(async (req, res) => {

  const { username, email, password, otp } = req.body;

  if ([username, email, password, otp].some((field) => field?.trim() === "")) {
    throw new apiError(400, "All fields are required");
  }

  const otpData = await Otp.findOne({ email, otp });

  if (!otpData) {
    throw new apiError(400, "Incorrect OTP!");
  }

  const user = await User.create({
    username: username.toLowerCase(),
    email,
    password,
  });

  const createdUser = await User.findById(user._id).select("-password");

  if (!createdUser) {
    throw new apiError(500, "Something went wrong while registering the user");
  }

  await Otp.deleteOne({ email });
  res
    .status(201)
    .json(new apiResponse(createdUser, "User Created Sucessfully"));
})

const loginUser = asyncHandler(async (req, res) => {

  const { email, password } = loginUserValidator.parse(req.body);
  console.log("password : ", password)
  if (!email || !password) {

    throw new apiError(400, "Email and password are required");
  }

  const user = await User.findOne({ email });

  if (!user) {
    throw new apiError(400, "User not exist");
  }

  const isPassValid = await user.isPasswordCorrect(password);
  console.log(isPassValid);

  if (!isPassValid) {
    throw new apiError(401, "Invalid credentials");
  }

  const accessToken = user.generateAccessToken();

  const loggedInUser = await User.findById(user._id).select("-password");

  return res.status(200).json(
    new apiResponse(
      {
        user: loggedInUser,
        accessToken,
      },
      "Login successfully!"
    )
  );
});


module.exports = { signupUser, verifyOtp, loginUser }