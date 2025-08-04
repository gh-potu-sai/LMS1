package com.loanmanagement.model;

import jakarta.persistence.*;
import lombok.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "application_status_history")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class ApplicationStatusHistory {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "loan_id", nullable = false)
    private Loan loan;


    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private Loan.LoanStatus status;  // ✅ now matches Loan.java enum

    @Column(length = 500)
    private String comments;

    @Column(name = "updated_at", nullable = false)
    private LocalDateTime updatedAt;
}
