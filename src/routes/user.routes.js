const Router = require("express").Router;
const upload = require("../middlewares/multer.middleware");
const verifyJWT = require("../middlewares/auth.middleware");

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

router.get("/", verifyJWT, getCurrentUser);
router.post(
  "/",
  verifyJWT,
  upload.fields([
    {
      name: "profilePic",
      maxCount: 1,
    },
  ]),
  userDetail
);

router.delete("/", verifyJWT, deleteUser);

router.put(
  "/update-profile-pic",
  verifyJWT,
  upload.single("profilePic"),
  updateUserProfilePic
);

router.put("/update-user-phone-number", verifyJWT, updateUserPhone);

router.put("/update-address", verifyJWT, updateUserAddress);

router.post("/add-to-wishlist", verifyJWT, addToWishList);
router.get("/wishlist", verifyJWT, getWishList);

module.exports = router;
