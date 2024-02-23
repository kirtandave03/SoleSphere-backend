const asyncHandler = require("../utils/asyncHandler");
const BrandService = require("../services/brand.service");

const brandService = new BrandService();

const addBrand = asyncHandler(brandService.addBrand);

const deleteBrand = asyncHandler(brandService.deleteBrand);

const updateBrand = asyncHandler(brandService.updateBrand);

module.exports = { addBrand, deleteBrand, updateBrand };
