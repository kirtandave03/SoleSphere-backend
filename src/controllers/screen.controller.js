const asyncHandler = require("../utils/asyncHandler");

const ScreenUpdatingService = require("../services/frontend.service");
const screenUpdatingService = new ScreenUpdatingService();

const screenUpdation = asyncHandler(screenUpdatingService.updateOnBoardScreen);
const getScreen = asyncHandler(screenUpdatingService.getOnBoardScreen);

module.exports = { screenUpdation, getScreen };
