import React, { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";

const BorrowPage = () => {
  const location = useLocation();
  const { title, authors } = location.state || {}; 
  
  const [borrowerName, setBorrowerName] = useState("");
  const [email, setEmail] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [borrowDate, setBorrowDate] = useState("");
  const [dueDate, setDueDate] = useState("");
  const [message, setMessage] = useState("");
  const [reminderMessage, setReminderMessage] = useState("");

  const handleBorrowDateChange = (e) => {
    const borrowDateValue = e.target.value;
    setBorrowDate(borrowDateValue);

    const borrowDateObj = new Date(borrowDateValue);
    borrowDateObj.setDate(borrowDateObj.getDate() + 14);
    const calculatedDueDate = borrowDateObj.toISOString().split("T")[0];
    setDueDate(calculatedDueDate);
  };

  useEffect(() => {
    const today = new Date();
    const dueDateObj = new Date(dueDate);
    const daysLeft = Math.floor((dueDateObj - today) / (1000 * 60 * 60 * 24));

    if (daysLeft <= 3 && daysLeft > 0) {
      setReminderMessage(`Reminder: Your book is due in ${daysLeft} days!`);
    } else if (daysLeft <= 0) {
      setReminderMessage("Your book is overdue!");
    } else {
      setReminderMessage("");
    }
  }, [dueDate]);

  const handleSubmit = (e) => {
    e.preventDefault();

    fetch("http://localhost:5000/api/borrow", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: "madhumitha2305",
      },
      body: JSON.stringify({
        title,
        borrowerName,
        email,
        phoneNumber,
        borrowDate,
        dueDate,
     
       
      }),
    })
      .then((response) => response.json())
      .then((data) => {
        if (data.message) {
          setMessage("Borrowing details saved successfully!");
        }
      })
      .catch((error) => {
        setMessage("Failed to save data. Please try again.");
        console.error("Error:", error);
      });
  };

  return (
    <div style={styles.borrowPage}>
      <h1 style={styles.borrowHeader}>Borrow Book</h1>
      <div>
        <h2>Borrow a Book</h2>
  
        <p>{reminderMessage}</p>
      </div>
      <form onSubmit={handleSubmit} style={styles.borrowForm}>
        <h3>Book Title: {title || "No title provided"}</h3>
      

        <div style={styles.formGroup}>
          <label style={styles.label}>Name:</label>
          <input
            type="text"
            value={borrowerName}
            onChange={(e) => setBorrowerName(e.target.value)}
            required
            style={styles.formInput}
          />
        </div>

        <div style={styles.formGroup}>
          <label style={styles.label}>Email:</label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            style={styles.formInput}
          />
        </div>

        <div style={styles.formGroup}>
          <label style={styles.label}>Phone Number:</label>
          <input
            type="text"
            value={phoneNumber}
            onChange={(e) => setPhoneNumber(e.target.value)}
            style={styles.formInput}
          />
        </div>

        <div style={styles.formGroup}>
          <label style={styles.label}>Borrow Date:</label>
          <input
            type="date"
            value={borrowDate}
            onChange={handleBorrowDateChange}
            style={styles.formInput}
          />
        </div>

        <div style={styles.formGroup}>
          <label style={styles.label}>Due Date:</label>
          <input
            type="date"
            value={dueDate}
            readOnly
            style={styles.formInput}
          />
        </div>

        <button type="submit" style={styles.submitButton}>
          Submit
        </button>
      </form>

      {message && <p style={styles.message}>{message}</p>}
    </div>
  );
};

const styles = {
  borrowPage: {
    color: "#e0f7fa",
    padding: "2rem",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    minHeight: "100vh",
  },
  borrowHeader: {
    fontSize: "2rem",
    fontWeight: "bold",
    textAlign: "center",
    textShadow: "2px 2px 10px rgba(255, 255, 255, 0.5)",
    marginBottom: "2rem",
  },
  borrowForm: {
    backgroundColor: "rgba(0, 0, 0, 0.7)",
    padding: "2rem",
    borderRadius: "8px",
    boxShadow: "0px 4px 10px rgba(0, 0, 0, 0.3)",
  },
  formGroup: {
    marginBottom: "1rem",
  },
  label: {
    display: "block",
    marginBottom: "0.5rem",
    color: "#ffffff",
    fontWeight: "bold",
  },
  formInput: {
    padding: "0.8rem",
    width: "250px",
    fontSize: "1rem",
    borderRadius: "4px",
    border: "none",
    outline: "none",
  },
  submitButton: {
    backgroundColor: "#00796b",
    color: "#ffffff",
    padding: "1rem 2rem",
    fontSize: "1.2rem",
    border: "none",
    cursor: "pointer",
    borderRadius: "4px",
    transition: "background-color 0.3s",
  },
  message: {
    fontSize: "1.2rem",
    color: "#388e3c",
    marginTop: "1rem",
  },
};

export default BorrowPage;
