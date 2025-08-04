import React, { useEffect, useState, useCallback } from "react";
import axios from "axios";
import "../../../styles/loan/adminloan/InterestPenaltyConfig.css";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const InterestPenaltyConfig = () => {
  const [loanTypes, setLoanTypes] = useState([]);
  const token = localStorage.getItem("token");

  const fetchLoanTypes = useCallback(async () => {
    try {
      const res = await axios.get("http://localhost:8081/api/admin/loan-types", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setLoanTypes(res.data);
    } catch (error) {
      console.error("Failed to load loan types", error);
      toast.error("Failed to load loan types", { autoClose: 2000 });
    }
  }, [token]);

  useEffect(() => {
    fetchLoanTypes();
  }, [fetchLoanTypes]);

  const handleChange = (index, field, value) => {
    if (
      (field === "interestRate" || field === "penaltyRatePercent") &&
      (!/^\d{0,3}(\.\d{0,2})?$/.test(value) || +value > 100)
    )
      return;

    const updated = [...loanTypes];
    updated[index][field] = value;
    setLoanTypes(updated);
  };

  const handleUpdate = async (loanType) => {
    try {
      await axios.put(
        `http://localhost:8081/api/admin/loan-types/${loanType.loanTypeId}`,
        loanType,
        { headers: { Authorization: `Bearer ${token}` } }
      );

      toast.success(`Updated "${loanType.name}"`, { autoClose: 2000 });
    } catch (error) {
      console.error("Update failed", error);
      toast.error(`Failed to update "${loanType.name}"`, { autoClose: 2000 });
    }
  };

  return (
    <div className="interest-config-wrapper">
      <ToastContainer position="top-center" autoClose={2000} hideProgressBar />
      <div className="interest-config-header">
        <h2 className="interest-config-title">Interest & Penalty Configuration</h2>
        <p className="interest-config-subtitle">
          Manage interest and penalty rates for loan types
        </p>
        <p className="interest-config-count">Total Loan Types: {loanTypes.length}</p>
      </div>

      <div className="interest-config-table-wrapper">
        <table className="interest-config-table scrollable">
          <thead>
            <tr>
              <th>Loan Type</th>
              <th>Interest Rate (%)</th>
              <th>Penalty Rate (%)</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {loanTypes.map((type, idx) => (
              <tr key={type.loanTypeId}>
                <td>{type.name}</td>
                <td>
                  <input
                    type="number"
                    step="0.01"
                    min="0"
                    max="100"
                    value={type.interestRate}
                    onChange={(e) =>
                      handleChange(idx, "interestRate", e.target.value)
                    }
                    className="interest-config-input"
                    placeholder="e.g., 9.50"
                  />
                </td>
                <td>
                  <input
                    type="number"
                    step="0.01"
                    min="0"
                    max="100"
                    value={type.penaltyRatePercent}
                    onChange={(e) =>
                      handleChange(idx, "penaltyRatePercent", e.target.value)
                    }
                    className="interest-config-input"
                    placeholder="e.g., 2.00"
                  />
                </td>

                <td>
                  <button
                    className="interest-config-update-btn"
                    onClick={() => handleUpdate(type)}
                  >
                    Save
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default InterestPenaltyConfig;
