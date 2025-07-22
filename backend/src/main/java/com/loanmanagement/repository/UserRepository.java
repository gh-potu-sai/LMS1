package com.loanmanagement.repository;

// Imports the User entity for database operations
import com.loanmanagement.model.User;

// Spring Data JPA interface providing CRUD methods
import org.springframework.data.jpa.repository.JpaRepository;

// Repository interface for User entity with Long as ID type
public interface UserRepository extends JpaRepository<User, Long> {

    // Checks if a user with the given email already exists
    boolean existsByEmail(String email);

    // Retrieves a user by their email address
    User findByEmail(String email);
}
