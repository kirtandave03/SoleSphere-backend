require("dotenv").config({});
const connectWithDB = require("./db/db");
const app = require("./app");

//database connection
connectWithDB()
  .then(() => {
    app.listen(process.env.PORT, () => {
      console.log(`Server is running at port ${process.env.PORT}`);
    });
  })
  .catch((err) => {
    console.log("MongoDB connection failed !!!", err);
  });
