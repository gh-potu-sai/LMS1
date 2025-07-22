package com.loanmanagement.model;

// Enables ORM annotations like @Entity, @Id, @ManyToOne, etc.
import jakarta.persistence.*;

// Lombok for generating boilerplate code
import lombok.*;

import java.time.LocalDateTime;

@Entity                                    // Marks this class as a JPA entity for DB mapping
@Table(name = "application_status_history") // Maps this entity to the "application_status_history" table
@Data                                     // Generates getters, setters, toString, equals, and hashCode
@NoArgsConstructor                        // Generates a no-argument constructor
@AllArgsConstructor                       // Generates a constructor with all fields
@Builder                                  // Enables object creation using builder pattern
public class ApplicationStatusHistory {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY) // Auto-increment ID
    private Long id;

    @ManyToOne                             // Many status updates are linked to one loan
    private Loan loan;

    @Enumerated(EnumType.STRING)          // Store LoanStatus as string in DB
    private LoanStatus status;            // Status of the loan at this history point

    private String comments;              // Optional comments for the status update
    private LocalDateTime updatedAt;      // Timestamp of when the status was updated

    // Enum for loan application status tracking
    public enum LoanStatus {
        SUBMITTED,   // Application has been submitted
        APPROVED,    // Application has been approved
        REJECTED,    // Application has been rejected
        CLOSED       // Loan has been closed
    }
}
