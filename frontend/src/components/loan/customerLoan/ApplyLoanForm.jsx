import { useEffect, useState } from "react";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "../../../styles/loan/customerLoan/CustomerLoan.css";

function ApplyLoanForm() {
  const employmentOptions = [
    "Software (IT)",
    "Software (Non-IT)",
    "Entrepreneur",
    "Farming / Agriculture",
    "Government Employee",
    "Self-Employed / Freelancer",
    "Student",
    "Healthcare / Medical",
    "Education / Teaching",
    "Other",
  ];

  const incomeRanges = [
    "N/A",
    "< ₹30,000",
    "₹30,000 - ₹70,000",
    "₹70,001 - ₹1,00,000",
    "> ₹1,00,000",
  ];

  const initialFormData = {
    loanTypeId: "",
    loanAmount: "",
    tenureYears: "",
    loanPurpose: "",
    income: "",
    employmentInfo: "",
    aadhaar: "",
    pan: "",
    previousActiveLoans: 0,
    cibilScore: "",
  };

  const formatCurrency = (value) => {
    if (!value) return "";
    const digits = value.replace(/\D/g, "");
    if (digits.length <= 3) return digits;
    let lastThree = digits.slice(-3);
    let otherNumbers = digits.slice(0, -3);
    if (otherNumbers !== "") lastThree = "," + lastThree;
    return otherNumbers.replace(/\B(?=(\d{2})+(?!\d))/g, ",") + lastThree;
  };

  const parseCurrency = (value) => value.replace(/,/g, "");

  // Calculate CIBIL score (same as your existing logic)
  const calculateCibilScore = (
    employmentInfo,
    incomeRange,
    loanPurpose,
    previousActiveLoans
  ) => {
    const baseScore = 300;

    const employmentPointsMap = {
      "Software (IT)": 250,
      "Software (Non-IT)": 220,
      Entrepreneur: 180,
      "Farming / Agriculture": 150,
      "Government Employee": 230,
      "Self-Employed / Freelancer": 160,
      Student: 80,
      "Healthcare / Medical": 210,
      "Education / Teaching": 190,
      Other: 140,
    };

    const incomePointsMap = {
      "> ₹1,00,000": 300,
      "₹70,001 - ₹1,00,000": 260,
      "₹30,000 - ₹70,000": 200,
      "< ₹30,000": 130,
      "N/A": 80,
    };

    const employmentPoints =
      employmentPointsMap[employmentInfo] ?? employmentPointsMap.Other;
    const incomePoints = incomePointsMap[incomeRange] ?? 130;

    const purposeLength = loanPurpose ? loanPurpose.trim().length : 0;
    const purposePoints = Math.min(purposeLength, 100);

    let loanCountDeduction = 0;
    if (previousActiveLoans <= 0) loanCountDeduction = 0;
    else if (previousActiveLoans <= 2) loanCountDeduction = 15;
    else if (previousActiveLoans <= 5) loanCountDeduction = 40;
    else if (previousActiveLoans <= 10) loanCountDeduction = 70;
    else loanCountDeduction = 100;

    let score =
      baseScore +
      employmentPoints +
      incomePoints +
      purposePoints -
      loanCountDeduction;

    if (score < 300) score = 300;
    if (score > 900) score = 900;

    return Math.round(score);
  };

  const [formData, setFormData] = useState(initialFormData);
  const [loanTypes, setLoanTypes] = useState([]);

  // Fetch loan types on mount
  useEffect(() => {
    fetch("http://localhost:8081/api/loan-types")
      .then((res) => {
        if (!res.ok) throw new Error("Failed to fetch loan types");
        return res.json();
      })
      .then((data) => {
        const mappedLoanTypes = data.map((lt) => ({
          ...lt,
          loanTypeId: lt.loan_type_id ?? lt.id ?? lt.loanTypeId ?? -1,
          maxLoanAmount: Number(lt.max_loan_amount ?? lt.maxLoanAmount ?? 0),
          maxTenureYears: Number(lt.max_tenure_years ?? lt.maxTenureYears ?? 30),
        }));

        const validLoanTypes = mappedLoanTypes.filter((lt) => lt.loanTypeId !== -1);

        setLoanTypes(validLoanTypes);

        const defaultLoanType = validLoanTypes.find((lt) =>
          lt.name?.toLowerCase().includes("personal")
        );

        setFormData((prev) => ({
          ...prev,
          loanTypeId: defaultLoanType
            ? defaultLoanType.loanTypeId
            : validLoanTypes[0]?.loanTypeId || "",
        }));
      })
      .catch(() => toast.error("Failed to load loan types"));
  }, []);
  
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) return;

    fetch("http://localhost:8081/api/customer/loans/active-count", {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
      .then((res) => {
        if (!res.ok) throw new Error("Failed to fetch active loan count");
        return res.json();
      })
      .then((data) => {
        const count = Number(data.count) || 0;
        setFormData((prev) => ({
          ...prev,
          previousActiveLoans: count,
        }));
      })
      .catch(() => toast.error("Failed to fetch previous active loans"));
  }, []);



  const handleChange = (e) => {
    const { name, value } = e.target;

    if (name === "loanTypeId") {
      setFormData((prev) => ({
        ...prev,
        [name]: Number(value),
        loanAmount: "",
        tenureYears: "",
      }));
      return;
    }

    if (name === "loanAmount") {
      const numericValue = parseCurrency(value);
      const selectedLoanType = loanTypes.find(
        (lt) => lt.loanTypeId === formData.loanTypeId
      );
      const maxLoanAmount = selectedLoanType
        ? selectedLoanType.maxLoanAmount
        : 500000000;

      if (/^\d*$/.test(numericValue)) {
        if (maxLoanAmount !== undefined && Number(numericValue) > maxLoanAmount)
          return; // Block if exceeds max

        setFormData((prev) => ({
          ...prev,
          loanAmount: formatCurrency(value),
        }));
      }
      return;
    }

    if (name === "tenureYears") {
      if (/^\d{0,2}$/.test(value)) {
        const selectedLoanType = loanTypes.find(
          (lt) => lt.loanTypeId === formData.loanTypeId
        );
        const maxTenureYears = selectedLoanType
          ? selectedLoanType.maxTenureYears
          : 30;

        if (Number(value) > maxTenureYears) return; // Block if exceeds max

        setFormData((prev) => ({ ...prev, [name]: value }));
      }
      return;
    }

    if (name === "pan") {
      setFormData((prev) => ({
        ...prev,
        [name]: value.toUpperCase(),
      }));
      return;
    }

    if (name === "aadhaar") {
      if (/^\d{0,12}$/.test(value)) {
        setFormData((prev) => ({ ...prev, [name]: value }));
      }
      return;
    }
    
    if (name === "cibilScore") {
      if (/^\d{0,3}$/.test(value)) {
        setFormData((prev) => ({ ...prev, [name]: value }));
      }
      return;
    }



    if (name === "employmentInfo") {
      if (value === "Student") {
        setFormData((prev) => ({
          ...prev,
          employmentInfo: value,
          income: "N/A",
        }));
      } else {
        setFormData((prev) => ({
          ...prev,
          employmentInfo: value,
          income: "",
        }));
      }
      return;
    }

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const generateCibilScore = () => {
    if (
      !formData.employmentInfo ||
      !formData.income ||
      formData.loanPurpose.length < 3
    ) {
      toast.error(
        "Please fill Employment Info, Income, and Purpose (min 3 chars) before generating CIBIL Score."
      );
      return;
    }
    const score = calculateCibilScore(
      formData.employmentInfo,
      formData.income,
      formData.loanPurpose,
      Number(formData.previousActiveLoans)
    );
    setFormData((prev) => ({ ...prev, cibilScore: score.toString() }));
    toast.success("CIBIL Score generated successfully!");
  };

  const validate = () => {
  let errors = [];

  const selectedLoanType = loanTypes.find(
    (lt) => lt.loanTypeId === formData.loanTypeId
  );
  const maxLoanAmount = selectedLoanType
    ? selectedLoanType.maxLoanAmount
    : Infinity;
  const maxTenureYears = selectedLoanType
    ? selectedLoanType.maxTenureYears
    : 30;

  const numericLoanAmount = parseInt(parseCurrency(formData.loanAmount));

  if (!formData.loanAmount || numericLoanAmount < 500) {
    errors.push("Loan amount must be at least ₹500");
  } else if (numericLoanAmount > maxLoanAmount) {
    errors.push(`Loan amount cannot exceed ₹${maxLoanAmount.toLocaleString()}`);
  }

  if (
    !formData.tenureYears ||
    Number(formData.tenureYears) < 1 ||
    Number(formData.tenureYears) > maxTenureYears
  ) {
    errors.push(`Tenure must be between 1 and ${maxTenureYears} years`);
  }

  const loanPurposeTrimmed = formData.loanPurpose.trim();
  if (loanPurposeTrimmed.length < 3 || loanPurposeTrimmed.length > 100) {
    errors.push("Purpose must be between 3 and 100 characters");
  }

  const htmlTagRegex = /<\/?[^>]+(>|$)/g;
  if (htmlTagRegex.test(loanPurposeTrimmed)) {
    errors.push("Purpose cannot contain HTML tags");
  }

  const employmentInfoTrimmed = formData.employmentInfo.trim();
  if (!employmentInfoTrimmed) {
    errors.push("Please select your Employment Info");
  } else if (!employmentOptions.includes(employmentInfoTrimmed)) {
    errors.push("Invalid Employment Info selection");
  }

  if (employmentInfoTrimmed === "Student") {
    if (formData.income !== "N/A") {
      errors.push("For Students, Monthly Income should be 'N/A'");
    }
  } else {
    if (!incomeRanges.includes(formData.income) || formData.income === "N/A") {
      errors.push("Please select a valid Monthly Income");
    }
  }

  const aadhaarTrimmed = formData.aadhaar.trim();
  if (!/^\d{12}$/.test(aadhaarTrimmed)) {
    errors.push("Aadhaar must be exactly 12 digits");
  }

  const panTrimmed = formData.pan.trim();
  if (!/^[A-Z]{5}[0-9]{4}[A-Z]$/.test(panTrimmed)) {
    errors.push("PAN format is invalid");
  }

  if (formData.previousActiveLoans === "") {
    errors.push("Please enter Previous Active Loans (0 if none)");
  } else if (
    !Number.isInteger(Number(formData.previousActiveLoans)) ||
    Number(formData.previousActiveLoans) < 0 ||
    Number(formData.previousActiveLoans) > 100
  ) {
    errors.push("Previous loans must be a non-negative integer (max 100)");
  }

  if (!formData.cibilScore) {
    errors.push("CIBIL Score is required");
  } else if (
    !Number.isInteger(Number(formData.cibilScore)) ||
    Number(formData.cibilScore) < 300 ||
    Number(formData.cibilScore) > 900
  ) {
    errors.push("CIBIL Score must be an integer between 300 and 900");
  }

  if (errors.length === 0) {
    return true; // no errors
  } else if (errors.length > 3) {
    toast.error("Please fill all the required form details.");
    return false;
  } else {
    // show individual errors if 3 or less
    errors.forEach((err) => toast.error(err));
    return false;
  }
};


  const handleSubmit = (e) => {
    e.preventDefault();
    if (!validate()) return;

    const numericLoanAmount = parseInt(parseCurrency(formData.loanAmount));

    const payload = {
      loanTypeId: Number(formData.loanTypeId),
      loanAmount: numericLoanAmount,
      loanDuration: Number(formData.tenureYears),
      loanPurpose: formData.loanPurpose.trim(),
      income: formData.income,
      employmentInfo: formData.employmentInfo.trim(),
      aadhaar: formData.aadhaar.trim(),
      pan: formData.pan.trim(),
      previousActiveLoans: Number(formData.previousActiveLoans),
      cibilScore: Number(formData.cibilScore),
    };

    const token = localStorage.getItem("token");
    fetch("http://localhost:8081/api/customer/loans", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(payload),
    })
      .then(async (res) => {
        if (!res.ok) {
          const errorText = await res.text();
          throw new Error(`Failed to apply loan: ${res.status} ${errorText}`);
        }
        toast.success("Loan application submitted successfully!");
        setFormData(initialFormData);
      })
      .catch((err) => toast.error(err.message));
  };
  const formatCurrencyDisplay = (value) => {
    if (value === undefined || value === null) return "N/A";
    // If value is a string, convert to Number first
    const num = typeof value === "string" ? Number(value) : value;
    if (isNaN(num)) return "N/A";
    return num.toLocaleString("en-IN", {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    });
  };


  return (
    <>
      <ToastContainer
        position="top-center"
        autoClose={3000}
        pauseOnHover={true}
        pauseOnFocusLoss={false}
      />

      <form className="apply-loan-form" onSubmit={handleSubmit} noValidate>
        <h2>Apply For Loan</h2>

        <div className="left-column">
          <div className="form-group">
            <label htmlFor="loanTypeId">Loan Type</label>
            <select
              id="loanTypeId"
              name="loanTypeId"
              value={
                formData.loanTypeId !== undefined && formData.loanTypeId !== null
                  ? formData.loanTypeId.toString()
                  : ""
              }
              onChange={handleChange}
              required
            >
              <option value="">Select Loan Type</option>
              {loanTypes.map((type, index) => {
                const value =
                  type.loanTypeId !== undefined && type.loanTypeId !== null
                    ? type.loanTypeId.toString()
                    : `unknown-${index}`;
                return (
                  <option key={value} value={value}>
                    {type.name} - {type.interestRate?.toFixed(2)}%
                  </option>

                );
              })}
            </select>
          </div>

          <div className="form-group">
            <label htmlFor="loanAmount">Loan Amount (₹)</label>
            <input
              type="text"
              id="loanAmount"
              name="loanAmount"
              placeholder="Enter loan amount"
              value={formData.loanAmount}
              onChange={handleChange}
              required
            />
            <small>
              Max allowed amount: ₹
              {formatCurrencyDisplay(
                loanTypes.find((lt) => lt.loanTypeId === formData.loanTypeId)
                  ?.maxLoanAmount
              )}
            </small>

          </div>

          

          <div className="form-group">
            <label htmlFor="loanPurpose">Purpose</label>
            <input
              type="text"
              id="loanPurpose"
              name="loanPurpose"
              placeholder="Describe the purpose of the loan"
              value={formData.loanPurpose}
              onChange={handleChange}
              maxLength={100}
              required
            />
          </div>
          <div className="form-group">
            <label htmlFor="pan">PAN Number</label>
            <input
              type="text"
              id="pan"
              name="pan"
              placeholder="Enter your PAN number"
              value={formData.pan}
              onChange={handleChange}
              maxLength="10"
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="previousActiveLoans">Previous Active Loans</label>
            <input
              type="number"
              id="previousActiveLoans"
              name="previousActiveLoans"
              value={formData.previousActiveLoans}
              readOnly
              disabled
            />

          </div>
        </div>

        <div className="right-column">
          <div className="form-group">
            <label htmlFor="employmentInfo">Employment Info</label>
            <select
              id="employmentInfo"
              name="employmentInfo"
              value={formData.employmentInfo}
              onChange={handleChange}
              required
            >
              <option value="">Select Employment Info</option>
              {employmentOptions.map((option) => (
                <option key={option} value={option}>
                  {option}
                </option>
              ))}
            </select>
          </div>
          
          <div className="form-group">
            <label htmlFor="tenureYears">Loan Tenure (Years)</label>
            <input
              type="number"
              id="tenureYears"
              name="tenureYears"
              placeholder="Enter tenure in years"
              value={formData.tenureYears}
              onChange={handleChange}
              min="1"
              max={
                loanTypes.find((lt) => lt.loanTypeId === formData.loanTypeId)
                  ?.maxTenureYears || 30
              }
              required
            />
            <small>
              Max allowed tenure:{" "}
              {loanTypes.find((lt) => lt.loanTypeId === formData.loanTypeId)
                ?.maxTenureYears ?? 30}{" "}
              years
            </small>

          </div>

          <div className="form-group">
            <label htmlFor="income">Monthly Income</label>
            <select
              id="income"
              name="income"
              value={formData.income}
              onChange={handleChange}
              required
              disabled={formData.employmentInfo === "Student"}
            >
              <option value="">Select Monthly Income</option>
              {incomeRanges.map((option) => (
                <option key={option} value={option}>
                  {option}
                </option>
              ))}
            </select>
            
          </div>

          <div className="form-group">
            <label htmlFor="aadhaar">Aadhaar Number</label>
            <input
              type="text"
              id="aadhaar"
              name="aadhaar"
              placeholder="Enter 12-digit Aadhaar number"
              value={formData.aadhaar}
              onChange={handleChange}
              maxLength="12"
              inputMode="numeric"
              required
            />
          </div>

          

          <div className="form-group">
            <label
              htmlFor="cibilScore"
              style={{ flex: "1", marginRight: "8px" }}
            >
              CIBIL Score
            </label>

            <div className="cibil-score">
              <input
                type="number"
                id="cibilScore"
                name="cibilScore"
                value={formData.cibilScore}
                readOnly
                placeholder="Auto-calculated"
                style={{ flex: "1", marginRight: "8px" }}
                required
              />
              <button type="button" className="generate-btn" onClick={generateCibilScore}>
                Generate
              </button>
            </div>
          </div>
        </div>

        <div className="form-button-group">
          <button type="submit" className="btn-submit">
            Submit Application
          </button>
          <button
            type="button"
            className="btn-reset"
            onClick={() => setFormData(initialFormData)}
          >
            Reset Form
          </button>
        </div>
      </form>
    </>
  );
}

export default ApplyLoanForm;
