const express = require("express");
const app = express();
const mongoose = require("mongoose");
const morgan = require("morgan");
const cors = require("cors");
const dotenv = require("dotenv");
dotenv.config();
const passport = require("passport");
require("./config/passport")(passport);
const authRoute = require("./routes").auth;
const courseRoute = require("./routes").course;

// connect MongoDB
mongoose
  .connect("mongodb://127.0.0.1:27017/mernDB")
  .then(() => {
    console.log("Connecting to mongodb....");
  })
  .catch((e) => {
    console.log(e);
  });

// middlewares
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(morgan("dev"));
app.use(cors());

// routes
app.use("/api/user", authRoute);
// 只有登入系統才能進入route
app.use(
  "/api/course",
  passport.authenticate("jwt", { session: false }),
  courseRoute
);

// listen
app.listen(8080, () => {
  console.log("backend running on port 8080....");
});
