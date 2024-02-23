const apiError = require("../interfaces/apiError");
const apiResponse = require("../interfaces/apiResponse");
const Category = require("../models/category.model");
class CategoryService {
  constructor() {}

  addCategory = async (req, res) => {
    const { category } = req.body;

    if (!category) {
      throw new apiError(400, "category is required");
    }
    const catData = await Category.create({ category });

    return res
      .status(200)
      .json(new apiResponse(catData, "Category added successfully"));
  };

  deleteCategory = async (req, res) => {
    const { category } = req.body;

    const existingCategory = await Category.findOneAndDelete({ category });

    if (!existingCategory) {
      throw new apiError(404, "Category not found");
    }

    return res
      .status(200)
      .json(new apiResponse(existingCategory, "Category deleted successfully"));
  };

  updateCategory = async (req, res) => {
    const { oldCategory, category } = req.body;

    const catData = await Category.findOneAndUpdate(
      { category: oldCategory },
      { category: category.toLowerCase() }
    );

    if (!catData) {
      throw new apiError(400, "Category not found");
    }

    return res
      .status(200)
      .json(new apiResponse(catData, "Category updated successfully"));
  };
}

module.exports = CategoryService;
