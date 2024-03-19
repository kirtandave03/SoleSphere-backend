const Router = require("express").Router;

const verifyJWT = require("../middlewares/auth.middleware");
const { order, verify } = require("../controllers/payment.controller");
const router = Router();

router.post("/orders", verifyJWT, order);
router.post("/verify", verifyJWT, verify);

module.exports = router;
