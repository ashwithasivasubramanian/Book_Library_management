
const mongoose = require('mongoose');

const borrowSchema = new mongoose.Schema({
  
  title: { type: String, required: true },
  borrowerName: { type: String, required: true },
  email: { type: String, required: true },
  phoneNumber: { type: String, required: true },
  borrowDate: { type: Date, required: true },
  dueDate: { type: Date, required: true },
});


const Borrow = mongoose.model('borrow', borrowSchema,'borrows');

module.exports = Borrow;

