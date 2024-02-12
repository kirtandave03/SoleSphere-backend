const express = require("express");
const router = express.Router();

const {localFileUpload, imageUpload} =require("../controllers/fileUpload");

//api route
router.post("/localFileUload", localFileUpload);
router.post("/imageUpload", imageUpload);

module.exports = router;