import React, { useEffect, useState, useCallback } from "react";
import axios from "axios";
import "../../../styles/loan/adminloan/LoanTypeConfig.css";

import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

function LoanTypeConfig() {
  const [loanTypes, setLoanTypes] = useState([]);
  const [newLoan, setNewLoan] = useState({
    name: "",
    requirements: "",
    maxTenureYears: "",
    maxLoanAmount: "",
  });

  const [editModalOpen, setEditModalOpen] = useState(false);
  const [editingLoan, setEditingLoan] = useState(null);

  const fetchLoanTypes = useCallback(async () => {
    try {
      const token = localStorage.getItem("token");
      const res = await axios.get("http://localhost:8081/api/admin/loan-types", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setLoanTypes(res.data);
    } catch (error) {
      console.error("Error fetching loan types:", error);
      toast.error("Failed to fetch loan types");
    }
  }, []);

  useEffect(() => {
    fetchLoanTypes();
  }, [fetchLoanTypes]);

  const handleChange = (e) => {
    const { name, value } = e.target;

    if (name === "maxLoanAmount") {
      const numericValue = value.replace(/[^0-9]/g, "").slice(0, 9); // Max 9 digits
      const formatted = new Intl.NumberFormat("en-IN").format(numericValue);

      setNewLoan((prev) => ({
        ...prev,
        [name]: numericValue ? formatted : "",
      }));
    } else if (name === "maxTenureYears") {
      const numericValue = value.replace(/[^0-9]/g, "").slice(0, 2);
      if (+numericValue <= 30) {
        setNewLoan((prev) => ({
          ...prev,
          [name]: numericValue,
        }));
      }
    } else if (name === "name") {
      if (value.length <= 100) {
        setNewLoan((prev) => ({
          ...prev,
          [name]: value,
        }));
      }
    } else if (name === "requirements") {
      if (value.length <= 200) {
        setNewLoan((prev) => ({
          ...prev,
          [name]: value,
        }));
      }
    }
  };



  const handleCreate = async () => {
  let { name, requirements, maxTenureYears, maxLoanAmount } = newLoan;

  if (!name || !requirements || !maxTenureYears || !maxLoanAmount) {
    toast.error("Please fill in all fields");
    return;
  }

  maxLoanAmount = maxLoanAmount.replace(/,/g, "");

  try {
    const token = localStorage.getItem("token");

    await axios.post(
      "http://localhost:8081/api/admin/loan-types",
      {
        name,
        requirements,
        maxTenureYears,
        maxLoanAmount,
      },
      {
        headers: { Authorization: `Bearer ${token}` },
      }
    );

    setNewLoan({
      name: "",
      requirements: "",
      maxTenureYears: "",
      maxLoanAmount: "",
    });

    toast.success("New loan type added");
    fetchLoanTypes();
  } catch (error) {
    console.error("Error creating loan type:", error);
    toast.error("Error adding loan type");
  }
};


  const handleDelete = async (id) => {
    try {
      const token = localStorage.getItem("token");
      await axios.delete(`http://localhost:8081/api/admin/loan-types/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      toast.success("Loan type deleted");
      fetchLoanTypes();
    } catch (error) {
      console.error("Error deleting loan type:", error);
      toast.error("Error deleting");
    }
  };

  const openEditModal = (loan) => {
    const formattedAmount = new Intl.NumberFormat("en-IN").format(loan.maxLoanAmount);
    setEditingLoan({ ...loan, maxLoanAmount: formattedAmount });
    setEditModalOpen(true);
  };


  const handleEditChange = (e) => {
    const { name, value } = e.target;

    if (name === "maxLoanAmount") {
      const numericValue = value.replace(/[^0-9]/g, "").slice(0, 9);
      const formatted = new Intl.NumberFormat("en-IN").format(numericValue);

      setEditingLoan((prev) => ({
        ...prev,
        [name]: numericValue ? formatted : "",
      }));
    } else if (name === "maxTenureYears") {
      const numericValue = value.replace(/[^0-9]/g, "").slice(0, 2);
      if (+numericValue <= 30) {
        setEditingLoan((prev) => ({
          ...prev,
          [name]: numericValue,
        }));
      }
    } else if (name === "name") {
      if (value.length <= 100) {
        setEditingLoan((prev) => ({
          ...prev,
          [name]: value,
        }));
      }
    } else if (name === "requirements") {
      if (value.length <= 200) {
        setEditingLoan((prev) => ({
          ...prev,
          [name]: value,
        }));
      }
    }
  };



  const handleSaveEdit = async () => {
    let { name, requirements, maxTenureYears, maxLoanAmount } = editingLoan;

    if (!name || !requirements || !maxTenureYears || !maxLoanAmount) {
      toast.error("All fields are required");
      return;
    }

    // Remove commas from formatted value
    maxLoanAmount = maxLoanAmount.replace(/,/g, "");

    try {
      const token = localStorage.getItem("token");

      await axios.put(
        `http://localhost:8081/api/admin/loan-types/${editingLoan.loanTypeId}`,
        {
          ...editingLoan,
          maxLoanAmount, // cleaned value
        },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      toast.success("Loan type updated");
      fetchLoanTypes();
      setEditModalOpen(false);
    } catch (error) {
      console.error("Error updating loan type:", error);
      toast.error("Failed to update");
    }
  };


  return (
    <div className="loan-type-config-wrapper">
      <ToastContainer position="top-center" autoClose={2000} hideProgressBar />

      <div className="loan-type-header">
        
        <h2 className="loan-type-title">Loan Type Configuration</h2>
        <p className="loan-type-subtitle">Manage and add new loan categories</p>
        <p className="loan-type-count">Total Loan Types: {loanTypes.length}</p>
      </div>

      <div className="loan-type-form">
        <input
          name="name"
          value={newLoan.name}
          onChange={handleChange}
          placeholder="Loan Name"
          className="loan-type-input"
          maxLength={100}
          title="Maximum 100 characters allowed"
        />

        <input
          name="requirements"
          value={newLoan.requirements}
          onChange={handleChange}
          placeholder="Requirements"
          className="loan-type-input"
          maxLength={200}
          title="Maximum 200 characters allowed"
        />

        <input
          name="maxTenureYears"
          value={newLoan.maxTenureYears}
          onChange={handleChange}
          placeholder="Max Tenure (Years)"
          className="loan-type-input"
          inputMode="numeric"
          maxLength={2}
          pattern="[1-9]|[1-2][0-9]|30"
          title="Value must be between 1 and 30"
        />

        <input
          name="maxLoanAmount"
          value={newLoan.maxLoanAmount}
          onChange={handleChange}
          placeholder="Max Amount (₹)"
          className="loan-type-input"
          inputMode="decimal"
          maxLength={16} 
          title="Maximum ₹100 Cr allowed (e.g., 999999999.99)"
        />

        <button onClick={handleCreate} className="loan-type-add-btn">
          Add New Loan
        </button>
      </div>

      <div className="loan-type-table-wrapper">
        <table className="loan-type-table scrollable">
          <thead>
            <tr>
              <th>Name</th>
              <th className="requirement-col">Requirements</th>
              <th>Max Tenure</th>
              <th>Max Amount</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {loanTypes.map((loan) => (
              <tr key={loan.loanTypeId}>
                <td>{loan.name}</td>
                <td>{loan.requirements}</td>
                <td>{loan.maxTenureYears} yrs</td>
                <td>₹ {parseInt(loan.maxLoanAmount).toLocaleString("en-IN")}</td>
                <td>
                  <button
                    className="loan-type-edit-btn"
                    onClick={() => openEditModal(loan)}
                  >
                    Modify
                  </button>
                  <button
                    onClick={() => handleDelete(loan.loanTypeId)}
                    className="loan-type-delete-btn"
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>



      {/* 🔐 Edit Modal */}
      {editModalOpen && (
    <div
      className="loan-type-modal-overlay"
      onClick={(e) => {
        if (e.target.classList.contains("loan-type-modal-overlay")) {
          setEditModalOpen(false);
        }
      }}
    >
    <div className="loan-type-modal">
      <button
        className="loan-type-modal-close"
        onClick={() => setEditModalOpen(false)}
      >
        &times;
      </button>

      <h4>Edit Loan Type</h4>

      <label htmlFor="editName">Loan Name</label>
      <input
        id="editName"
        name="name"
        value={editingLoan.name}
        onChange={handleEditChange}
        placeholder="Loan Name"
      />

      <label htmlFor="editRequirements">Requirements</label>
      <input
        id="editRequirements"
        name="requirements"
        value={editingLoan.requirements}
        onChange={handleEditChange}
        placeholder="Requirements"
      />

      <label htmlFor="editTenure">Max Tenure (Years)</label>
      <input
        id="editTenure"
        name="maxTenureYears"
        value={editingLoan.maxTenureYears}
        onChange={handleEditChange}
        placeholder="Max Tenure (Years)"
      />

      <label htmlFor="editAmount">Max Loan Amount (₹)</label>
      <input
        id="editAmount"
        name="maxLoanAmount"
        value={editingLoan.maxLoanAmount}
        onChange={handleEditChange}
        placeholder="Max Amount (₹)"
      />

      <div className="loan-type-modal-buttons">
        <button onClick={() => setEditModalOpen(false)} className="cancel">
          Cancel
        </button>
        <button onClick={handleSaveEdit} className="save">
          Save
        </button>
      </div>
    </div>
  </div>
)}

    </div>
  );
}

export default LoanTypeConfig;
