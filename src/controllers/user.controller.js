const User = require("../models/user.model");
const apiError = require("../utils/apiError");
const asyncHandler = require("../utils/asyncHandler");
const apiResponse = require("../utils/apiResponse");
const upload = require("../middlewares/multer.middleware");
const uploadOnCloudinary = require('../utils/cloudinary')



const userDetail = asyncHandler(async (req, res) => {
  const { username, email,phone, address, password } = req.body;

  // console.log("Request Body :",req.body);

  if ([username, email,phone, password].some((field) => field?.trim() === "")) {
    throw new apiError(400, "All fields are required");
  }

  const existedUser = await User.findOne({email});

  if (existedUser) {
    throw new apiError(409, "User with username or email already exist");
  }

  var profilePicLocalPath;

  if (
    req.files &&
    Array.isArray(req.files.profilePic) &&
    req.files.profilePic.length > 0
  ) {
    profilePicLocalPath = req.files.profilePic[0].path;
  }

  console.log("Request Files : ", req.files);

  const profilePic = await uploadOnCloudinary(profilePicLocalPath);

  const user = await User.create({
    username: username.toLowerCase(),
    email,
    phone,
    password,
    address,
    profilePic: profilePic.url || "",
  });

  const createdUser = await User.findById(user._id).select("-password");

  if (!createdUser) {
    throw new apiError(500, "Something went wrong while registering the user");
  }

  res
    .status(201)
    .json(new apiResponse(200, createdUser, "User Created Sucessfully"));
});

const loginUser = asyncHandler(async (req, res) => {
  const { email, password } = req.body;
  console.log("password : ",password)
  if (!email || !password) {
    throw new apiError(400, "Email and password are required");
  }

  const user = await User.findOne({email});

  if (!user) {
    throw new apiError(400, "User not exist");
  }

  const isPassValid = await user.isPasswordCorrect(password);
  console.log(isPassValid);

  if (!isPassValid) {
    throw new apiError(400, "Invalid credentials");
  }

  const accessToken = user.genarateAccessToken();

  const loggedInUser = await User.findById(user._id).select("-password");

  return res.status(200).json(
    new apiResponse(
      200,
      {
        user: loggedInUser,
        accessToken,
      },
      "Login successfully!"
    )
  );
});

module.exports = { loginUser, userDetail };
