const mongoose = require("mongoose");

const returnSchema = new mongoose.Schema({
  title: { type: String, required: true },
  email: { type: String, required: true },
  returnDate: { type: Date, required: true },
  returnedAt: { type: Date, default: Date.now },
});


const Return = mongoose.model("Return", returnSchema, "returns");

module.exports = Return;
