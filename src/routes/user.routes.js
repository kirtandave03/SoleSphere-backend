const Router = require('express').Router;
const upload = require('../middlewares/multer.middleware')

const router = Router()

const {userDetail, deleteUser} = require('../controllers/user.controller');


// router.route('/userDetail').post(
//     upload.fields([
//         {
//             name:'profilePic',
//             maxCount: 1
//         }
//     ])
//     ,userDetail)

router.post('/user-details',upload.fields([
            {
                name:'profilePic',
                maxCount: 1
            }
        ])
        ,userDetail )

router.delete('/delete-user',deleteUser)        
module.exports = router;