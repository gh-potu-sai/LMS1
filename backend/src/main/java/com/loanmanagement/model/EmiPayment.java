package com.loanmanagement.model;

// Enables ORM annotations like @Entity, @Id, @ManyToOne, etc.
import jakarta.persistence.*;

// Lombok for generating boilerplate code
import lombok.*;

import java.time.LocalDate;

@Entity                               // Marks this class as a JPA entity for DB mapping
@Table(name = "emi_payment")         // Maps this entity to the "emi_payment" table
@Data                                // Generates getters, setters, toString, equals, and hashCode
@NoArgsConstructor                   // Generates a no-argument constructor
@AllArgsConstructor                  // Generates a constructor with all fields
@Builder                             // Enables object creation using builder pattern
public class EmiPayment {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY) // Auto-increment ID
    private Long id;

    @ManyToOne                         // Many EMI payments are linked to one loan
    private Loan loan;

    private double amount;             // EMI amount to be paid
    private LocalDate dueDate;         // Due date for the EMI

    @Enumerated(EnumType.STRING)      // Stores EMI status as string in DB
    private EmiStatus status;          // Status of the EMI (PENDING, PAID, LATE)

    private LocalDate paymentDate;     // Actual payment date (null if unpaid)
    private String transactionRef;     // Reference ID for the payment transaction

    // Enum for EMI payment status
    public enum EmiStatus {
        PENDING,  // Payment is due
        PAID,     // Payment is completed
        LATE      // Payment is overdue
    }
}
