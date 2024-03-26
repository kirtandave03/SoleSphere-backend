const Router = require("express").Router;
const verifyToken = require("../middlewares/firebase_auth.middleware");
const router = Router();
const purchase = require("../controllers/order.controller");

router.post("/", verifyToken, purchase);

module.exports = router;
