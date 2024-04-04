const mongoose = require("mongoose");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const mongoose_delete = require("mongoose-delete");

const userSchema = new mongoose.Schema(
  {
    username: {
      type: String,
    },
    email: {
      type: String,
      required: true,
    },
    UID: {
      type: String,
      unique: true,
      required: true,
    },
    profilePic: {
      type: String,
      default: "",
    },
    phone: {
      type: String,
      default: "",
    },
    address: [
      {
        house: {
          type: String,
          required: true,
        },
        area: {
          type: String,
          required: true,
        },
        pincode: {
          type: Number,
          required: true,
        },
        town: {
          type: String,
          required: true,
        },
        state: {
          type: String,
          required: true,
        },
        adType: {
          type: String,
          enum: ["Home", "Office", "Other"],
          default: "Home",
        },
      },
    ],
    member: {
      type: Boolean,
      required: true,
      default: false,
    },
    wishlist: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Product",
      },
    ],
    cart: {
      cartItems: [
        {
          product_id: { type: mongoose.Schema.Types.ObjectId, ref: "Product" },
          productName: { type: String, lowercase: true },
          image_url: { type: String, lowercase: true },
          color: { type: String },
          size: Number,
          quantity: Number,
          actual_price: Number,
          discounted_price: Number,
        },
      ],
    },
  },
  { timestamps: true }
);

userSchema.plugin(mongoose_delete, { overrideMethods: "all" });

// userSchema.pre("save", async function (next) {
//   if (!this.isModified("password")) return next();

//   this.password = await bcrypt.hash(this.password, 10);
//   next();
// });

// userSchema.methods.generateAccessToken = function () {
//   return jwt.sign(
//     {
//       _id: this._id,
//       email: this.email,
//     },
//     process.env.ACCESS_TOKEN_SECRET
//   );
// };

// userSchema.methods.isPasswordCorrect = async function (password) {
//   return await bcrypt.compare(password, this.password);
// };

const User = mongoose.model("User", userSchema);
module.exports = User;
