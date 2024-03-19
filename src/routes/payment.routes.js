const Router = require("express").Router;
const Razorpay = require("razorpay");
const crypto = require("crypto");
const verifyJWT = require("../middlewares/auth.middleware");
const router = Router();

router.post("/orders", verifyJWT, order);
