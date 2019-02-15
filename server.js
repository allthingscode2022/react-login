// for creating our server
const express = require("express");
// storing express method
const app = express();
// storing the port for the server
const PORT = process.env.PORT || 5000;
// for connecting our mongodb
const mongoose = require("mongoose");
// for initializing passport as middleware
const passport = require("passport");
const path = require("path");

// connecting to our mongodb
mongoose.connect("mongodb://localhost:27017/login", { useNewUrlParser: true });

// middleware
app.use(express.static(path.join(__dirname, "/build")));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(passport.initialize());

// importing our User Controller routes
const UserController = require("./controllers/UserController");
app.use("/user", UserController);

app.get("/*", (req, res) => {
  res.sendFile(path.join(__dirname, "/build/index.html"));
});

// initializing our server
app.listen(PORT);
