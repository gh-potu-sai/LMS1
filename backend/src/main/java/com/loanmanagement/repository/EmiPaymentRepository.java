package com.loanmanagement.repository;

import com.loanmanagement.model.EmiPayment;
import com.loanmanagement.model.Loan;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface EmiPaymentRepository extends JpaRepository<EmiPayment, Long> {

    // ✅ Custom method to delete all EMI payments for a given loan
    void deleteAllByLoan(Loan loan);

    // (Optional) Get all EMI payments for a loan, ordered by payment date
    List<EmiPayment> findByLoanOrderByPaymentDateAsc(Loan loan);
}
