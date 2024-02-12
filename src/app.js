const express = require('express');
const cors = require('cors')

const app = express();

app.use(express.json());
app.use(cors())
app.use(express.urlencoded({limit: '16kb'})) 
app.use(express.static('public'));


//import routes for api
const userRoutes = require("./routes/user");

//mount the api routes
app.use("/api/v1/user", userRoutes);

module.exports = app;