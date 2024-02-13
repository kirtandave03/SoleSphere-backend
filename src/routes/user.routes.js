const Router = require('express').Router;
const upload = require('../middlewares/multer.middleware')

const router = Router()

const {signupUser, loginUser,userDetail} = require('../controllers/user.controller');
const { sign } = require('jsonwebtoken');


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

module.exports = router;