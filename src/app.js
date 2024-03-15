const express = require("express");
const cors = require("cors");
const cookieParser = require("cookie-parser");

const app = express();

app.use(express.json());
app.use(express.static("public"));
app.use(cookieParser());

// Define a custom origin whitelist
const whitelist = ["http://localhost:5173", "http://example.com"];

const corsOptions = {
  origin: function (origin, callback) {
    // Check if the origin is in the whitelist or if it's undefined (allowing requests from non-browser contexts)
    if (whitelist.indexOf(origin) !== -1 || !origin) {
      callback(null, true);
    } else {
      callback(new Error("Not allowed by CORS"));
    }
  },
  credentials: true, // Allow cookies to be sent from the frontend
};

app.use(cors(corsOptions));

// Import routes for API
const route = require("./routes/index.routes");

app.get("/", (req, res) => {
  res.send("Hello world");
});

// Mount the API routes
app.use("/api/v1", route);

module.exports = app;
