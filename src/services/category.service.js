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

    const existingCat = await Category.findOne({ category });

    if (existingCat) {
      throw new apiError(400, "duplicate category");
    }

    // console.log(category);
    const catData = await Category.create({ category });

    return res
      .status(200)
      .json(new apiResponse(catData, "Category added successfully"));
  };

  deleteCategory = async (req, res) => {
    const { category } = req.body;

    if (!category) {
      throw new apiError(404, "Category not found");
    }

    const existedCategory = await Category.findOneAndDelete({
      category: category.toLowerCase(),
    });

    return res
      .status(200)
      .json(new apiResponse(existedCategory, "Category deleted successfully"));
  };

  updateCategory = async (req, res) => {
    const { oldCategory, category } = req.body;

    if (!oldCategory || !category) {
      throw new apiError(400, "OldCategory or the updated category required");
    }

    const existingCat = await Category.findOne({ category });

    if (existingCat) {
      throw new apiError(400, "the new category entered already exists");
    }

    const catData = await Category.findOneAndUpdate(
      { category: oldCategory },
      { category: category.toLowerCase() }
    );

    if (!catData) {
      throw new apiError(404, "Category not found");
    }

    return res
      .status(200)
      .json(new apiResponse(catData, "Category updated successfully"));
  };

  getAllCategories = async (req, res) => {
    const categories = await Category.find().select("category");
    const categoriesLength = categories.length;

    return res
      .status(200)
      .json(
        new apiResponse(
          { categories, availableCategories: categoriesLength },
          "Categories fetched successfully"
        )
      );
  };
}

module.exports = CategoryService;
