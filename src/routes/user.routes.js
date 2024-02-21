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
  updateHomeAddress,
  updateOfficeAddress,
  updateOtherAddress,
} = require("../controllers/user.controller");

router.get("/", verifyJWT, getCurrentUser);
router.put(
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

router.put("/update-home-address", verifyJWT, updateHomeAddress);

router.put("/update-office-address", verifyJWT, updateOfficeAddress);

router.put("/update-other-address", verifyJWT, updateOtherAddress);

module.exports = router;
