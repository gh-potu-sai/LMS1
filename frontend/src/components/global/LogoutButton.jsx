import React from "react";
import { useNavigate } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

function LogoutButton() {
  const navigate = useNavigate();

  const logout = () => {
    localStorage.clear();
    toast.success("You have been logged out!", {
      position: "top-center",
      autoClose: 2000,
    });

    // Redirect after short delay to let toast show
    setTimeout(() => {
      navigate("/");
    }, 2000);
  };

  return (
    <>
      <button onClick={logout} style={{ padding: "8px 16px", marginTop: "1rem" }}>
        Logout
      </button>
      <ToastContainer />
    </>
  );
}

export default LogoutButton;
