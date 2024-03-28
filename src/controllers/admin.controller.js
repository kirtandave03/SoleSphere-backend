const AdminService = require("../services/admin.service");
const asyncHandler = require("../utils/asyncHandler");
const adminService = new AdminService();

const getAllUsers = asyncHandler(adminService.getAllUsers);
const deleteUser = asyncHandler(adminService.deleteUser);
const restoreUser = asyncHandler(adminService.restoreUser);
const deletedProduct = asyncHandler(adminService.deleteProduct);
const restoreProduct = asyncHandler(adminService.restoreProduct);
const addProduct = asyncHandler(adminService.addProduct);
const addVariant = asyncHandler(adminService.addVariant);
const editProduct = asyncHandler(adminService.editProduct);
const getAllOrders = asyncHandler(adminService.getAllOrders);

module.exports = {
  getAllUsers,
  deleteUser,
  restoreUser,
  deletedProduct,
  restoreProduct,
  addProduct,
  addVariant,
  editProduct,
  getAllOrders,
};
