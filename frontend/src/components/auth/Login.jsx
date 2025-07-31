import React, { useState } from "react";
import { login } from "../../services/authService";
import { useNavigate } from "react-router-dom";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "../../styles/auth/Login.css";

function Login() {
  const [form, setForm] = useState({ username: "", password: "" });
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const res = await login({
        username: form.username.trim(),
        password: form.password,
      });

      localStorage.setItem("token", res.token);
      localStorage.setItem("role", res.role);

      toast.success("Login successful!", {
        autoClose: 1200,
        pauseOnHover: false,
        pauseOnFocusLoss: false,
      });

      setTimeout(() => {
        if (res.role === "ADMIN") {
          navigate("/admin/dashboard");
        } else {
          navigate("/customer/dashboard");
        }
      }, 1300);
    } catch (err) {
      toast.error("Invalid username or password", {
        autoClose: 2000,
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <div className="login-page">
        <div className="login-wrapper">
          <form className="login-form" onSubmit={handleSubmit}>
            <h2 className="login-title">Login</h2>

            <div className="form-group">
              <label htmlFor="username">Username</label>
              <input
                type="text"
                id="username"
                name="username"
                value={form.username}
                onChange={handleChange}
                placeholder="Enter your username"
                minLength={4}
                maxLength={30}
                required
              />
            </div>

            <div className="form-group">
              <label htmlFor="password">Password</label>
              <div className="password-field">
                <input
                  type={showPassword ? "text" : "password"}
                  id="password"
                  name="password"
                  value={form.password}
                  onChange={handleChange}
                  placeholder="Enter your password"
                  minLength={8}
                  maxLength={30}
                  required
                />
                <span
                  className="toggle-password"
                  onClick={() => setShowPassword((prev) => !prev)}
                  title={showPassword ? "Hide Password" : "Show Password"}
                >
                  {showPassword ? <FaEyeSlash /> : <FaEye />}
                </span>
              </div>
            </div>

            <button type="submit" className="login-button" disabled={loading}>
              {loading ? "Logging in..." : "Login"}
            </button>

            <p className="switch-text">
              Don’t have an account? <a href="/register">Register</a>
            </p>
          </form>
        </div>
      </div>

      <ToastContainer
        position="top-center"
        autoClose={1500}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        pauseOnFocusLoss={false}
        pauseOnHover={false}
        draggable
        limit={2}
      />
    </>
  );
}

export default Login;
