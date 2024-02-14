const Router = require('express').Router;
const upload = require('../middlewares/multer.middleware')

const router = Router()

const {signupUser, loginUser,userDetail, verifyOtp} = require('../controllers/user.controller');



router.route('/userDetail').post(
    upload.fields([
        {
            name:'profilePic',
            maxCount: 1
        }
    ])
    ,userDetail)

router.route('/login').post(loginUser);

router.route('/signup').post(signupUser);

router.route('/verifyotp').post(verifyOtp);

module.exports = router;