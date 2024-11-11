const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const Borrow = require('../models/borrow');


const borrowSchema = new mongoose.Schema({
  title: String,
  borrowerName: String,
  email: String,
  phoneNumber: String,
  borrowDate: String,
  dueDate: String,
});


router.post('/borrow', (req, res) => {
  const { title, borrowerName, email, phoneNumber, borrowDate, dueDate } = req.body;

 
  const newBorrow = new Borrow({
    title,
    borrowerName,
    email,
    phoneNumber,
    borrowDate,
    dueDate,
  });

  newBorrow
    .save()
    .then(() => {
      res.json({ message: 'Borrowing details saved successfully!' });
    })
    .catch((error) => {
      console.error(error);
      res.status(500).json({ error: 'Failed to save data' });
    });
});


router.get("/borrowed-books", async (req, res) => {
  try {
    const borrowedBooks = await Borrow.find();
    res.json(borrowedBooks);
  } catch (error) {
    console.error("Error fetching borrowed books:", error);
    res.status(500).json({ error: "Server error" });
  }
});

router.post("/return", async (req, res) => {
  const { bookId, email, returnDate } = req.body;
  try {
    const borrowRecord = await Borrow.findOne({ bookId, email });
    if (!borrowRecord) {
      return res.status(404).json({ message: "Borrow record not found." });
    }

    borrowRecord.returnDate = returnDate;
    borrowRecord.status = "Returned";
    await borrowRecord.save();

    res.json({ message: "Book returned successfully!" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error processing return." });
  }
});

module.exports = router;
