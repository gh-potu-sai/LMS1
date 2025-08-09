import React, { useEffect, useState } from "react";
import {
  FaUser,
  FaUsersCog,
  FaFileAlt,
  FaMoneyBillWave,
  FaCogs,
  FaChartLine,
  FaAddressCard,
  FaSignOutAlt
} from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import LogoutButton from "../global/LogoutButton";
import AdminProfile from "./AdminProfile";
import AdminLoanList from "../loan/adminloan/AdminLoanList";
import LoanTypeConfig from "../loan/adminloan/LoanTypeConfig";
import InterestPenaltyConfig from "../loan/adminloan/InterestPenaltyConfig";
import UserManagementPage from "../loan/adminloan/UserManagementPage"; // ✅ Import new page

import "../../styles/dashboard/Dashboard.css";

function AdminDashboard() {
  const navigate = useNavigate();
  const [activeSection, setActiveSection] = useState("dashboard");
  const [user, setUser] = useState({ name: "" });
  const [sidebarVisible, setSidebarVisible] = useState(false);

  const toggleSidebar = () => setSidebarVisible(prev => !prev);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) return navigate("/login");

    fetch("http://localhost:8081/api/admin/me", {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
      .then((res) => {
        if (!res.ok) throw new Error("Unauthorized");
        return res.json();
      })
      .then((data) => setUser(data))
      .catch(() => navigate("/login"));
  }, [navigate]);

  return (
    <div className="dashboard-container">
      {/* ☰ Toggle Sidebar for small screens */}
      <button className="dashboard-toggle-btn" onClick={toggleSidebar}>
        ☰
      </button>

      {/* Overlay on Sidebar open */}
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
        </nav>

        <div className="dashboard-logout">
          <LogoutButton icon={<FaSignOutAlt />} />
        </div>
      </aside>

      {/* Main Content */}
      <main className="dashboard-main">
        {activeSection === "profile" && <AdminProfile />}
        {activeSection === "loanApplications" && <AdminLoanList />}
        {activeSection === "loanConfig" && <LoanTypeConfig />}
        {activeSection === "interestPenalty" && <InterestPenaltyConfig />}
        {activeSection === "dashboard" && <h2>📊 Welcome to Admin Dashboard</h2>}
        {activeSection === "userManagement" && <UserManagementPage />} {/* ✅ New Page */}
        {activeSection === "reports" && <h2>📈 Reports & Analytics Coming Soon</h2>}
      </main>
    </div>
  );
}

export default AdminDashboard;
