import React, { useState } from "react";
import { register } from "../../services/authService";
import { useNavigate } from "react-router-dom";
import '../../styles/auth/Login_and_Register.css';

function Register() {
  const [form, setForm] = useState({
    username: "",
    name: "",
    email: "",
    password: "",
    role: "CUSTOMER" // default role
  });

  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const trimmedForm = {
        username: form.username.trim(),
        name: form.name.trim(),
        email: form.email.trim(),
        password: form.password.trim(),
        role: form.role
      };

      await register(trimmedForm);
      navigate("/login");
    } catch (err) {
      setError("Username or Email already exists");
    }
  };

  return (
    <div className="auth-container">
      <h2 className="auth-heading">Register</h2>
      <form className="auth-form" onSubmit={handleSubmit}>
        <div className="input-group">
          <label htmlFor="username">Username</label>
          <input
            className="auth-input"
            id="username"
            name="username"
            value={form.username}
            onChange={handleChange}
            placeholder="Enter unique username"
            required
          />
        </div>

        <div className="input-group">
          <label htmlFor="name">Full Name</label>
          <input
            className="auth-input"
            id="name"
            name="name"
            value={form.name}
            onChange={handleChange}
            placeholder="Enter full name"
            required
          />
        </div>

        <div className="input-group">
          <label htmlFor="email">Email</label>
          <input
            className="auth-input"
            type="email"
            id="email"
            name="email"
            value={form.email}
            onChange={handleChange}
            placeholder="Enter email address"
            required
          />
        </div>

        <div className="input-group">
          <label htmlFor="password">Password</label>
          <input
            className="auth-input"
            type="password"
            id="password"
            name="password"
            value={form.password}
            onChange={handleChange}
            placeholder="Enter password"
            required
          />
        </div>

        <div className="input-group">
          <label htmlFor="role">Role</label>
          <select
            className="auth-input"
            id="role"
            name="role"
            value={form.role}
            onChange={handleChange}
            required
          >
            <option value="CUSTOMER">Customer</option>
            <option value="ADMIN">Admin</option>
          </select>
        </div>

        <button className="auth-button" type="submit">Register</button>
        {error && <div className="error-text">{error}</div>}
      </form>

      <div className="switch-link">
        Already have an account? <a className="login-link" href="/login">Login</a>
      </div>
    </div>
  );
}

export default Register;
