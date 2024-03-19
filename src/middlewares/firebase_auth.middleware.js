const admin = require("firebase-admin");
const credentials = require("../credential.json");
const asyncHandler = require("../utils/asyncHandler");
const User = require("../models/user.model");
const apiError = require("../interfaces/apiError");
admin.initializeApp({
  credential: admin.credential.cert(credentials),
});

const verifyToken = asyncHandler(async (req, _, next) => {
  try {
    const idToken = req.header("auth-token");

    if (!idToken) {
      throw new apiError(401, "Unauthorized request");
    }

    const decodedToken = await admin.auth().verifyIdToken(idToken);
    console.log("Token is valid:", decodedToken);

    const user = await User.findOne({ UID: decodedToken.uid });

    if (!user) {
      throw new apiError(401, "Invalid Access token");
    }

    req.user = user;
    next();
  } catch (error) {
    throw new apiError(401, "Invalid Access Token");
  }
});

module.exports = verifyToken;
