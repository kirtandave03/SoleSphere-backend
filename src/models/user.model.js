const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
    username: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true
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
        requirerd: true
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
            }
        }
    ],
    member: {
        type: Boolean,
        required: true,
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
            product: {
                type: mongoose.Schema.Types.ObjectId,
                ref: "Product"
            },
            quantity: {
                type: Number,
                required: true
            }
        }
    ]
})

/*
CUSTOMER:

{
  "_id": "<ObjectId>",
  "name": "John Doe",
  "email": "john@example.com",
  "password": "<hashed_password>",
  "address": "123 Street, City, Country",
  "phone": "+1234567890",
  "created_at": "<timestamp>",
  "wishlist": ["<product_id_1>", "<product_id_2>", "..."],
  "shopping_cart": [
    {
      "product_id": "<product_id_1>",
      "quantity": 2
    },
    {
      "product_id": "<product_id_2>",
      "quantity": 1
    },
    // Additional products...
  ]
}
+ profile photo
+ numerous address 
+ membership
*/