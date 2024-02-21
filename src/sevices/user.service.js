const User = require("../models/user.model");
const apiError = require("../interfaces/apiError");
const apiResponse = require("../interfaces/apiResponse");
const {
  uploadOnCloudinary,
  deleteOnCloudinary,
} = require("../sevices/cloudinary");

class UserService {
  constructor() {}

  userdetails = async (req, res) => {
    const { email, phone, address } = req.body;

    // console.log("Request Body :",req.body);

    if ([email].some((field) => field?.trim() === "")) {
      throw new apiError(400, "All fields are required");
    }

    const existingUser = await User.findOne({ email });

    if (!existingUser) {
      throw new apiError(404, "User not found");
    }

    var profilePicLocalPath;

    if (
      req.files &&
      Array.isArray(req.files.profilePic) &&
      req.files.profilePic.length > 0
    ) {
      profilePicLocalPath = req.files.profilePic[0].path;
    }

    console.log("Request Files : ", req.files);

    const profilePic = await uploadOnCloudinary(profilePicLocalPath);

    const user = await User.findByIdAndUpdate(existingUser._id, {
      $set: {
        phone,
        address,
        profilePic: profilePic.url || "",
      },
    });

    const createdUser = await User.findById(user._id).select("-password");

    if (!createdUser) {
      throw new apiError(
        500,
        "Something went wrong while registering the user"
      );
    }

    res
      .status(201)
      .json(new apiResponse(createdUser, "User Created Successfully"));
  };

  deleteUser = async (req, res) => {
    const user = await User.findById(req.user._id);
    // const user = userService.addUser();

    if (!user) {
      throw new apiError(404, "User not found");
    }

    await user.delete();

    return res
      .status(200)
      .json(new apiResponse(user, "User deleted successfully"));
  };

  updateUserProfilePic = async (req, res) => {
    const ProfilePicLocalPath = req.file?.path;

    const userDocument = await User.findById(req.user?._id);
    const oldProfileLink = userDocument.profilePic;

    if (!ProfilePicLocalPath) {
      throw new apiError(400, "ProfilePic file is missing");
    }

    const ProfilePic = await uploadOnCloudinary(ProfilePicLocalPath);

    const isDeleted = await deleteOnCloudinary(oldProfileLink);

    if (!isDeleted) {
      throw new apiError(500, "error while deleting old profile");
    }

    if (!ProfilePic.url) {
      throw new apiError(400, "error while uploading on cloud");
    }

    const updatedUser = await User.findByIdAndUpdate(
      req.user?._id,
      {
        $set: {
          profilePic: ProfilePic.url,
        },
      },
      { new: true }
    ).select("-password");

    return res
      .status(200)
      .json(
        new apiResponse(
          200,
          updatedUser,
          "ProfilePic image updated successfully"
        )
      );
  };

  getCurrentUser = async (req, res) => {
    const user = await User.findById(req.user._id).select("-password");

    if (!user) {
      throw new apiError(404, "User not found");
    }

    res.status(200).json(new apiResponse(user, "User sent successfully"));
  };
}

module.exports = UserService;
