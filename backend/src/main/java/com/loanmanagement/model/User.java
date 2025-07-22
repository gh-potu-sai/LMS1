package com.loanmanagement.model;

// JPA annotations for mapping Java classes to database tables
import jakarta.persistence.*;

// Lombok annotations to reduce boilerplate code
import lombok.*;

import java.time.LocalDateTime;

@Entity                            // Marks this class as a JPA entity
@Table(name = "users")            // Maps this entity to the "users" table
@Data                             // Generates getters, setters, toString, equals, and hashCode
@NoArgsConstructor                // Generates a no-argument constructor
@AllArgsConstructor               // Generates a constructor with all fields
@Builder                          // Enables object creation using builder pattern
public class User {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY) // Auto-generates primary key (auto-increment)
    private Long userId;

    private String name;           // User's full name
    private String email;          // User's email address
    private String password;       // Encrypted user password

    @Enumerated(EnumType.STRING)  // Stores enum as string in DB (e.g., "ADMIN")
    private Role role;

    private LocalDateTime createdAt; // Timestamp of user creation

    // Enum for defining user roles in the system
    public enum Role {
        ADMIN,     // Has full access to manage users, loans, and settings
        CUSTOMER   // Can apply for loans and view their own details
    }
}
