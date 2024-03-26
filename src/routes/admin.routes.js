const Router = require("express").Router;
const router = Router();
const {
  getAllUsers,
  deleteUser,
  restoreUser,
} = require("../controllers/admin.controller");

const verifyJWT = require("../middlewares/auth.middleware");

router.get("/users", verifyJWT, getAllUsers);
router.delete("/users/:_id", verifyJWT, deleteUser);
router.put("/users/:_id", verifyJWT, restoreUser);

module.exports = router;
