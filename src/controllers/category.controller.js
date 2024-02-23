const asyncHandler = require("../utils/asyncHandler");
const CategoryService = require("../services/category.service");

const categoryService = new CategoryService();

const addCategory = asyncHandler(categoryService.addCategory);

const deleteCategory = asyncHandler(categoryService.deleteCategory);

const updateCategory = asyncHandler(categoryService.updateCategory);

module.exports = { addCategory, deleteCategory, updateCategory };
