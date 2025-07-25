import axios from "axios";

const API = "http://localhost:8081/api/auth";

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

export const register = async ({ name, email, username, password, role }) => {
  const response = await axios.post(
    `${API}/register`,
    { name, email, username, password, role },
    {
      headers: {
        "Content-Type": "application/json",
      },
      withCredentials: true,
    }
  );
  return response.data;
};
