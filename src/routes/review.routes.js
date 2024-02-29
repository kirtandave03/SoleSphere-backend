const { addReview, deleteReview } = require("../controllers/review.controller");
const verifyJWT = require("../middlewares/auth.middleware");

const Router = require("express").Router;
const router = Router();

router.post("/", verifyJWT, addReview);
router.delete("/", deleteReview);
module.exports = router;
