package com.loanmanagement.repository;

import com.loanmanagement.model.ApplicationStatusHistory;
import org.springframework.data.jpa.repository.JpaRepository;

public interface ApplicationStatusHistoryRepository extends JpaRepository<ApplicationStatusHistory, Long> {
    // No custom methods needed yet
}
