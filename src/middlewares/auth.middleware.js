const jwt = require('jsonwebtoken');
const User = require('../models/user.model');
const apiError = require('../utils/apiError');
const asyncHandler = require('../utils/asyncHandler');

const verifyJWT = asyncHandler(async (req,_,next)=>{
    try {
        const token = req.header('auth-token');

        if(!token){
            throw new apiError(400,"Unauthorized request");
        }

        const decodedToken = jwt.verify(token,process.env.ACCESS_TOKEN_SECRET)

        const user = await User.findById(decodedToken._id).select("-password")

        if(!user){
            throw new apiError(401, "Invalid Access token")
        }

        req.user = user;
        next()

    } catch (error) {
        throw new apiError(401,"Invalid Access Token")
    }
})

module.exports = verifyJWT