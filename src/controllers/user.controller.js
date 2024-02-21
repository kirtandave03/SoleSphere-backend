const asyncHandler = require("../interfaces/asyncHandler");
const UserService = require("../sevices/user.service");

const userService = new UserService();

const userDetail = asyncHandler(userService.userdetails);
const deleteUser = asyncHandler(userService.deleteUser);
const updateUserProfilePic = asyncHandler(userService.updateUserProfilePic);

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
