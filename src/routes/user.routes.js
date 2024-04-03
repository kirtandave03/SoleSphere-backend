const Router = require("express").Router;
const upload = require("../middlewares/multer.middleware");
const verifyToken = require("../middlewares/firebase_auth.middleware");

const router = Router();

const {
  userDetail,
  deleteUser,
  userProfilePic,
  getCurrentUser,
  updateUserPhone,
  updateUserAddress,
  addToWishList,
  getWishList,
  removeItemFromWishList,
  deleteUserAddress,
} = require("../controllers/user.controller");

// Secure Routes

router.get("/", verifyToken, getCurrentUser);
router.post(
  "/",
  verifyToken,
  // upload.fields([
  //   {
  //     name: "profilePic",
  //     maxCount: 1,
  //   },
  // ]),
  userDetail
);
router.delete("/", verifyToken, deleteUser);
router.put(
  "/profile",
  verifyToken,
  upload.single("profilePic"),
  userProfilePic
);
router.put("/update-user-phone-number", verifyToken, updateUserPhone);
router.put("/update-address", verifyToken, updateUserAddress);
router.delete("/address", verifyToken, deleteUserAddress);
router.post("/add-to-wishlist", verifyToken, addToWishList);
router.put("/wishlist", verifyToken, removeItemFromWishList);
router.get("/wishlist", verifyToken, getWishList);

module.exports = router;
