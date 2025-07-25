package com.loanmanagement.repository;

import java.util.Optional;

import com.loanmanagement.model.User;
import org.springframework.data.jpa.repository.JpaRepository;

public interface UserRepository extends JpaRepository<User, Long> {

    // ✅ Checks if a user with the given email already exists
    boolean existsByEmail(String email);

    // ✅ Checks if a user with the given username already exists
    boolean existsByUsername(String username);

    // ✅ Retrieves a user by their email address
    Optional<User> findByEmail(String email);

    // ✅ Retrieves a user by their username (for login)
    Optional<User> findByUsername(String username);
}
