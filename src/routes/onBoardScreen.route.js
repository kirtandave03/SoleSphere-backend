const Router = require("express").Router;
const upload = require("../middlewares/multer.middleware");

const router = Router();

const {
  screenUpdation,
  getScreen,
} = require("../controllers/screen.controller");

// router.post(
//   "/",
//   upload.fields([
//     {
//       name: "image",
//       maxCount: 1,
//     },
//   ]),
//   screenCreation
// );

router.post(
  "/",
  upload.fields([
    {
      name: "image",
      maxCount: 1,
    },
  ]),
  screenUpdation
);

router.get("/", getScreen);

module.exports = router;
