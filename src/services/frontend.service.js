const OnBoardScreen = require("../models/onBoardScreen.model");
const apiError = require("../interfaces/apiError");
const apiResponse = require("../interfaces/apiResponse");
const { uploadOnCloudinary } = require("../services/cloudinary");

class screenUpdatingService {
  constructor() {}

  updateOnBoardScreen = async (req, res) => {
    const { name, title, subtitle } = req.body;

    var splashImageLocalPath;

    if (
      req.files &&
      Array.isArray(req.files.image) &&
      req.files.image.length > 0
    ) {
      splashImageLocalPath = req.files.image[0].path;
    }

    console.log("Request Files : ", req.files);

    const image = await uploadOnCloudinary(splashImageLocalPath);

    const updatedOnBoardScreen = await OnBoardScreen.findOneAndUpdate(
      { name },
      {
        title,
        subtitle,
        image: image.url || "",
      },
      { new: true, upsert: true, setDefaultsOnInsert: true }
    );

    if (!updatedOnBoardScreen) {
      throw new apiError(500, "Something went wrong while updating screen");
    }

    res
      .status(201)
      .json(
        new apiResponse(
          updatedOnBoardScreen,
          "Splash Screen Updated Successfully"
        )
      );
  };

  //   createOnBoardScreen = async (req, res) => {
  //     const { name, title, subtitle } = req.body;

  //     if ([name, title, subtitle].some((field) => field?.trim() === "")) {
  //       throw new apiError(400, "All fields are required");
  //     }

  //     const existedScreen = await OnBoardScreen.findOne({ name });

  //     if (existedScreen) {
  //       throw new apiError(409, `Screen with ${name} already exist`);
  //     }

  //     var splashImageLocalPath;

  //     if (
  //       req.files &&
  //       Array.isArray(req.files.image) &&
  //       req.files.image.length > 0
  //     ) {
  //       splashImageLocalPath = req.files.image[0].path;
  //     }

  //     console.log("Request Files : ", req.files);

  //     const image = await uploadOnCloudinary(splashImageLocalPath);

  //     const screen = new OnBoardScreen({
  //       name,
  //       title,
  //       subtitle,
  //       image: image.url,
  //     });

  //     const createdScreen = await screen.save();

  //     if (!createdScreen) {
  //       throw new apiError(500, "Error while creating screen");
  //     }

  //     return res
  //       .status(201)
  //       .json(new apiResponse(createdScreen, "Screen Created successfully"));
  //   };

  getOnBoardScreen = async (req, res) => {
    const { name } = req.body;

    const screen = await OnBoardScreen.find();

    if (!screen) {
      throw new apiError(404, "No Screen found");
    }

    res.status(200).json(new apiResponse(screen, "Screen sent successfully"));
  };
}

module.exports = screenUpdatingService;
