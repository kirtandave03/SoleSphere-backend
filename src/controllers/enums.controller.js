const EnumsService = require("../services/enums.service");
const asyncHandler = require("../utils/asyncHandler");
const enumsService = new EnumsService();

const getAllEnums = asyncHandler(enumsService.getAllEnums);

module.exports = { getAllEnums };
