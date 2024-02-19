const Router = require('express').Router;
const upload = require('../middlewares/multer.middleware')
const router = Router();
const { userDetail, deleteUser } = require('../controllers/user.controller');

/*
get("/")
post("/")
get("/:id")
*/
// router.route('/userDetail').post(
//     upload.fields([
//         {
//             name:'profilePic',
//             maxCount: 1
//         }
//     ])
//     ,userDetail)

router.post('/user-detail', upload.fields([
    {
        name: 'profilePic',
        maxCount: 1
    }
]), userDetail);


    /* Should be seperate file like auth.js
    API end point will be /auth/login, etc..
    prefer route.js and split the API from their
*/


// router.route('/delete-user').post(deleteUser);
router.post('/delete-user', deleteUser);

module.exports = router;