const express = require('express');
const cors = require('cors')

const app = express();

app.use(express.json());
app.use(cors())
app.use(express.urlencoded({limit: '16kb'})) 
app.use(express.static('public'));


//import routes for api
const userRoutes = require("./routes/user.routes");
const route = require("./routes/index.routes")

app.get("/",((req,res)=>{
    res.send("Hello world");
}))

//mount the api routes
app.use("/api/v1",route)

module.exports = app;