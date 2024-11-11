import React, { useState } from "react";
import axios from "axios";

const ReturnForm = () => {
  const [title, setTitle] = useState("");
  const [email, setEmail] = useState("");
  const [returnDate, setReturnDate] = useState("");
  const [message, setMessage] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post("http://localhost:5000/api/return", {
        title,
        email,
        returnDate,
      });
      setMessage(response.data.message);
    } catch (error) {
      console.error("Error details:", error.response ? error.response.data : error.message);
      setMessage("Error processing return. Please check your details and try again.");
    }
  };

  return (
    <div style={styles.returnPage}>
      <h2 style={styles.title}>Return Book</h2>
      <form onSubmit={handleSubmit} style={styles.form}>
        <div style={styles.formGroup}>
          <label style={styles.label}>Book Title:</label>
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            style={styles.input}
            required
          />
        </div>
        <div style={styles.formGroup}>
          <label style={styles.label}>Email:</label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            style={styles.input}
            required
          />
        </div>
        <div style={styles.formGroup}>
          <label style={styles.label}>Return Date:</label>
          <input
            type="date"
            value={returnDate}
            onChange={(e) => setReturnDate(e.target.value)}
            style={styles.input}
            required
          />
        </div>
        <button type="submit" style={styles.submitButton}>
          Submit Return
        </button>
      </form>
      {message && <p style={styles.message}>{message}</p>}
    </div>
  );
};

const styles = {
  returnPage: {
    color: "#e0f7fa",
    padding: "2rem",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    minHeight: "100vh",
  },
  title: {
    fontSize: "2rem",
    fontWeight: "bold",
    textAlign: "center",
    textShadow: "2px 2px 10px rgba(255, 255, 255, 0.5)",
    marginBottom: "2rem",
  },
  form: {
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
  input: {
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
    textAlign: "center",
  },
};

export default ReturnForm;
