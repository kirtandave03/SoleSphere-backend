const jwt = require("jsonwebtoken");
// const User = require("../models/user.model");
const apiError = require("../interfaces/apiError");
const asyncHandler = require("../utils/asyncHandler");
const Admin = require("../models/admin.model");

const verifyJWT = asyncHandler(async (req, _, next) => {
  try {
    const token = req.header("auth-token");

    if (!token) {
      // check the status code use 401
      throw new apiError(400, "Unauthorized request");
    }

    const decodedToken = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);

    // call the function from service
    const user = await Admin.findById(decodedToken._id).select("-password");

    if (!user) {
      throw new apiError(401, "Invalid Access token");
    }
    // store the essential data of the user, like id, name , etc..
    req.user = user;
    next();
  } catch (error) {
    throw new apiError(401, "Invalid Access Token");
  }
});

module.exports = verifyJWT;
