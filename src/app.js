const express = require('express');
const app = express();

//loading config from env file
require('dotenv').config();
const PORT = process.env.PORT || 4000;

//middleware to parse json request body
app.use(express.json());

//import routes for api
const routes = require("./routes/user");

//mount the api routes
app.use("/api/v1", routes);

//start server
app.listen(PORT, () => {
    console.log(`Server started successfully at ${PORT}`);
});

//database connection
const dbConnect = require("./db/db");
dbConnect();

//default route
app.get("/", (req, res) => {
    res.send(`<h1>this is homepage</h1>`);
})