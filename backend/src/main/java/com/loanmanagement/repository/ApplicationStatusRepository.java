package com.loanmanagement.repository;

// Imports the ApplicationStatusHistory entity for database operations
import com.loanmanagement.model.ApplicationStatusHistory;

// Spring Data JPA interface providing CRUD methods
import org.springframework.data.jpa.repository.JpaRepository;

// Repository interface for ApplicationStatusHistory entity with Long as ID type
public interface ApplicationStatusRepository extends JpaRepository<ApplicationStatusHistory, Long> {
    // No custom methods needed yet — inherits basic CRUD methods from JpaRepository
}
