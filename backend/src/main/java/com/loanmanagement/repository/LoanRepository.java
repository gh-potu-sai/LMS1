package com.loanmanagement.repository;

// Imports the Loan entity for database operations
import com.loanmanagement.model.Loan;

// Spring Data JPA interface providing CRUD methods
import org.springframework.data.jpa.repository.JpaRepository;

// Repository interface for Loan entity with Long as ID type
public interface LoanRepository extends JpaRepository<Loan, Long> {
    // No custom methods needed yet — inherits basic CRUD methods from JpaRepository
}
