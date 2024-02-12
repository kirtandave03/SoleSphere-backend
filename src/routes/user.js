const express = require("express");
const router = express.Router();


const {login, signup} = require("../controllers/auth");

router.post("/signup", signup);
router.route('/login',loginUser);

module.exports = router;