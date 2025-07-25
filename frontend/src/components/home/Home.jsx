import React from "react";
import { useNavigate } from "react-router-dom";
import "../../styles/home/Home.css";

const Home = () => {
  const navigate = useNavigate();

  return (
    <div className="landing-page">
      <div className="hero">
        <div className="navbar">
          <div className="brand">LMSI</div>
          <div className="nav-links">
            <a href="/about" className="nav-link">About Us</a>
            <a href="/contact" className="nav-link">Contact Us</a>
            <a href="/login" className="nav-link">Login</a>
            <a href="/register" className="nav-link">Register</a>
          </div>
        </div>

        <div className="content">
          <h1 className="logo">LMSI</h1>
          <p className="tagline">Transform Your Financial Future Today!</p>
          <div className="cta-buttons">
            <button className="cta-login" onClick={() => navigate("/login")}>
              Login
            </button>
            <button className="cta-register" onClick={() => navigate("/register")}>
              Get Started
            </button>
          </div>
        </div>
      </div>

      <div className="main">
        <div className="section">
          <h2>Our Loan Services</h2>
          <div className="fact">✅ Personal Loans – Minimal docs, fast approval.</div>
          <div className="fact">🏠 Home Loans – Competitive interest rates.</div>
          <div className="fact">🚗 Vehicle Loans – Affordable EMIs for your dream ride.</div>
        </div>
        <div className="section">
          <h2>Why Choose LMSI?</h2>
          <div className="fact">⚡ Fast | 💼 Trusted | 🔒 Secure | 📱 Fully Digital</div>
        </div>
      </div>
    </div>
  );
};

export default Home;
