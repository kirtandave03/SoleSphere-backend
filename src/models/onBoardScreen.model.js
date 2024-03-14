const mongoose = require("mongoose");

const splashScreenSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      unique: true,
    },
    image: {
      type: String,
    },

    title: {
      type: String,
    },

    subtitle: {
      type: String,
    },
  },
  { timestamps: true }
);

const splashScreen = mongoose.model("splashScreen", splashScreenSchema);
module.exports = splashScreen;
