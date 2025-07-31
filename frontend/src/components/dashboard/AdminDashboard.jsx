import React, { useEffect, useState } from "react";
import {
  FaUser,
  FaUsersCog,
  FaFileAlt,
  FaMoneyBillWave,
  FaCogs,
  FaChartLine,
  FaAddressCard,
  FaEnvelope,
  FaSignOutAlt
} from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import LogoutButton from "../global/LogoutButton";
import AdminProfile from "./AdminProfile";
import "../../styles/dashboard/Dashboard.css";

function AdminDashboard() {
  const navigate = useNavigate();
  const [activeSection, setActiveSection] = useState("dashboard");
  const [user, setUser] = useState({ name: "" });

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) navigate("/login");

    fetch("http://localhost:8081/api/user/me", {
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
      {/* Sidebar */}
      <aside className="dashboard-sidebar">
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
            className={activeSection === "userManagement" ? "active" : ""}
            onClick={() => setActiveSection("userManagement")}
          >
            <FaUsersCog /> User Management
          </button>
          <button
            className={activeSection === "loanApplications" ? "active" : ""}
            onClick={() => setActiveSection("loanApplications")}
          >
            <FaFileAlt /> Loan Applications
          </button>
          <button
            className={activeSection === "interestPenalty" ? "active" : ""}
            onClick={() => setActiveSection("interestPenalty")}
          >
            <FaMoneyBillWave /> Interest & Penalty Config
          </button>
          <button
            className={activeSection === "loanConfig" ? "active" : ""}
            onClick={() => setActiveSection("loanConfig")}
          >
            <FaCogs /> Loan Type Configuration
          </button>
          <button
            className={activeSection === "reports" ? "active" : ""}
            onClick={() => setActiveSection("reports")}
          >
            <FaChartLine /> Reports & Analytics
          </button>
          <button
            className={activeSection === "profile" ? "active" : ""}
            onClick={() => setActiveSection("profile")}
          >
            <FaAddressCard /> My Profile
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
        {activeSection === "profile" && <AdminProfile />}
        {/* 
          Future content:
          {activeSection === "dashboard" && <AdminHome />}
          {activeSection === "userManagement" && <UserManagement />}
          {activeSection === "loanApplications" && <LoanApplications />}
          {activeSection === "interestPenalty" && <InterestPenaltyConfig />}
          {activeSection === "loanConfig" && <LoanTypeConfig />}
          {activeSection === "reports" && <ReportsAnalytics />}
          {activeSection === "contact" && <ContactAdmin />}
        */}
      </main>
    </div>
  );
}

export default AdminDashboard;
