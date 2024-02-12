const bcrypt = require("bcrypt");
const User = require("../models/user.model");
const jwt = require("jsonwebtoken");

require("dotenv").config();

//signup route handler
exports.signup = async (req, res) => {
    try{
        const {username, email, password, phone, address} = req.body;

        // Email validation
        if (!/^\S+@\S+\.\S+$/.test(email)) {
            return res.status(400).json({
                success: false,
                message: "Invalid email format"
            });
        }

        //check if user exists
        const existingUser = await User.findOne({email});

        if(existingUser){
            return res.status(400).json({
                success: false,
                message: "User already exists"
            });
        }

        //securing password
        let hashedPassword;
        try{
            hasedPassword = await bcrypt.hash(password, 10);
        }
        catch(error){
            res.status(500).json({
                success: false,
                message: "Error in hashing password"
            });
        }

        //create user
        const user = await User.create({
            username, 
            email, 
            password: hashedPassword, 
            phone, 
            address
        });

        const token = jwt.sign(
            { userId: user._id, email: user.email },
            process.env.JWT_SECRET,
        );

        return res.status(201).json({
            success: true,
            message: "User created successfully",
            token
        });
    }
    catch(error){
        console.error('Error signing up user:', error);
        res.status(500).json({ 
            success: false,
            message: 'Internal server error, user cannot be registered please try again later' 
        });
    }
}