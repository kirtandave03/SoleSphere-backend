const User = require("../models/user.model");
const apiError = require("../interfaces/apiError");
const asyncHandler = require("../interfaces/asyncHandler");
const apiResponse = require("../interfaces/apiResponse");
const uploadOnCloudinary = require('../sevices/cloudinary')


/*
create auth service and userService different and split the code
*/

const userDetail = asyncHandler(async (req, res) => {
  const { email, phone, address } = req.body;

  // console.log("Request Body :",req.body);

  if ([email].some((field) => field?.trim() === "")) {
    throw new apiError(400, "All fields are required");
  }

  const existingUser = await User.findOne({ email });

  if (!existingUser) {
    throw new apiError(404, "User not found");
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

  const user = await User.findByIdAndUpdate(existingUser._id,
    {
      $set: {
        phone,
        address,
        profilePic: profilePic.url || "",
      }

    });

  const createdUser = await User.findById(user._id).select("-password");

  if (!createdUser) {
    throw new apiError(500, "Something went wrong while registering the user");
  }

  res
    .status(201)
    .json(new apiResponse(createdUser, "User Created Sucessfully"));
});

module.exports =  userDetail ;
