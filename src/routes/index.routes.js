const Router = require('express').Router
const authRouter = require("./auth.routes")
const userRouter = require('./user.routes')

const router = Router()
router.use("/auth",authRouter)
router.use("/user",userRouter)

module.exports = router