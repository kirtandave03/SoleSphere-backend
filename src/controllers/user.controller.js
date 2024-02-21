const asyncHandler = require("../interfaces/asyncHandler");
const UserService = require("../sevices/user.service");

const userService = new UserService();

const userDetail = asyncHandler(userService.userdetails);

const deleteUser = asyncHandler(userService.deleteUser);

const updateUserProfilePic = asyncHandler(userService.updateUserProfilePic);

const getCurrentUser = asyncHandler(userService.getCurrentUser);

module.exports = {
  userDetail,
  deleteUser,
  updateUserProfilePic,
  getCurrentUser,
};
