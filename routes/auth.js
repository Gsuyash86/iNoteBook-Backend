const express = require("express");
const User = require("../models/User");
const router = express.Router();
const { body, validationResult } = require("express-validator");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const fetchuser = require("../middleware/fetchuser");

const JWT_SECRET = "MySecurityString";

//ROUTE 1 :Create a User using : POST "/api/auth/createuser". No login required
router.post(
  "/createuser",
  [
    body("name", "Enter the Valid Name").isLength({ min: 3 }),
    body("email", "Enter the Valid Email").isEmail(),
    body("password", "Enter the valid password").isStrongPassword(),
  ],
  async (req, res) => {
    // if there are errors return Bad req and the errors
    const error = validationResult(req);
    if (!error.isEmpty()) {
      return res.status(400).json({ errors: error.array() });
    }
    // check wheater the user with same email exists already

    try {
      let user = await User.findOne({ email: req.body.email });
      if (user) {
        return res
          .status(400)
          .json({ error: "Sorry a user with this email already exists" });
      }

      const salt = await bcrypt.genSalt(10);
      secPass = await bcrypt.hash(req.body.password, salt);
      //create a new user
      user = await User.create({
        name: req.body.name,
        password: secPass,
        email: req.body.email,
      });
      const data = {
        user: {
          id: user.id,
        },
      };
      const authToken = jwt.sign(data, JWT_SECRET);
      res.json({ authToken });
    } catch (err) {
      console.error(err.message);
      res.status(500).send("Some Error occured");
    }
  }
);

//Route 2 : Login in the user
router.post(
  "/login",
  [
    body("email", "Enter a valid email").isEmail(),
    body("password", "Password cannot be blank").exists(),
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { email, password } = req.body;
    try {
      let user = await User.findOne({ email });
      if (!user) {
        return (
          res.status(400),
          json({ error: "Please try to login with correct credentials" })
        );
      }

      const passwordCompare = await bcrypt.compare(password, user.password);
      if (!passwordCompare) {
        return res
          .status(400)
          .json({ error: "Please try to login with correct creadintails" });
      }

      const data = {
        user: {
          id: user.id,
        },
      };
      const authToken = jwt.sign(data, JWT_SECRET);
      res.json({ authToken });
    } catch (err) {
      console.error(err.message);
      res.status(500).send("Internal Server Error occured");
    }
  }
);

// Authenticate a user using : POST "/api/auth/login", No login required

// ROUTE 3 : Get logged in user details using "api/auth/getuser", Login Required
router.post("/getuser", fetchuser, async (req, res) => {
  try {
    userId = "todo";
    const user = await User.findById(userId).select("-password");
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Internal Server Error occured");
  }
});
module.exports = router;
