const asyncHandler = require("../interfaces/asyncHandler");
const UserService = require("../services/user.service");

const userService = new UserService();

const userDetail = asyncHandler(userService.userDetails);
const deleteUser = asyncHandler(userService.deleteUser);

const updateUserProfilePic = asyncHandler(userService.updateUserProfilePic);
const updateUserPhone = asyncHandler(userService.updateUserPhone);
const updateUserAddress = asyncHandler(userService.updateUserAddress);

const getCurrentUser = asyncHandler(userService.getCurrentUser);

module.exports = {
  userDetail,
  deleteUser,
  updateUserProfilePic,
  getCurrentUser,
  updateUserPhone,
  updateUserAddress,
};
