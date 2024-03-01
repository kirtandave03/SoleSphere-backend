const User = require("../models/user.model");
const apiError = require("../interfaces/apiError");
const apiResponse = require("../interfaces/apiResponse");
const {
  uploadOnCloudinary,
  deleteOnCloudinary,
} = require("../services/cloudinary");

class UserService {
  constructor() {}

  userDetails = async (req, res) => {
    const { phone, address } = req.body;

    // console.log("Request Body :",req.body);

    const existingUser = await User.findById(req.user._id);

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
      throw new apiError(400, "Profile Picture file is missing");
    }

    const ProfilePic = await uploadOnCloudinary(ProfilePicLocalPath);

    const isDeleted = await deleteOnCloudinary(oldProfileLink);

    if (!isDeleted) {
      throw new apiError(500, "error while deleting old profile");
    }

    if (!ProfilePic.url) {
      throw new apiError(500, "error while uploading on cloud");
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

  updateUserPhone = async (req, res) => {
    const { updatedPhone } = req.body;

    const existingUser = await User.findById(req.user._id);

    if (!existingUser) {
      throw new apiError(404, "User not found");
    }

    const user = await User.findByIdAndUpdate(existingUser._id, {
      $set: {
        phone: updatedPhone,
      },
    });

    const updatedUser = await User.findById(user._id).select("-password");

    if (!updatedUser) {
      throw new apiError(
        500,
        "Something went wrong while updating the phone number"
      );
    }

    res
      .status(201)
      .json(new apiResponse(updatedUser, "User phone number Successfully"));
  };

  updateUserAddress = async (req, res) => {
    const { newAddress, index } = req.body;

    const existingUser = await User.findById(req.user._id);

    if (!existingUser) {
      throw new apiError(404, "User not found");
    }

    if (!index) {
      throw new apiError(404, "index not provided");
    }

    // const toUpdateAddress = existingUser.address[index];

    const toUpdateAddress = newAddress;

    existingUser.address.index = toUpdateAddress;
    console.log(existingUser.address.index);

    const updatedUser = await existingUser.save();

    res
      .status(200)
      .json(
        new apiResponse(
          200,
          updatedUser,
          "Provided Address updated successfully"
        )
      );
  };
}

module.exports = UserService;
