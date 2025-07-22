package com.loanmanagement.model;

// Enables ORM annotations like @Entity, @Id, @Table, etc.
import jakarta.persistence.*;

// Lombok for generating boilerplate code (getters, setters, etc.)
import lombok.*;

@Entity // Marks this class as a JPA entity for DB mapping
@Table(name = "loan_types") // Maps this entity to the "loan_types" table
@Data // Generates getters, setters, toString, equals, and hashCode
@NoArgsConstructor // Generates a no-argument constructor
@AllArgsConstructor // Generates a constructor with all fields
@Builder // Enables object creation using builder pattern
public class LoanType {

    @Id // Declares this field as the primary key
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    // Auto-generates loanTypeId using DB's auto-increment
    private Long loanTypeId;

    private String name; // Name of the loan type (e.g., Home Loan, Personal Loan)
    private double interestRate; // Interest rate applicable to this loan type
    private String requirements; // Eligibility or required documents
    private int maxTenureMonths; // Maximum allowed loan tenure in months
    private double maxLoanAmount; // Maximum loan amount allowed
    private double penaltyRatePercent; // Penalty rate (%) for late payments
}
