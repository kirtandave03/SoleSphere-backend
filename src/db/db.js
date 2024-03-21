const mongoose = require("mongoose");

require("dotenv").config();

const connectWithDB = async () => {
  await mongoose
    .connect(process.env.MONGODB_URL)
    .then(() => console.log("DB connected successfully"))
    .catch((error) => {
      console.log("DB facing issues");
      console.log(error);
      process.exit(1);
    });
};

module.exports = connectWithDB;
