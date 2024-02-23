const apiError = require("../interfaces/apiError");
const apiResponse = require("../interfaces/apiResponse");
const Brand = require("../models/brand.model");
class BrandService {
  constructor() {}

  addBrand = async (req, res) => {
    const { brand } = req.body;

    if (!brand) {
      throw new apiError(400, "brand is required");
    }
    const brandData = await Brand.create({ brand });

    return res
      .status(200)
      .json(new apiResponse(brandData, "Brand added successfully"));
  };

  deleteBrand = async (req, res) => {
    const { brand } = req.body;

    const existingBrand = await Brand.findOneAndDelete({ brand });

    if (!existingBrand) {
      throw new apiError(404, "Brand not found");
    }

    return res
      .status(200)
      .json(new apiResponse(existingBrand, "Brand deleted successfully"));
  };

  updateBrand = async (req, res) => {
    const { oldBrand, brand } = req.body;

    const brandData = await Brand.findOneAndUpdate(
      { brand: oldBrand },
      { brand: brand.toLowerCase() }
    );

    if (!brandData) {
      throw new apiError(400, "Brand not found");
    }

    return res
      .status(200)
      .json(new apiResponse(brandData, "Brand updated successfully"));
  };
}

module.exports = BrandService;
