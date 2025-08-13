// src/components/dashboard/CustomerDashboardMain.jsx
import React, { useEffect, useState } from "react";
import {
  FaFileAlt,
  FaCheckCircle,
  FaBuilding,
  FaHourglassHalf,
  FaCreditCard,
} from "react-icons/fa";

import {
  getCustomerLoans,
  getLoanWithEmis,
} from "../../services/emiService";

import "../../styles/dashboard/CustomerDashboardMain.css";

// Loan Icons
import HomeLoan from "../../assets/Home_Loan.png";
import VehicleLoan from "../../assets/Vehicle_Loan.png";
import PersonalLoan from "../../assets/Personal_Loan.png";
import EducationalLoan from "../../assets/Educational_Loan.png";
import BusinessLoan from "../../assets/Business_Loan.png";
import AgriculturalLoan from "../../assets/Agricultural_Loan.png";

function CustomerDashboardMain({ activeSection, setActiveSection }) {
  const [loans, setLoans] = useState([]);
  const [loanDetails, setLoanDetails] = useState({});

  useEffect(() => {
    const fetchData = async () => {
      const data = await getCustomerLoans();
      setLoans(data || []);

      const details = {};
      await Promise.all(
        (data || []).map(async (loan) => {
          const d = await getLoanWithEmis(loan.id);
          details[loan.id] = d;
        })
      );
      setLoanDetails(details);
    };

    fetchData();
  }, []);

  const getLoanImage = (type) => {
    switch (type) {
      case "Home Loan":
        return HomeLoan;
      case "Vehicle Loan":
        return VehicleLoan;
      case "Personal Loan":
        return PersonalLoan;
      case "Education Loan":
        return EducationalLoan;
      case "Business Loan":
        return BusinessLoan;
      case "Agricultural Loan":
        return AgriculturalLoan;
      default:
        return PersonalLoan;
    }
  };

  const totalApplications = loans.length;
  const approvedAmount = loans
    .filter((l) => l.loanStatus === "APPROVED")
    .reduce((sum, l) => sum + (l.amount || 0), 0);
  const activeLoans = loans.filter((l) => l.loanStatus === "APPROVED").length;
  const pendingLoans = loans.filter(
    (l) => l.loanStatus === "SUBMITTED" || l.loanStatus === "UNDER_REVIEW"
  ).length;

  const approvedApps = loans
    .filter((l) => l.loanStatus === "APPROVED")
    .slice(0, 5)
    .map((loan) => {
      const pack = loanDetails[loan.id];
      const totalPaid =
        pack?.emis?.filter((e) => e.status === "PAID").reduce((sum, e) => sum + e.amount, 0) || 0;
      const totalDue = (loan.amount || 0) - totalPaid;
      return { ...loan, paid: totalPaid, remaining: totalDue };
    });

  const today = new Date();
  const nextWeek = new Date(today.getTime() + 7 * 24 * 60 * 60 * 1000);
  const upcomingEMIs = Object.values(loanDetails)
    .flatMap((d) => d?.emis || [])
    .filter(
      (emi) =>
        emi.status === "PENDING" &&
        new Date(emi.dueDate) >= today &&
        new Date(emi.dueDate) <= nextWeek
    )
    .sort((a, b) => new Date(a.dueDate) - new Date(b.dueDate));

  return (
    <div className="cdm-wrapper">
      {/* Top Stats */}
      <div className="cdm-stats-row">
        <div className="cdm-stat-box">
          <FaFileAlt />
          <p>Total Applications</p>
          <h3>{totalApplications}</h3>
        </div>
        <div className="cdm-stat-box">
          <FaCheckCircle />
          <p>Total Approved Amount</p>
          <h3>₹{approvedAmount.toLocaleString("en-IN")}</h3>
        </div>
        <div className="cdm-stat-box">
          <FaBuilding />
          <p>Active Loans</p>
          <h3>{activeLoans}</h3>
        </div>
        <div className="cdm-stat-box">
          <FaHourglassHalf />
          <p>Pending Loans</p>
          <h3>{pendingLoans}</h3>
        </div>
      </div>

      {/* Main Grid */}
      <div className="cdm-main-columns">
        {/* Left - Recent Applications */}
        <div className="cdm-applications">
          <h2>Recent Applications</h2>
          <p>Showing {approvedApps.length} approved applications</p>

          <div className="cdm-applications-scroll">
            {approvedApps.length === 0 ? (
              <div className="cdm-empty">No approved applications</div>
            ) : (
              approvedApps.map((loan) => (
                <div className="cdm-loan-card" key={loan.id}>
                  {/* Left */}
                  <div className="cdm-loan-left">
                    <img
                      src={getLoanImage(loan.loanType?.name)}
                      alt={loan.loanType?.name}
                      className="cdm-loan-img"
                    />
                    <div>
                      <h4 className="cdm-loan-type">{loan.loanType?.name}</h4>
                      <p className="cdm-loan-id">Application ID: LN00{loan.id}</p>
                    </div>
                  </div>

                  {/* Middle */}
                  <div className="cdm-loan-middle">
                    <h3>₹{loan.amount.toLocaleString("en-IN")}</h3>
                    <p>Paid: ₹{loan.paid.toLocaleString("en-IN")}</p>
                    <p>Remaining: ₹{loan.remaining.toLocaleString("en-IN")}</p>
                  </div>

                  {/* Right */}
                  <div className="cdm-loan-right">
                    <span className={`cdm-status-badge ${loan.loanStatus?.toLowerCase()}`}>
                      {loan.loanStatus}
                    </span>
                    <button onClick={() => setActiveSection("payments")}>
                      EMI Schedule
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Right - EMI Reminder */}
        <div className="cdm-emi-reminder">
          <h2>Upcoming EMI Payments (Next 7 Days)</h2>
          {upcomingEMIs.length === 0 ? (
            <p className="cdm-empty">No upcoming EMIs in the next 7 days</p>
          ) : (
            upcomingEMIs.map((emi, i) => (
              <div className="cdm-emi-card" key={i}>
                <FaCreditCard className="cdm-emi-icon" />
                <div>
                  <h4>Loan #{emi.loanId}</h4>
                  <p>Due on: {emi.dueDate}</p>
                </div>
                <div>
                  <h4>₹{emi.amount.toLocaleString("en-IN")}</h4>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}

export default CustomerDashboardMain;
