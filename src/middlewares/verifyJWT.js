const jwt = require('jsonwebtoken');
const User = require('../models/user.model');
const apiError = require('../utils/apiError')

try {
    const {email, password} = req.body;

    if(!email && !password){
        throw new apiError(400,"Email and password are required");
    }

    user = await User.findOne(email);
} catch (error) {
    
}