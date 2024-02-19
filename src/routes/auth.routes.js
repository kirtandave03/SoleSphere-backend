const Router = require('express').Router;
const router = Router();
const {signupUser, verifyOtp, loginUser} = require('../controllers/auth.controller');

// router.route('/login').post(loginUser);
router.post('/login', loginUser);

// router.route('/signup').post(signupUser);
router.post('/signup', signupUser);

// router.route('/verifyotp').post(verifyOtp);
router.post('/verify-otp', verifyOtp);