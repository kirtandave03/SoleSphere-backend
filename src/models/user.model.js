const mongoose = require("mongoose");
const jwt = require('jsonwebtoken');

const userSchema = new mongoose.Schema({
    username: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: true
    },
    profilePic: {
        type: String
    },
    phone: {
        type: String,
        requirerd: true,
        unique: true
    },
    address: [
        {
            house: {
                type: String,
                required: true
            },
            area: {
                type: String,
                required: true
            },
            landmark: {
                type: String
            },
            pincode: {
                type: Number,
                required: true
            },
            town: {
                type: String,
                required: true
            },
            state: {
                type: String,
                required: true
            },
            country : {
                type :String,
                required : true
            }
        }
    ],
    member: {
        type: Boolean,
        required: true,
        default: false
    },
    restrict: {
        type: Boolean,
        default: false
    },
    wishlist: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Product"
        }
    ],
    cart: [
        {
            product_id: {
                type: mongoose.Schema.Types.ObjectId,
                ref: "Product"
            },
            quantity: {
                type: Number,
                required: true
            },
            price : {
                type : String,
                required : true
            },
            totalAmount : {
                type: String,
                required : true
            },
        }
    ]
}, {timestamps: true})

userSchema.methods.genarateAccessToken = function(){
    return jwt.sign({
        _id : this._id
         },process.env.ACCESS_TOKEN_SECRET)
}

const User = mongoose.model('User', userSchema);
module.exports = User;