const Router = require('express').Router;
const { signupUser, verifyOtp, loginUser } = require('../controllers/auth.controller')

const authRouter = Router()


authRouter.post('/login',loginUser)

authRouter.post('/signup',signupUser)

authRouter.post('/verify-otp',verifyOtp)

module.exports = authRouter;