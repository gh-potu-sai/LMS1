package com.loanmanagement.repository;

// Imports the EmiPayment entity for database operations
import com.loanmanagement.model.EmiPayment;

// Spring Data JPA interface providing CRUD methods
import org.springframework.data.jpa.repository.JpaRepository;

// Repository interface for EmiPayment entity with Long as ID type
public interface EmiPaymentRepository extends JpaRepository<EmiPayment, Long> {
    // No custom methods needed yet — inherits basic CRUD methods from JpaRepository
}
