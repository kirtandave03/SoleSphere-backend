const mongoose = require("mongoose");
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');

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
            adType: {
                type: String,
                deafult : "Home",
                enum: ["Home", "Office", "Other"]
            }
        }
    ],
    member: {
        type: Boolean,
        required: true,
        default: false
    },
    status: {
        type: String,
        enum: ["active", "inactive"],
        default: "active"
    },
    wishlist: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Product"
        }
    ],
    cart: [
        {
            product: {
                type: mongoose.Schema.Types.ObjectId,
                ref: "Product"
            },
            productImage: {
                type: String
            },
            quantity: {
                type: Number,
            },
            price : {
                type : String,
            },
            totalAmount : {
                type: String,
            },
        }
    ]
}, {timestamps: true})

userSchema.pre('save',async function(next){
    if(!this.isModified('password')) return next()

    this.password = await bcrypt.hash(this.password,10);
    next();
})
userSchema.methods.genarateAccessToken = function(){
    return jwt.sign({
        _id : this._id,
        email: this.email 
         },process.env.ACCESS_TOKEN_SECRET)
}

userSchema.methods.isPasswordCorrect = async function(password){
    return await bcrypt.compare(password,this.password);
}

const User = mongoose.model('User', userSchema);
module.exports = User;