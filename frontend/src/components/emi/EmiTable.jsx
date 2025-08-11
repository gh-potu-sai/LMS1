import { useEffect, useMemo, useRef, useState } from "react";

import { generateEmiReceiptPDF, generateLoanNocPDF } from "../../utils/pdfTemplates";

import "../../styles/emi/EmiTable.css";


function formatMoney(n) {
  if (n == null || Number.isNaN(Number(n))) return "-";
  return new Intl.NumberFormat("en-IN", { maximumFractionDigits: 2 }).format(Number(n));
}
const fmtDate = (d) => (d ? new Date(d).toLocaleDateString("en-IN") : "-");
const loanRef = (id) => `ln${String(id).padStart(3, "0")}`;

export default function EmiTable({
  loan,
  pack,
  onPay,
  rowStatusFilter = "ALL",
  rowDueFrom = "",
  rowDueTo = "",
}) {
  const [showAll, setShowAll] = useState(false);
  const [payingId, setPayingId] = useState(null);

  const scrollBodyRef = useRef(null);
  const firstPendingRef = useRef(null);

  const emis = useMemo(() => pack?.emis ?? [], [pack?.emis]);

  // summary pieces
  const paidCount = useMemo(
    () => emis.filter((e) => e.status === "PAID").length,
    [emis]
  );

  const lastPaid = useMemo(() => {
    const paid = emis
      .filter((e) => e.status === "PAID")
      .sort((a, b) => (a.paymentDate || "").localeCompare(b.paymentDate || ""));
    return paid.length ? paid[paid.length - 1].paymentDate : null;
  }, [emis]);

  const totalPayable = useMemo(
    () => emis.reduce((sum, e) => sum + Number(e.amount || 0), 0),
    [emis]
  );
  const principal = Number(pack?.amount || loan.amount || 0);
  const interestAmount = Math.max(0, totalPayable - principal);
  const remainingAfterPaid = Number(pack?.remainingAmount || 0);

  // Consider cleared if remaining ≈ 0 & all EMIs are PAID, or backend already set CLOSED
  const isCleared = useMemo(() => {
    const noBalance = remainingAfterPaid <= 0.000001;
    const allPaid = emis.length > 0 && paidCount === emis.length;
    return (noBalance && allPaid) || loan?.loanStatus === "CLOSED";
  }, [remainingAfterPaid, paidCount, emis.length, loan?.loanStatus]);

  // Filtering
  const filteredRows = useMemo(() => {
    let rows = emis;
    if (rowStatusFilter !== "ALL") {
      rows = rows.filter((row) => row.status === rowStatusFilter);
    }
    if (rowDueFrom) {
      const from = new Date(rowDueFrom);
      rows = rows.filter((row) =>
        row.dueDate ? new Date(row.dueDate) >= from : true
      );
    }
    if (rowDueTo) {
      const to = new Date(rowDueTo);
      rows = rows.filter((row) =>
        row.dueDate ? new Date(row.dueDate) <= to : true
      );
    }
    return rows;
  }, [emis, rowStatusFilter, rowDueFrom, rowDueTo]);

  // First unpaid index within filteredRows
  const firstPendingIndex = useMemo(() => {
    const idx = filteredRows.findIndex((r) => r.status !== "PAID");
    return idx === -1 ? 0 : idx;
  }, [filteredRows]);

  // When showAll=false, show a small window around the next unpaid row
  const startIndex = useMemo(
    () => (showAll ? 0 : Math.max(0, firstPendingIndex - 1)),
    [showAll, firstPendingIndex]
  );
  const endIndex = useMemo(
    () => (showAll ? filteredRows.length : Math.min(filteredRows.length, startIndex + 3)),
    [showAll, filteredRows.length, startIndex]
  );

  const visible = useMemo(
    () => filteredRows.slice(startIndex, endIndex),
    [filteredRows, startIndex, endIndex]
  );

  // Auto-scroll to first unpaid when "Show All" opens
  useEffect(() => {
    if (showAll && firstPendingRef.current && scrollBodyRef.current) {
      firstPendingRef.current.scrollIntoView({ behavior: "smooth", block: "center" });
    }
  }, [showAll, filteredRows]);

  const handlePayClick = async (row) => {
    try {
      setPayingId(row.id);
      await onPay(row, loan.id);
    } finally {
      setPayingId(null);
    }
  };

  const handleDownloadReceipt = (emiRow) => {
    generateEmiReceiptPDF(emiRow, loan, pack);
  };

  const handleDownloadNoc = () => {
    generateLoanNocPDF(loan, pack, emis);
  };

  const appliedOn = loan?.submittedAt
    ? new Date(loan.submittedAt).toLocaleDateString("en-IN")
    : "-";

  return (
    <div className="emi-card">
      {/* ===== Loan Summary ===== */}
      <div className="emi-summary">
        <h3 className="emi-loan-title">
          {loan.loanType?.name || loan.loanType}
          {isCleared && <span className="loan-cleared-badge">Loan Cleared</span>}
          {isCleared && (
            <button className="pay-btn noc-btn" onClick={handleDownloadNoc}>
              Download NOC
            </button>
          )}
        </h3>

        <div className="emi-summary-compact">
          <div>Loan ID: {loanRef(loan.id)}</div>
          <div>
            Tenure &amp; Interest:&nbsp;
            {(pack?.tenureYears ?? loan.tenureYears) ?? "N/A"} yr - {(pack?.appliedInterestRate ?? loan.appliedInterestRate) ?? "N/A"}%
          </div>
          <div>Amount: ₹{formatMoney(principal)}</div>
          <div>Total Payable: ₹{formatMoney(totalPayable)}</div>
          <div>Applied on: {appliedOn}</div>
          <div>Last Paid: {fmtDate(lastPaid)}</div>
          <div>Interest: ₹{formatMoney(interestAmount)}</div>
          <div>
            Remaining: ₹{formatMoney(remainingAfterPaid)}
          </div>
        </div>
      </div>

      {/* ===== EMI Table ===== */}
      {/* ===== EMI Table ===== */}
      {loan?.loanStatus !== "REJECTED" && (
        <div className="emi-table-wrapper">
          <div className="emi-scroll-body" ref={scrollBodyRef}>
            <table className="emi-table">
              <thead>
                <tr>
                  <th>EMI_no</th>
                  <th>EMI_id</th>
                  <th>EMI Amt (₹)</th>
                  <th>Due Date</th>
                  <th>
                    Status{" "}
                    <span className="paid-inline-th">
                      (Paid: {paidCount}/{emis.length})
                    </span>
                  </th>
                  <th>Payment Date</th>
                  <th>Transaction Reference Id</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                {visible.map((e, idx) => {
                  const realIndex = startIndex + idx;
                  const isFirstPending = realIndex === firstPendingIndex;
                  return (
                    <tr key={e.id} ref={isFirstPending ? firstPendingRef : null}>
                      <td>{realIndex + 1}</td>
                      <td>{e.id}</td>
                      <td>{formatMoney(e.amount)}</td>
                      <td>{fmtDate(e.dueDate)}</td>
                      <td className="status-cell">
                        <span className={`badge ${e.status.toLowerCase()}`}>
                          {e.status}
                        </span>
                      </td>
                      <td>{fmtDate(e.paymentDate)}</td>
                      <td className="txn">{e.transactionRef || "-"}</td>
                      <td>
                        {e.status === "PENDING" ? (
                          <button
                            className={`pay-btn ${
                              payingId === e.id ? "disabled" : ""
                            }`}
                            onClick={() => handlePayClick(e)}
                            disabled={payingId === e.id}
                          >
                            {payingId === e.id ? "Paying…" : "Pay"}
                          </button>
                        ) : (
                          <button
                            className="pay-btn"
                            onClick={() => handleDownloadReceipt(e)}
                          >
                            Download receipt
                          </button>
                        )}
                      </td>
                    </tr>
                  );
                })}
                {visible.length === 0 && (
                  <tr>
                    <td colSpan={8} className="empty">No EMIs found.</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {loan?.loanStatus === "REJECTED" && (
        <div className="empty" style={{ padding: "15px", textAlign: "center" }}>
          Loan is rejected — no EMI schedule available.
        </div>
      )}


      {filteredRows.length > 3 && (
        <div className="emi-more">
          <button className="toggle-btn" onClick={() => setShowAll((s) => !s)}>
            {showAll ? "Show Less" : "Show All"}
          </button>
        </div>
      )}
    </div>
  );
}
