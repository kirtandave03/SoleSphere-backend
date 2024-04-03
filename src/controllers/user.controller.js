const asyncHandler = require("../utils/asyncHandler");
const UserService = require("../services/user.service");

const userService = new UserService();

const userDetail = asyncHandler(userService.userDetails);
const deleteUser = asyncHandler(userService.deleteUser);

const userProfilePic = asyncHandler(userService.userProfile);
const updateUserPhone = asyncHandler(userService.updateUserPhone);
const updateUserAddress = asyncHandler(userService.updateUserAddress);
const deleteUserAddress = asyncHandler(userService.deleteUserAddress);

const getCurrentUser = asyncHandler(userService.getCurrentUser);

const addToWishList = asyncHandler(userService.addToWishList);
const getWishList = asyncHandler(userService.getWishList);
const removeItemFromWishList = asyncHandler(userService.removeItemFromWishList);

module.exports = {
  userDetail,
  deleteUser,
  userProfilePic,
  getCurrentUser,
  updateUserPhone,
  updateUserAddress,
  addToWishList,
  getWishList,
  removeItemFromWishList,
  deleteUserAddress,
};
