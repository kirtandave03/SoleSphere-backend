const { addReview, deleteReview } = require("../controllers/review.controller");
const verifyToken = require("../middlewares/firebase_auth.middleware");

const Router = require("express").Router;
const router = Router();

// Secure Routes

router.post("/", verifyToken, addReview);
router.delete("/", verifyToken, deleteReview);

module.exports = router;
