// src/services/authService.js

// 📦 Axios for HTTP requests
import axios from "axios";

// 🌐 Backend base URL for authentication APIs
const API = "http://localhost:8081/api/auth";

/**
 * 🔐 login()
 * --------------------------------------------
 * Authenticates user with backend via username/password.
 *
 * 📤 Input:  { username, password }
 * 🌐 POST:   /api/auth/login
 * 📥 Output: { token, role }  ← used for auth/session
 */
export const login = async ({ username, password }) => {
  const response = await axios.post(
    `${API}/login`,
    { username, password },
    {
      headers: {
        "Content-Type": "application/json",
      },
      withCredentials: true, // ✅ Enables credentials (cookies) if required
    }
  );
  return response.data;
};

/**
 * 📝 register()
 * --------------------------------------------
 * Registers a new user (Customer/Admin) via backend.
 *
 * 📤 Input:  { name, email, username, password, role, adminKey? }
 * 🌐 POST:   /api/auth/register
 * 📌 adminKey added only if role === "ADMIN"
 * 📥 Output: { message } or error
 */

export const register = async ({
  name,
  email,
  username,
  password,
  role,
  adminKey,
}) => {
  const payload = {
    name,
    email,
    username,
    password,
    role,
  };

  // 🔑 Only include adminKey if user is registering as ADMIN
  if (role === "ADMIN" && adminKey) {
    payload.adminKey = adminKey;
  }

  const response = await axios.post(`${API}/register`, payload, {
    headers: {
      "Content-Type": "application/json",
    },
    withCredentials: true,
  });

  return response.data;
};
