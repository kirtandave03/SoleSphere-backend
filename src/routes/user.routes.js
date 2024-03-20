const Router = require("express").Router;
const upload = require("../middlewares/multer.middleware");
const verifyToken = require("../middlewares/firebase_auth.middleware");

const router = Router();

const {
  userDetail,
  deleteUser,
  updateUserProfilePic,
  getCurrentUser,
  updateUserPhone,
  updateUserAddress,
  addToWishList,
  getWishList,
} = require("../controllers/user.controller");

router.get("/", verifyToken, getCurrentUser);
router.post(
  "/",
  verifyToken,
  upload.fields([
    {
      name: "profilePic",
      maxCount: 1,
    },
  ]),
  userDetail
);

router.delete("/", verifyToken, deleteUser);

router.put(
  "/update-profile-pic",
  verifyToken,
  upload.single("profilePic"),
  updateUserProfilePic
);

router.put("/update-user-phone-number", verifyToken, updateUserPhone);

router.put("/update-address", verifyToken, updateUserAddress);

router.post("/add-to-wishlist", verifyToken, addToWishList);

router.get("/wishlist", verifyToken, getWishList);

module.exports = router;
