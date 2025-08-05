import React, { useEffect, useState } from "react";

import "../../../styles/loan/customerLoan/CustomerLoanList.css";
import LoanDetailCard from "./LoanDetailCard";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";




// 🖼️ Loan Type Images
import HomeLoanImg from "../../../assets/Home_Loan.png";
import VehicleLoanImg from "../../../assets/Vehicle_Loan.png";
import PersonalLoanImg from "../../../assets/Personal_Loan.png";
import EducationalLoanImg from "../../../assets/Educational_Loan.png";
import BusinessLoanImg from "../../../assets/Business_Loan.png";
import AgriculturalLoanImg from "../../../assets/Agricultural_Loan.png";

import { FiSend, FiCheckCircle, FiXCircle, FiLock } from "react-icons/fi";
import { FaTimes } from "react-icons/fa";

function CustomerLoanList() {
  const [loans, setLoans] = useState([]);
  const [filteredLoans, setFilteredLoans] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedLoan, setSelectedLoan] = useState(null);

  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");
  const [typeFilter, setTypeFilter] = useState("All");
  
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  
  const [sortOption, setSortOption] = useState("");
  
  const [showFilters, setShowFilters] = useState(false);



  useEffect(() => {
    const token = localStorage.getItem("token");
    fetch("http://localhost:8081/api/customer/loans", {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((res) => res.json())
      .then((data) => {
        setLoans(data);
        setFilteredLoans(data);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Error fetching loans:", err);
        setLoading(false);
      });
  }, []);

  useEffect(() => {
    let result = [...loans]; 

    if (searchTerm) {
      const term = searchTerm.toLowerCase();

      result = result.filter((loan) => {
        const loanType = loan.loanType?.name?.toLowerCase() || "";
        const referenceId = loan.referenceId?.toLowerCase() || "";
        const id = loan.id?.toString() || "";
        const customId = `ln00${loan.id}`.toLowerCase(); // based on actual loan.id

        return (
          loanType.includes(term) ||
          referenceId.includes(term) ||
          id.includes(term) ||
          customId.includes(term)
        );
      });
    }
    
    


    if (statusFilter !== "All") {
      result = result.filter((loan) => loan.loanStatus === statusFilter);
    }

    if (typeFilter !== "All") {
      result = result.filter((loan) => loan.loanType?.name === typeFilter);
    }

    if (startDate && endDate) {
      result = result.filter((loan) => {
        const submittedDate = new Date(loan.submittedAt);
        return (
          submittedDate >= new Date(startDate) &&
          submittedDate <= new Date(endDate)
        );
      });
    }

    // ✅ Sorting Logic
    if (sortOption === "amount-asc") {
      result.sort((a, b) => a.amount - b.amount);
    } else if (sortOption === "amount-desc") {
      result.sort((a, b) => b.amount - a.amount);
    }else if (sortOption === "duration-asc") {
      result.sort((a, b) => a.tenureYears - b.tenureYears);
    }else if (sortOption === "duration-desc") {
      result.sort((a, b) => b.tenureYears - a.tenureYears);
    }else {
      // Default: newest on top
      result.sort((a, b) => new Date(b.submittedAt) - new Date(a.submittedAt));
    }

    setFilteredLoans(result);
  }, [searchTerm, statusFilter, typeFilter, loans, startDate, endDate, sortOption]);

  useEffect(() => {
    if (selectedLoan) {
      document.body.classList.add("modal-open");
    } else {
      document.body.classList.remove("modal-open");
    }

    // optional cleanup on unmount
    return () => document.body.classList.remove("modal-open");
  }, [selectedLoan]);


  const clearFilters = () => {
    setSearchTerm("");
    setStatusFilter("All");
    setTypeFilter("All");
    setStartDate("");
    setEndDate("");
    setSortOption("");

    const scrollContainer = document.querySelector(".loan-cards-scroll-wrapper");
    if (scrollContainer) scrollContainer.scrollTop = 0;

    toast.info("Filters cleared");

  };




  // 🖼️ Loan Image Mapper
  const getLoanImage = (type) => {
    switch (type) {
      case "Home Loan":
        return HomeLoanImg;
      case "Vehicle Loan":
        return VehicleLoanImg;
      case "Personal Loan":
        return PersonalLoanImg;
      case "Education Loan":
        return EducationalLoanImg;
      case "Business Loan":
        return BusinessLoanImg;
      case "Agricultural Loan":
        return AgriculturalLoanImg;
      default:
        return PersonalLoanImg;
    }
  };

  return (

    
    <div className="loan-page-wrapper">
      
      <button
        className="toggle-filters-btn"
        onClick={() => setShowFilters(prev => !prev)}
      >
        {showFilters ? "Hide Filters" : "Show Filters"}
      </button>

      {/* 🔍 Fixed Top Filter Section */}
      <div className={`loan-filter-fixed ${showFilters ? "open" : ""}`}>

        <div className="loan-filter-card">
          <div className="loan-filter-group">
            <label>Search Applications</label>
            <input
              type="text"
              placeholder="Loan ID or Type..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="loan-filter-input"
            />
          </div>

          <div className="loan-filter-group">
            <label>Status</label>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="loan-filter-input"
            >
              <option value="All">All Status</option>
              <option value="SUBMITTED">Submitted</option>  {/* ✅ */}
              <option value="APPROVED">Approved</option>
              <option value="REJECTED">Rejected</option>
              <option value="CLOSED">Closed</option>        {/* Optional */}
            </select>

          </div>

          <div className="loan-filter-group">
            <label>Loan Type</label>
            <select
              value={typeFilter}
              onChange={(e) => setTypeFilter(e.target.value)}
              className="loan-filter-input"
            >
              <option value="All">All Types</option>
              <option value="Home Loan">Home Loan</option>
              <option value="Education Loan">Education Loan</option>
              <option value="Personal Loan">Personal Loan</option>
              <option value="Vehicle Loan">Vehicle Loan</option>
              <option value="Business Loan">Business Loan</option>
              <option value="Agricultural Loan">Agricultural Loan</option>
            </select>
          </div>
          <div className="loan-filter-group">
            <label>From Date</label>
            <input
              type="date"
              className="loan-filter-input"
              max={new Date().toISOString().split("T")[0]}
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
            />
          </div>

          <div className="loan-filter-group">
            <label>To Date</label>
            <input
              type="date"
              className="loan-filter-input"
              max={new Date().toISOString().split("T")[0]}
              value={endDate}
              onChange={(e) => setEndDate(e.target.value)}
            />
          </div>
          
          <div className="loan-filter-group">
            <label>Sort By</label>
            <select
              value={sortOption}
              onChange={(e) => setSortOption(e.target.value)}
              className="loan-filter-input"
            >
              <option value="">None</option>
              <option value="amount-asc">Loan Amount: Low to High</option>
              <option value="amount-desc">Loan Amount: High to Low</option>
              <option value="duration-asc">Duration: Low to High</option>
              <option value="duration-desc">Duration: High to Low</option>
            </select>
          </div>

        </div>
      </div>


      {/* 🧾 Header Section */}
      <div className="loan-section-header-wrapper">
        <h3 className="loan-section-heading">Applications</h3>
        <p className="loan-count-label">Showing {filteredLoans.length} applications</p>

        {/* 🏷️ Active Filters */}
        <div className="active-filter-tags">
          {statusFilter !== "All" && (
            <span className="filter-badge">
              Status: {statusFilter.charAt(0) + statusFilter.slice(1).toLowerCase()}
            </span>
          )}
          {typeFilter !== "All" && (
            <span className="filter-badge">
              Loan Type: {typeFilter}
            </span>
          )}
          {searchTerm && (
            <span className="filter-badge">
              Search: "{searchTerm}"
            </span>
          )}
          {startDate && endDate && (
            <span className="filter-badge">
              Date: {startDate} to {endDate}
            </span>
          )}
          
          {sortOption && (
            <span className="filter-badge">
              Sort: {(() => {
                switch (sortOption) {
                  case "amount-asc": return "Amount: Low to High";
                  case "amount-desc": return "Amount: High to Low";
                  case "duration-asc": return "Duration: Low to High";
                  case "duration-desc": return "Duration: High to Low";
                  default: return "";
                }
              })()}
            </span>
          )}
          
          {(searchTerm || statusFilter !== "All" || typeFilter !== "All" || (startDate && endDate) || sortOption) && (
            <div className="clear-filters-inline">
              <button onClick={clearFilters} className="loan-filter-clear-btn">
                Clear Filters
              </button>
            </div>
          )}

        </div>
        
        {/* 🌀 Scrollable Loan Card Section */}
        <div className="loan-cards-scroll-wrapper">
          {loading ? (
            <p>Loading...</p>
          ) : filteredLoans.length === 0 ? (
            <div className="no-applications-message">
              No loan applications found.
            </div>

          ) : (
            filteredLoans.map((loan, index) => (
              
              
              
              <div className="loan-card-ui" key={loan.id}>
                {/* Left Section */}
                <div className="loan-card-left">
                  <img src={getLoanImage(loan.loanType?.name)} alt={loan.loanType?.name} />
                  <div>
                    <h4 className="loan-title">{loan.loanType?.name}</h4>

                    <p className="loan-id">Application ID: {loan.referenceId || `LN00${loan.id}`}</p>

                    <p className="loan-applied-date">
                      Applied on: {new Date(loan.submittedAt).toLocaleDateString("en-IN")}
                    </p>
                  </div>
                </div>

                {/* Middle Section */}
                <div className="loan-card-middle">
                  <h3 className="loan-amount">₹ {Number(loan.amount).toLocaleString("en-IN")}</h3>
                  <p className="loan-label loan-purpose">{loan.tenureYears ?? "N/A"} {loan.tenureYears > 1 ? "years" : "year"} - {loan.appliedInterestRate ?? 'N/A'}%</p>
                  <p className="loan-label loan-purpose">Purpose : {loan.purpose}</p>
                </div>

                {/* Right Section */}
                <div className="loan-card-right">
                  <span className={`loan-status-badge ${loan.loanStatus?.toLowerCase()}`}>
                    {loan.loanStatus === "SUBMITTED" && <><FiSend style={{ marginRight: "5px" }} />SUBMITTED</>}
                    {loan.loanStatus === "APPROVED" && <><FiCheckCircle style={{ marginRight: "5px" }} />APPROVED</>}
                    {loan.loanStatus === "REJECTED" && <><FiXCircle style={{ marginRight: "5px" }} />REJECTED</>}
                    {loan.loanStatus === "CLOSED" && <><FiLock style={{ marginRight: "5px" }} />CLOSED</>}
                  </span>
                  <div className="loan-action-buttons">
                    <button className="view-btn" onClick={() => setSelectedLoan(loan)}>View Details</button>
                    <button className="track-btn">
                      {loan.loanStatus === "APPROVED" ? "EMI Schedule" : "Track Status"}
                    </button>
                  </div>
                </div>
              </div>

            ))
          )}
        </div>

      </div>


      

      {/* 📑 Modal View */}
      {selectedLoan && (
        <div className="loan-modal-overlay" onClick={() => setSelectedLoan(null)}>
          <div className="loan-modal-content" onClick={(e) => e.stopPropagation()}>
            <button className="close-icon" onClick={() => setSelectedLoan(null)}>
              <FaTimes size={18} />
            </button>

            <LoanDetailCard loan={selectedLoan} onClose={() => setSelectedLoan(null)} />
          </div>
        </div>
      )}

      
      <ToastContainer position="top-center" autoClose={2000} />

    </div>
    
  );


}

export default CustomerLoanList;
