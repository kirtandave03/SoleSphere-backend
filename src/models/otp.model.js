const mongoose = require("mongoose");

const otpSchema = new mongoose.Schema({
  email: {
    type: String,
    unique: true,
    required: true,
  },

  otp: {
    type: Number,
    required: true,
  },

  isVerified: {
    type: Boolean,
    default: false,
  },

  timestamp: {
    type: Date,
    default: Date.now,
    expires: 90,
    set: (timestamp) => new Date(timestamp),
    get: (timestamp) => timestamp.getTime(),
  },
});

const Otp = mongoose.model("Otp", otpSchema);
module.exports = Otp;
