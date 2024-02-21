const User = require("../models/user.model");
const apiError = require("../interfaces/apiError");
const asyncHandler = require("../interfaces/asyncHandler");
const apiResponse = require("../interfaces/apiResponse");
const uploadOnCloudinary = require("../sevices/cloudinary");
const { UserService } = require("../sevices/user.service");

const userService = new UserService();

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

  const user = await User.findByIdAndUpdate(existingUser._id, {
    $set: {
      phone,
      address,
      profilePic: profilePic.url || "",
    },
  });

  const createdUser = await User.findById(user._id).select("-password");

  if (!createdUser) {
    throw new apiError(500, "Something went wrong while registering the user");
  }

  res
    .status(201)
    .json(new apiResponse(createdUser, "User Created Successfully"));
});

const deleteUser = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user._id);
  // const user = userService.addUser();

  if (!user) {
    throw new apiError(404, "User not found");
  }

  await user.delete();

  return res
    .status(200)
    .json(new apiResponse(user, "User deleted successfully"));
});

const updateUserProfilePic = asyncHandler(async (req, res) => {
  const ProfilePicLocalPath = req.file?.path;

  if (!ProfilePicLocalPath) {
    throw new apiError(400, "ProfilePic file is missing");
  }

  const ProfilePic = await uploadOnCloudinary(ProfilePicLocalPath);

  if (!ProfilePic.url) {
    throw new apiError(400, "error while uploading on cloud");
  }

  const user = await User.findByIdAndUpdate(
    req.user?._id,
    {
      $set: {
        ProfilePic: ProfilePic.url,
      },
    },
    { new: true }
  ).select("-password");

  return res
    .status(200)
    .json(new apiResponse(200, user, "ProfilePic image updated successfully"));
});

// const logoutUser = asyncHandler(async (req, res) => {
//   await User.findByIdAndUpdate(
//     req.user._id,
//     {
//       $unset: {
//         accessToken: 1, //removes field from the document
//       },
//     },
//     {
//       new: true,
//     }
//   );

//   const options = {
//     httpsOnly: true,
//     secure: true,
//   };

//   return res
//     .status(200)
//     .clearCookie("accessToken", options)
//     .json(new apiResponse(200, {}, "User logged out"));
// });

module.exports = { userDetail, deleteUser, updateUserProfilePic };
