const router = require("express").Router();
const jwt = require("jsonwebtoken");
const loginValidation = require("../validation").loginValidation;
const registerValidation = require("../validation").registerValidation;
const User = require("../models").user;

// midleware
router.use((req, res, next) => {
  console.log("正在接收一個跟auth有關的請求");
  next();
});

// route
router.post("/register", async (req, res) => {
  // check req.body meet specification
  let { error } = registerValidation(req.body);
  if (error) return res.status(400).send(error.details[0].message);

  // check email exist
  const emailExist = await User.findOne({ email: req.body.email }).exec();
  if (emailExist) return res.status(400).send("email already use");

  // create new user
  let { username, email, password, role } = req.body;
  let newUser = new User({ username, email, password, role });
  try {
    let savedUser = await newUser.save();
    return res.send({
      mesg: "create user successfully",
      user: savedUser,
    });
  } catch (e) {
    return res.sendStatus(500).send("create user failed");
  }
});
router.post("/login", async (req, res) => {
  // check req.body meet specification
  let { error } = loginValidation(req.body);
  if (error) return res.status(400).send(error.details[0].message);

  // check password correct
  const foundUser = await User.findOne({ email: req.body.email });
  if (!foundUser) {
    return res
      .status(401)
      .send("Can't find user, please check your email correct?");
  }

  foundUser.comparePassword(req.body.password, (err, result) => {
    if (err) return res.status(500).send(err);
    if (result) {
      const tokenObject = { _id: foundUser._id, email: foundUser.email };
      const token = jwt.sign(tokenObject, process.env.PASSPORT_SECRET);
      return res.send({
        message: "成功登入",
        token: "JWT " + token,
        user: foundUser,
      });
    } else {
      return res.status(400).send("Password incorrect...");
    }
  });
});

module.exports = router;
