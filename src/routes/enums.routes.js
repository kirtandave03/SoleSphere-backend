const Router = require("express").Router;
const router = Router();
const { getAllEnums } = require("../controllers/enums.controller");

router.get("/", getAllEnums);

module.exports = router;
