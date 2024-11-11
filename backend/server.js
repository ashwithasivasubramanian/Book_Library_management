const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const schedule = require("node-schedule");
const nodemailer = require("nodemailer");
const borrowRoutes = require("./routes/borrowRoutes");
const userRoutes = require("./routes/userRoutes"); // Import user routes
const returnRoutes = require("./routes/returnRoutes");
const Return = require("./models/Return");

const app = express();
app.use(express.json()); // Middleware for parsing JSON
app.use(cors()); // Middleware to allow cross-origin requests

// MongoDB connection
const DATABASE_URL = process.env.DATABASE_URL || "mongodb://localhost:27017/libraryDB";
mongoose.connect(DATABASE_URL, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
  .then(() => console.log("Connected to MongoDB"))
  .catch((error) => {
    console.error("Error connecting to MongoDB:", error);
    process.exit(1); // Exit the application if DB connection fails
  });

// Email transporter configuration
const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_USER, // Replace with your email
    pass: process.env.EMAIL_PASS, // Replace with your email password
  },
});

// Function to send reminder email
const sendReminderEmail = (borrowerEmail, borrowerName, dueDate) => {
  const mailOptions = {
    from: "your-email@gmail.com",
    to: borrowerEmail,
    subject: "Due Date Reminder",
    text: "Hello ${borrowerName},\n\nYour borrowed book is due to be returned on ${dueDate}. Please make sure to return it on time.\n\nThank you.",
  };

  transporter.sendMail(mailOptions, (error, info) => {
    if (error) {
      console.log("Error sending email:", error);
    } else {
      console.log("Email sent: " + info.response);
    }
  });
};

// Function to send a confirmation email for successful transactions
const sendConfirmationEmail = (email) => {
  const mailOptions = {
    from: "your-email@gmail.com",
    to: email,
    subject: "Transaction Confirmation",
    text: "Thank you for your transaction!",
  };

  transporter.sendMail(mailOptions, (error, info) => {
    if (error) {
      console.log("Error sending email: ", error);
    } else {
      console.log("Email sent: " + info.response);
    }
  });
};

// POST route for handling successful transactions and sending email
app.post("/transaction-success", (req, res) => {
  const { email } = req.body;
  sendConfirmationEmail(email);
  res.status(200).send("Transaction successful and email sent!");
});

// Schedule a job to check for due dates approaching in 3 days
schedule.scheduleJob("0 0 * * *", async () => {
  // This runs every day at midnight
  const today = new Date();
  const reminderDate = new Date(today);
  reminderDate.setDate(today.getDate() + 3); // Set reminder for 3 days from today

  // Find borrow records where dueDate is 3 days away
  const upcomingDueBooks = await Borrow.find({
    dueDate: reminderDate.toISOString().split("T")[0], // Match only the date part
  });

  upcomingDueBooks.forEach((borrowRecord) => {
    sendReminderEmail(
      borrowRecord.email,
      borrowRecord.borrowerName,
      borrowRecord.dueDate
    );
  });
});

app.post('/api/return', async (req, res) => {
  try {
    const { title, email, returnDate } = req.body;
    // Process the return logic (e.g., update book return status in DB)
    // Assuming you have a model for borrowing records

    const result = await Return.updateOne(
      { title, email },
      { returnDate }
    );
    
    if (result.modifiedCount > 0) {
      res.status(200).json({ message: "Return processed successfully" });
    } else {
      res.status(400).json({ message: "Book return failed. Please check the details." });
    }
  } catch (error) {
    console.error("Error processing return:", error);
    res.status(500).json({ message: "Error processing return. Please try again." });
  }
});

app.use("/api", borrowRoutes); 
app.use("/api/user", userRoutes); 
app.use("/api", returnRoutes);
const PORT = process.env.PORT || 5000; 
app.listen(PORT, () => {
  console.log("Server is running on http://localhost:${PORT}");
});