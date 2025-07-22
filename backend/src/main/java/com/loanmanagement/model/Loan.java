package com.loanmanagement.model;

// Enables ORM annotations like @Entity, @Id, @ManyToOne, etc.
import jakarta.persistence.*;

// Lombok for generating boilerplate code
import lombok.*;

import java.time.LocalDateTime;

@Entity                              // Marks this class as a JPA entity for DB mapping
@Table(name = "loans")              // Maps this entity to the "loans" table
@Data                               // Generates getters, setters, toString, equals, and hashCode
@NoArgsConstructor                  // Generates a no-argument constructor
@AllArgsConstructor                 // Generates a constructor with all fields
@Builder                            // Enables object creation using builder pattern
public class Loan {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY) // Auto-increment ID
    private Long id;

    @ManyToOne                         // Many loans can be associated with one user
    private User user;

    @ManyToOne                         // Many loans can belong to the same loan type
    private LoanType loanType;

    private double amount;            // Requested loan amount
    private String purpose;           // Purpose of the loan (e.g., education, house)
    private double income;            // Applicant's income
    private String employmentInfo;    // Job or employment details
    private String aadhaar;           // Aadhaar number of the applicant
    private String pan;               // PAN card number of the applicant
    private int previousActiveLoans;  // Number of previous active loans
    private int cibilScore;           // Credit score of the applicant (backend-generated)
    private int tenureMonths;         // Requested tenure for loan repayment


    private LocalDateTime submittedAt; // Date when the loan was applied
    private LocalDateTime closedAt;    // Date when the loan was closed (if any)


}
