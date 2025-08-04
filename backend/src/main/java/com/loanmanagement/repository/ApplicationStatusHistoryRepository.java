package com.loanmanagement.repository;

import com.loanmanagement.model.ApplicationStatusHistory;
import com.loanmanagement.model.Loan;
import org.springframework.data.jpa.repository.JpaRepository;

public interface ApplicationStatusHistoryRepository extends JpaRepository<ApplicationStatusHistory, Long> {
    
    void deleteAllByLoan(Loan loan);
    
}
