const Router = require("express").Router;
const router = Router();
const { getAllUsers, deleteUser } = require("../controllers/admin.controller");

const verifyJWT = require("../middlewares/auth.middleware");

router.get("/users", verifyJWT, getAllUsers);
router.delete("/users/:_id", verifyJWT, deleteUser);

module.exports = router;
