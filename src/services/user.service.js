const User = require("../models/user.model");
const apiError = require("../interfaces/apiError");
const mongoose = require("mongoose");
const apiResponse = require("../interfaces/apiResponse");
const {
  uploadOnCloudinary,
  deleteOnCloudinary,
} = require("../services/cloudinary");
const Product = require("../models/product.model");

class UserService {
  constructor() {}

  userDetails = async (req, res) => {
    const { phone, address, profilePic } = req.body;

    // console.log("Request Body :",req.body);

    const existingUser = await User.findOne({ UID: req.user.UID });

    if (!existingUser) {
      throw new apiError(404, "User not found");
    }

    // var profilePicLocalPath;

    // if (
    //   req.files &&
    //   Array.isArray(req.files.profilePic) &&
    //   req.files.profilePic.length > 0
    // ) {
    //   profilePicLocalPath = req.files.profilePic[0].path;
    // }

    // console.log("Request Files : ", req.files);

    // const profilePic = profilePicLocalPath
    // ? await uploadOnCloudinary(profilePicLocalPath)
    //   : null;

    const user = await User.findByIdAndUpdate(existingUser._id, {
      $set: {
        phone: phone || "",
        address: address || "",
        profilePic:
          profilePic ||
          "https://res.cloudinary.com/dz9ga1vmp/image/upload/v1709285608/y2qgtgbukd0qosbxiub4.jpg",
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
    const user = await User.findOne({ UID: req.user.UID });
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

    const userDocument = await User.findOne({ UID: req.user.UID });
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
    const user = await User.findOne({ UID: req.user.UID }).select("-password");

    if (!user) {
      throw new apiError(404, "User not found");
    }

    res.status(200).json(new apiResponse(user, "User sent successfully"));
  };

  updateUserPhone = async (req, res) => {
    const { updatedPhone } = req.body;

    const existingUser = await User.findOne({ UID: req.user.UID });

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
      .json(
        new apiResponse(updatedUser, "User phone number updated Successfully")
      );
  };

  updateUserAddress = async (req, res) => {
    const { newAddress, index } = req.body;

    const existingUser = await User.findOne({ UID: req.user.UID });

    if (!existingUser) {
      throw new apiError(404, "User not found");
    }

    if (!index) {
      throw new apiError(404, "index not provided");
    }

    if (index >= 3) {
      throw new apiError(400, "Can not add more than 3 address");
    }

    // const toUpdateAddress = existingUser.address[index];

    existingUser.address[index] = newAddress;

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

  addToWishList = async (req, res) => {
    const { product_id } = req.body;

    if (!product_id) {
      throw new apiError(400, "Product id is required");
    }

    const product = await Product.findById(product_id);

    if (!product) {
      throw new apiError(404, "Product Not Found");
    }

    const user = await User.findOne({ UID: req.user.UID });

    if (user.wishlist.includes(product_id)) {
      return res
        .status(200)
        .json(
          new apiResponse(product_id, "Product already exists in wishlist")
        );
    }

    user.wishlist.push(product_id);

    await user.save();

    return res
      .status(200)
      .json(
        new apiResponse(product_id, "Product added successfully into wishlist")
      );
  };

  getWishList = async (req, res) => {
    const wishlist = await User.findOne({ UID: req.user.UID })
      .select("wishlist")
      .populate({
        path: "wishlist",
        populate: {
          path: "category brand review",
          select: "category brand brandIcon review rating",
        },
      });

    const responseData = wishlist.wishlist.map((item) => {
      return {
        productName: item.productName,
        actual_price: item.variants[0].sizes[0].actual_price,
        discounted_price: item.variants[0].sizes[0].discounted_price,
        colors: item.variants.length,
        category: item.category,
        brand: item.brand,
        shortDescription: item.shortDescription,
        totalReview: item.review.length,
        image: item.variants[0].image_urls[0],
        totalRating: item.review.reduce((acc, curr) => acc + curr.rating, 0),
      };
    });

    return res
      .status(200)
      .json(new apiResponse(responseData, "wishlist fetched successfully"));
  };

  removeItemFromWishList = async (req, res) => {
    let { product_id } = req.body;

    if (!product_id) {
      throw new apiError(400, "Product ID is required");
    }

    product_id = new mongoose.Types.ObjectId(product_id);
    const user = await User.findOne({ UID: req.user.UID }).select("wishlist");

    const wishlist = user.wishlist;

    console.log(wishlist);
    const indexOfProduct = wishlist.findIndex(
      (item) => item._id === product_id
    );

    console.log(indexOfProduct);
    if (indexOfProduct === -1) {
      throw new apiError(404, "Product Not found on wishlist");
    }

    wishlist.splice(indexOfProduct, 1);

    user.wishlist = wishlist;
    const updatedUser = await user.save();

    if (!updatedUser) {
      throw new apiError(500, "Internal Server Error");
    }

    return res
      .status(200)
      .json(
        new apiResponse(
          updatedUser,
          "Product removed from wishlist successfully"
        )
      );
  };
}

module.exports = UserService;
