const asyncHandler = require("../utils/asyncHandler");

const ScreenUpdatingService = require("../services/frontend.service");
const screenUpdatingService = new ScreenUpdatingService();

const screenUpdation = asyncHandler(screenUpdatingService.updateSplashScreen);
const getScreen = asyncHandler(screenUpdatingService.getSplashScreen);

module.exports = { screenUpdation, getScreen };
