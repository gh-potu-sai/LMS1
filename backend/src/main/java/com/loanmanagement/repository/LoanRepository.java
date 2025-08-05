package com.loanmanagement.repository;

import com.loanmanagement.model.Loan;
import com.loanmanagement.model.User;
import com.loanmanagement.model.Loan.LoanStatus;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface LoanRepository extends JpaRepository<Loan, Long> {

    // 🔍 Find all loans belonging to a particular customer
    List<Loan> findByCustomer(User customer);

    // ✅ Count only approved loans for a customer
    int countByCustomerAndLoanStatus(User customer, LoanStatus status);

    // ✅ NEW: Count active loans grouped by type (for apply rule enforcement)
    List<Loan> findByCustomerAndLoanStatusIn(User customer, List<LoanStatus> statuses);
}
