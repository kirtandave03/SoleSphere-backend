const asyncHandler = require("../interfaces/asyncHandler");
const UserService = require("../sevices/user.service");

const userService = new UserService();

const userDetail = asyncHandler(userService.userDetails);
const deleteUser = asyncHandler(userService.deleteUser);
const updateUserProfilePic = asyncHandler(userService.updateUserProfilePic);
const updateUserPhone = asyncHandler(userService.updateUserPhone);
const updateHomeAddress = asyncHandler(userService.updateHomeAddress);
const updateOfficeAddress = asyncHandler(userService.updateOfficeAddress);
const updateOtherAddress = asyncHandler(userService.updateOtherAddress);

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

module.exports = {
  userDetail,
  deleteUser,
  updateUserProfilePic,
  updateUserPhone,
  updateHomeAddress,
  updateOfficeAddress,
  updateOtherAddress,
};
