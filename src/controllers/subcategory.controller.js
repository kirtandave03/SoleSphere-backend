const asyncHandler = require("../utils/asyncHandler");
const SubCategoryService = require("../services/subcategory.service");

const subCategoryService = new SubCategoryService();

const addSubCategory = asyncHandler(subCategoryService.addSubCategory);

const deleteSubCategory = asyncHandler(subCategoryService.deleteSubCategory);

const updateSubCategory = asyncHandler(subCategoryService.updateSubCategory);

module.exports = { addSubCategory, deleteSubCategory, updateSubCategory };
