package com.loanmanagement.repository;

import com.loanmanagement.model.Loan;
import com.loanmanagement.model.User;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface LoanRepository extends JpaRepository<Loan, Long> {

    // 🔍 Find all loans belonging to a particular customer
    List<Loan> findByCustomer(User customer);
}
