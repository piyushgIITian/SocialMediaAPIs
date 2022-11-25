const express = require('express')
const router = express.Router()
const User = require("../models/User");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

router.post("/register", async (req, res) => {
  try {
      console.log(req.body)
        
      //generate new password
      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash(req.body.password, salt);
  
      //create new user
      const newUser = new User({
        username: req.body.username,
        email: req.body.email,
        password: hashedPassword,
      });
  
      //save user and respond
      const user = await newUser.save();
      res.status(200).json(user);
    } catch (err) {
      res.status(500).json(err)
    }
  });

router.post("/", async (req, res) => {

    console.log(req.body)
    try {
  
      const { email, password } = req.body;
  
    
      if (!(email && password)) {
        res.status(400).send("All input is required");
      }

      const user = await User.findOne({ email });
  
      if (user && (await bcrypt.compare(password, user.password))) {

        const token = jwt.sign(
          { user_id: user._id, email },
          process.env.TOKEN_KEY,
          {
            expiresIn: "2h",
          }
        );
  
        user.token = token;
        res.status(200).json(token);
      }
      res.status(400).send("Invalid Credentials");
    } catch (err) {
      console.log(err);
    }
  
  });
  
  module.exports = router;