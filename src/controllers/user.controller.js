const asyncHandler = require("../interfaces/asyncHandler");
const UserService = require("../sevices/user.service");

const userService = new UserService();

const userDetail = asyncHandler(userService.userdetails);
const deleteUser = asyncHandler(userService.deleteUser);

module.exports = { userDetail, deleteUser };
