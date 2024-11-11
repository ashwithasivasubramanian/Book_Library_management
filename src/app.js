import React, { useState, useEffect } from "react";
import Header from "./header";
import BorrowPage from "./BorrowPage";
import Signup from "./Signup";
import Login from "./Login";
import Books from "./books";
import ScrollToTop from "./scrolltotop";
import AdminBorrowList from "./AdminBorrowList";
import { Routes, Route, Navigate } from "react-router-dom";
import "./sass/style.css";
import PaymentForm from "./PaymentForm";
import ReturnForm from "./ReturnForm";

const App = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);

  
  const handleLogin = (isAdminUser = false) => {
    setIsLoggedIn(true);
    setIsAdmin(isAdminUser);
    localStorage.setItem("isLoggedIn", "true");
    localStorage.setItem("isAdmin", isAdminUser ? "true" : "false");
  };

  
  useEffect(() => {
    const loggedInStatus = localStorage.getItem("isLoggedIn") === "true";
    const adminStatus = localStorage.getItem("isAdmin") === "true";
    setIsLoggedIn(loggedInStatus);
    setIsAdmin(adminStatus);
  }, []);


  const handleLogout = () => {
    setIsLoggedIn(false);
    setIsAdmin(false);
    localStorage.removeItem("isLoggedIn");
    localStorage.removeItem("isAdmin");
  };

  return (
    <>
      <Header isLoggedIn={isLoggedIn} onLogout={handleLogout} isAdmin={isAdmin} />
      <ScrollToTop />
      <Routes>
        <Route path="/signup" element={<Signup />} />
        <Route path="/login" element={<Login onLogin={handleLogin} />} />
        <Route path="/payment" element={<PaymentForm />} /> 
        <Route path="/return" element={<ReturnForm />} />
       
        <Route
          path="/borrow"
          element={isLoggedIn ? <BorrowPage /> : <Navigate to="/login" />}
        />
        <Route
          path="/books"
          element={isLoggedIn ? <Books /> : <Navigate to="/login" />}
        />

       
        <Route
          path="/admin/borrowed-books"
          element={isLoggedIn && isAdmin ? <AdminBorrowList /> : <Navigate to="/login" />}
        />

        
        <Route
          path="/"
          element={isLoggedIn ? <Navigate to="/books" /> : <Navigate to="/login" />}
        />
      </Routes>
    </>
  );
};

export default App;
