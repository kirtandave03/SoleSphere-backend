const AdminService = require("../services/admin.service");
const asyncHandler = require("../utils/asyncHandler");
const adminService = new AdminService();

const getAllUsers = asyncHandler(adminService.getAllUsers);
const deleteUser = asyncHandler(adminService.deleteUser);

module.exports = { getAllUsers, deleteUser };
