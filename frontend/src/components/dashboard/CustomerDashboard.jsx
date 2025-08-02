import React, { useEffect, useState } from "react";
import {
  FaUser,
  FaMoneyBillAlt,
  FaFileAlt,
  FaSignOutAlt,
  FaSearch,
  FaCreditCard,
  FaIdBadge,
  FaEnvelope
} from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import LogoutButton from "../global/LogoutButton";
import CustomerProfile from "./CustomerProfile";
import ApplyLoanForm from "../loan/customerLoan/ApplyLoanForm";  // <-- Import here
import CustomerLoanList from "../loan/customerLoan/CustomerLoanList";

import "../../styles/dashboard/Dashboard.css";

function CustomerDashboard() {
  const navigate = useNavigate();
  const [activeSection, setActiveSection] = useState("dashboard");
  const [user, setUser] = useState({ name: "" });
  const [sidebarVisible, setSidebarVisible] = useState(false);

  const toggleSidebar = () => setSidebarVisible(prev => !prev);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) navigate("/login");

    fetch("http://localhost:8081/api/customer/me", {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
      .then((res) => res.json())
      .then((data) => setUser(data))
      .catch(() => navigate("/login"));
  }, [navigate]);

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
          <h3>{user.name}</h3>
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
            className={activeSection === "status" ? "active" : ""}
            onClick={() => setActiveSection("status")}
          >
            <FaSearch /> Status Tracking
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
            className={activeSection === "contact" ? "active" : ""}
            onClick={() => setActiveSection("contact")}
          >
            <FaEnvelope /> Contact Us
          </button>
        </nav>

        <div className="dashboard-logout">
          <LogoutButton icon={<FaSignOutAlt />} />
        </div>
      </aside>

      {/* Main Section */}
      <main className="dashboard-main">
        {activeSection === "profile" && <CustomerProfile />}
        {activeSection === "apply" && <ApplyLoanForm />}
        {/* Keeping others commented for future */}
        {/* {activeSection === "dashboard" && <DashboardHome />} */}
        {activeSection === "applications" && <CustomerLoanList />}

        {/* {activeSection === "status" && <StatusTracking />} */}
        {/* {activeSection === "payments" && <EMIPayments />} */}
        {/* {activeSection === "contact" && <ContactUsForm />} */}
      </main>
    </div>
  );
}

export default CustomerDashboard;
