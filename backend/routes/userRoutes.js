const express = require("express");
const bcrypt = require("bcryptjs");     
const jwt = require("jsonwebtoken");
const User = require("../models/User");  

const router = express.Router();

router.post("/signup", async (req, res) => {
  const { username, email, password } = req.body;

  try {
   
    const userExists = await User.findOne({ email });
    if (userExists) {
      return res.status(400).json({ message: "User already exists" });
    }

   
    const hashedPassword = await bcrypt.hash(password, 10);

 
    const newUser = new User({ username, email, password: hashedPassword });
    await newUser.save();

    res.status(201).json({ message: "User created successfully" });
  } catch (err) {
    console.error("Error in signup:", err);
    res.status(500).json({ message: "Server error" });
  }
});


router.post("/login", async (req, res) => {
    const { username, password } = req.body;
  
    try {
   
      const user = await User.findOne({ username });
  
      if (!user) {
        return res.status(400).json({ message: "User not found. Please sign up first." });
      }
  
      const isMatch = await bcrypt.compare(password, user.password);
      if (!isMatch) {
        return res.status(400).json({ message: "Invalid password" });
      }
  

      const token = jwt.sign({ userId: user._id }, "your-secret-key", { expiresIn: "1h" });
  
      res.status(200).json({ message: "Login successful", token });
    } catch (err) {
      res.status(500).json({ message: "Server error" });
    }
  });
  

module.exports = router;