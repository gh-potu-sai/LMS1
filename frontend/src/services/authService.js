// src/services/authService.js

import axios from "axios";

const API = "http://localhost:8081/api/auth";

// 🔐 Login function
export const login = async ({ username, password }) => {
  const response = await axios.post(
    `${API}/login`,
    { username, password },
    {
      headers: {
        "Content-Type": "application/json",
      },
      withCredentials: true,
    }
  );
  return response.data;
};

// 📝 Register function
export const register = async ({
  name,
  email,
  username,
  password,
  role,
  adminKey, // ✅ Accept adminKey from frontend
}) => {
  const payload = {
    name,
    email,
    username,
    password,
    role,
  };

  // ✅ Only include adminKey if role is ADMIN
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
