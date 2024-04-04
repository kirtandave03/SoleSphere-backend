const apiError = require("../interfaces/apiError");
const apiResponse = require("../interfaces/apiResponse");
const Brand = require("../models/brand.model");
const { uploadOnCloudinary, deleteOnCloudinary } = require("./cloudinary");
const fs = require("fs");
class BrandService {
  constructor() {}

  addBrand = async (req, res) => {
    const { brand } = req.body;
    const brandIconLocalPath = req.file?.path;

    if (!brand) {
      throw new apiError(400, "brand is required");
    }

    const existedBrand = await Brand.findOne({ brand });

    if (existedBrand) {
      fs.unlinkSync(brandIconLocalPath);
      throw new apiError(400, "Brand already exists");
    }

    if (!brandIconLocalPath) {
      throw new apiError(400, "Brand icon is missing");
    }

    const brandIcon = await uploadOnCloudinary(brandIconLocalPath);

    if (!brandIcon.url) {
      throw new apiError(500, "Error while uploading file");
    }

    const brandData = new Brand({
      brand,
      brandIcon: brandIcon.url,
    });

    await brandData.save();

    return res
      .status(200)
      .json(new apiResponse(brandData, "Brand added successfully"));
  };

  deleteBrand = async (req, res) => {
    const { brand } = req.body;

    if (!brand) {
      throw new apiError(400, "Brand Is Required");
    }

    const existingBrand = await Brand.findOneAndDelete({ brand });

    if (!existingBrand) {
      throw new apiError(404, "Brand not found");
    }

    const url = existingBrand.brandIcon;

    const isDeleted = await deleteOnCloudinary(url);

    if (!isDeleted) {
      throw new apiError(500, "error while deleting old brand icon");
    }

    return res
      .status(200)
      .json(new apiResponse(existingBrand, "Brand deleted successfully"));
  };

  updateBrand = async (req, res) => {
    const { oldBrand, brand } = req.body;
    const brandIconLocalPath = req.file?.path;

    if (!oldBrand || !brand) {
      throw new apiError(400, "old Brand name or updated brand name missing");
    }

    const existingBrand = await Brand.findOne({ brand: oldBrand });

    if (!existingBrand) {
      throw new apiError(404, "brand not exits");
    }

    const newBrand = await Brand.findOne({ brand: brand });

    if (newBrand) {
      throw new apiError(409, "brand already exists");
    }

    if (!brandIconLocalPath) {
      const brandData = await Brand.findOneAndUpdate(
        { brand: oldBrand.toLowerCase() },
        { brand: brand.toLowerCase() },
        {
          new: true,
        }
      );

      return res
        .status(200)
        .json(new apiResponse(brandData, "Brand updated successfully"));
    } else {
      const brandIcon = await uploadOnCloudinary(brandIconLocalPath);

      if (!brandIcon.url) {
        throw new apiError(500, "Error while uploading file");
      }

      const brandData = await Brand.findOneAndUpdate(
        { brand: oldBrand.toLowerCase() },
        { brand: brand.toLowerCase(), brandIcon: brandIcon.url },
        { new: true }
      );

      const url = existingBrand.brandIcon;

      const isDeleted = await deleteOnCloudinary(url);

      if (!isDeleted) {
        throw new apiError(500, "error while deleting old brand icon");
      }

      return res
        .status(200)
        .json(new apiResponse(brandData, "Brand updated successfully"));
    }
  };

  getAllBrands = async (req, res) => {
    const brands = await Brand.find().select("brand brandIcon");
    const brandLength = brands.length;

    if (!brands) {
      throw new apiError(404, "Brands not found");
    }

    return res
      .status(200)
      .json(new apiResponse({ brands, availableBrands: brandLength }));
  };
}

module.exports = BrandService;
