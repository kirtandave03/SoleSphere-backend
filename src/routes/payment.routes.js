const Router = require("express").Router;

const verifyJWT = require("../middlewares/auth.middleware");
const {
  razorpayOrder,
  razorpayVerify,
  order,
} = require("../controllers/payment.controller");
const verifyToken = require("../middlewares/firebase_auth.middleware");
const router = Router();

// Secure Routes
router.post("/razorpay-orders", verifyToken, razorpayOrder);
router.post("/razorpay-verify", razorpayVerify);

router.post("/order", verifyJWT, order);

module.exports = router;
