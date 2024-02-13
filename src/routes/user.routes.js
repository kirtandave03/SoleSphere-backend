const Router = require('express').Router;
const upload = require('../middlewares/multer.middleware')

const router = Router()

const {loginUser,userDetail} = require('../controllers/user.controller')


router.route('/userDetail').post(
    upload.fields([
        {
            name:'profilePic',
            maxCount: 1
        }
    ])
    ,userDetail)

router.route('/login').post(loginUser);


module.exports = router;