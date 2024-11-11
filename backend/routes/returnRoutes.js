
const express = require("express");
const Return = require("../models/Return"); 
const router = express.Router();


router.post("/return", async (req, res) => {
  const { title, email, returnDate } = req.body;
  
  try {
    
    const newReturn = new Return({
      title,
      email,
      returnDate,
    });
    
    
    await newReturn.save();

   
    res.status(200).json({ message: "Return processed successfully." });
  } catch (error) {
    console.error("Error saving return record:", error);
    res.status(500).json({ message: "Failed to process return. Please try again." });
  }
});

module.exports = router;
