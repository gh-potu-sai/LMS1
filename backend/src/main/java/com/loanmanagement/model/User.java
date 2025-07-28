// Entity: Represents the `users` table in the database

package com.loanmanagement.model;

import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDateTime;

// Lombok Annotations
@Data                         // Generates getters, setters, toString, equals, hashCode
@NoArgsConstructor            // Generates no-arg constructor
@AllArgsConstructor           // Generates all-arg constructor
@Builder                      // Enables builder pattern for this class

@Entity                       // Marks this class as a JPA entity
@Table(                      
    name = "users",           // Maps to 'users' table
    uniqueConstraints = @UniqueConstraint(columnNames = "email") // Enforces email uniqueness at DB level
)
public class User {

    // Primary Key: Auto-incremented ID
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long userId;

    // Username (must be unique and non-null)
    @Column(nullable = false, unique = true)
    private String username;

    // User's full name
    private String name;

    // Email (must be unique and non-null)
    @Column(nullable = false, unique = true)
    private String email;

    // Hashed password
    private String password;

    // Role: ADMIN or CUSTOMER
    @Enumerated(EnumType.STRING)
    private Role role;

    // Account creation timestamp
    private LocalDateTime createdAt;

    // Enum for user roles
    public enum Role {
        ADMIN,
        CUSTOMER
    }
}
