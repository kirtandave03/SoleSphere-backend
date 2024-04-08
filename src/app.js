const express = require("express");
const cors = require("cors");
const cookieParser = require("cookie-parser");
const app = express();

app.use(express.json());
// app.use(express.urlencoded({ limit: "16kb" }));
app.use(express.static("public"));
app.use(cookieParser());

const whitelist = ["http://localhost:5173"];

// const corsOptions = {
//   origin: function (origin, callback) {
//     if (whitelist.indexOf(origin) !== -1 || !origin) {
//       callback(null, true);
//     } else {
//       callback(new Error("Not allowed by CORS"));
//     }
//   },
//   credentials: true,
// };

const corsOptions = {
  origin: "*",
  credentials: true, // Allow credentials (cookies, authorization headers, etc.)
  // Add additional headers if needed
  // allowedHeaders: ["Content-Type", "Authorization"],
  // methods: ["GET", "POST", "PUT", "DELETE"],
};
app.use(cors(corsOptions));

const route = require("./routes/index.routes");

app.get("/", (req, res) => {
  res.send("Hello world");
});

app.use("/api/v1", route);

module.exports = app;
