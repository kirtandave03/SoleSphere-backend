const Router = require('express').Router;
const upload = require('../middlewares/multer.middleware')

const router = Router()

const {loginUser,signupUser} = require('../controllers/user.controller')


router.route('/signup').post(
    upload.fields([
        {
            name:'profilePic',
            maxCount: 1
        }
    ])
    ,signupUser)

router.route('/login').post(loginUser);

module.exports = router;