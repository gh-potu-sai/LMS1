import React from "react";
import { useNavigate } from "react-router-dom";

function LogoutButton() {
  const navigate = useNavigate();

  const logout = () => {
    localStorage.clear();
    navigate("/login");
  };

  return (
    <button onClick={logout} style={{ padding: "8px 16px", marginTop: "1rem" }}>
      Logout
    </button>
  );
}

export default LogoutButton;
