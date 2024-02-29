const apiError = require("../interfaces/apiError");
const apiResponse = require("../interfaces/apiResponse");
const SubCategory = require("../models/subcategory.model");
class SubCategoryService {
  constructor() {}

  addSubCategory = async (req, res) => {
    const { subCategory } = req.body;

    if (!subCategory) {
      throw new apiError(400, "sub-category is required");
    }
    const subCatData = await SubCategory.create({ subCategory });

    return res
      .status(200)
      .json(new apiResponse(subCatData, "sub-category added successfully"));
  };

  deleteSubCategory = async (req, res) => {
    const { subCategory } = req.body;

    const existingSubCategory = await SubCategory.findOneAndDelete({
      subCategory,
    });

    if (!existingSubCategory) {
      throw new apiError(404, "sub-category not found");
    }

    return res
      .status(200)
      .json(
        new apiResponse(
          existingSubCategory,
          "sub-category deleted successfully"
        )
      );
  };

  updateSubCategory = async (req, res) => {
    const { oldSubCategory, subCategory } = req.body;

    const subCatData = await SubCategory.findOneAndUpdate(
      { subCategory: oldSubCategory },
      { subCategory: subCategory.toLowerCase() }
    );

    if (!subCatData) {
      throw new apiError(400, "sub-category not found");
    }

    return res
      .status(200)
      .json(new apiResponse(subCatData, "Sub-Category updated successfully"));
  };
}

module.exports = SubCategoryService;
