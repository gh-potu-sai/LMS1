import React, { useEffect, useState } from "react";
import {
  FaUser,
  FaMoneyBillAlt,
  FaFileAlt,
  FaSignOutAlt,
  FaCreditCard,
  FaIdBadge,
  FaComments,
} from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import LogoutButton from "../global/LogoutButton";
import CustomerProfile from "./CustomerProfile";
import ApplyLoanForm from "../loan/customerLoan/ApplyLoanForm";
import CustomerLoanList from "../loan/customerLoan/CustomerLoanList";
import CustomerChat from "../chat/CustomerChat";

import "../../styles/dashboard/Dashboard.css";

function CustomerDashboard() {
  const navigate = useNavigate();
  const [activeSection, setActiveSection] = useState("dashboard");

  // User info for main dashboard features
  const [customerUser, setCustomerUser] = useState({ name: "" });
  const [loadingUser, setLoadingUser] = useState(true);

  // User info for chat support features
  const [chatUser, setChatUser] = useState({ userId: null });

  const [sidebarVisible, setSidebarVisible] = useState(false);

  const toggleSidebar = () => setSidebarVisible((prev) => !prev);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      navigate("/login");
      return;
    }

    // Fetch main customer user info
    fetch("http://localhost:8081/api/customer/me", {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
      .then((res) => {
        if (!res.ok) throw new Error("Failed to fetch customer user");
        return res.json();
      })
      .then((data) => {
        setCustomerUser(data);
        setLoadingUser(false);
      })
      .catch(() => navigate("/login"));

    // Fetch chat user info
    fetch("http://localhost:8081/api/chat/me", {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
      .then((res) => {
        if (!res.ok) throw new Error("Failed to fetch chat user");
        return res.json();
      })
      .then((data) => setChatUser(data))
      .catch(() => {
        // Optional: Handle chat fetch failure without redirecting
        console.warn("Failed to fetch chat user info");
      });
  }, [navigate]);

  if (loadingUser) {
    return (
      <div className="dashboard-container">
        <p style={{ textAlign: "center", marginTop: "2rem" }}>
          Loading user information...
        </p>
      </div>
    );
  }

  return (
    <div className="dashboard-container">
      {/* ☰ Toggle Button */}
      <button className="dashboard-toggle-btn" onClick={toggleSidebar}>
        ☰
      </button>

      {/* Overlay for sidebar */}
      <div
        className={`dashboard-overlay ${sidebarVisible ? "show" : ""}`}
        onClick={toggleSidebar}
      ></div>

      {/* Sidebar */}
      <aside className={`dashboard-sidebar ${sidebarVisible ? "show" : ""}`}>
        <div className="dashboard-user-info">
          <FaUser size={42} className="dashboard-user-icon" />
          <p>Welcome,</p>
          <h3>{customerUser.name}</h3>
          <hr className="dashboard-divider" />
        </div>

        <nav className="dashboard-nav">
          <button
            className={activeSection === "dashboard" ? "active" : ""}
            onClick={() => setActiveSection("dashboard")}
          >
            <FaUser /> Dashboard
          </button>
          <button
            className={activeSection === "applications" ? "active" : ""}
            onClick={() => setActiveSection("applications")}
          >
            <FaFileAlt /> My Applications
          </button>
          <button
            className={activeSection === "apply" ? "active" : ""}
            onClick={() => setActiveSection("apply")}
          >
            <FaMoneyBillAlt /> Apply For Loan
          </button>
          
          <button
            className={activeSection === "payments" ? "active" : ""}
            onClick={() => setActiveSection("payments")}
          >
            <FaCreditCard /> EMI & Payments
          </button>
          <button
            className={activeSection === "profile" ? "active" : ""}
            onClick={() => setActiveSection("profile")}
          >
            <FaIdBadge /> My Profile
          </button>
          <button
            className={activeSection === "chatSupport" ? "active" : ""}
            onClick={() => setActiveSection("chatSupport")}
          >
            <FaComments /> Chat Support
          </button>
        </nav>

        <div className="dashboard-logout">
          <LogoutButton icon={<FaSignOutAlt />} />
        </div>
      </aside>

      {/* Main Section */}
      <main className="dashboard-main">
        {activeSection === "dashboard" && (
          <h2>📈 Dashboard & Analytics Coming Soon</h2>
        )}
        {activeSection === "applications" && <CustomerLoanList />}
        {activeSection === "apply" && <ApplyLoanForm />}
        
        {activeSection === "payments" && <h2>EMI & Payments Coming Soon</h2>}
        {activeSection === "profile" && <CustomerProfile />}
        {activeSection === "chatSupport" && chatUser.userId ? (
          <CustomerChat customerId={chatUser.userId} />
        ) : activeSection === "chatSupport" ? (
          <p>Loading chat support...</p>
        ) : null}
      </main>
    </div>
  );
}

export default CustomerDashboard;
