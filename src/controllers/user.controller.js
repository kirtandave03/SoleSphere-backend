const asyncHandler = require("../interfaces/asyncHandler");
const UserService = require("../sevices/user.service");

const userService = new UserService();

const userDetail = asyncHandler(userService.userdetails);
const deleteUser = asyncHandler(userService.deleteUser);

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
