const Router = require("express").Router;
const upload = require("../middlewares/multer.middleware");
const verifyJWT = require("../middlewares/auth.middleware");

const router = Router();

const {
  userDetail,
  deleteUser,
  updateUserProfilePic,
  getCurrentUser,
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

module.exports = router;
