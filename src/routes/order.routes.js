const Router = require("express").Router;
const verifyToken = require("../middlewares/firebase_auth.middleware");
const router = Router();
const { purchase, getUserOrders } = require("../controllers/order.controller");

router.get("/", verifyToken, getUserOrders);
router.post("/", verifyToken, purchase);

module.exports = router;
