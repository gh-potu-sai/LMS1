package com.loanmanagement.model;

import jakarta.persistence.*;
import jakarta.validation.constraints.*;
import lombok.*;
import java.math.BigDecimal;

@Entity
@Table(name = "loan_types")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class LoanType {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long loanTypeId;

    @NotBlank(message = "Loan type name is required")
    @Size(max = 100, message = "Loan type name cannot exceed 100 characters")
    private String name;

    @DecimalMin(value = "0.0", inclusive = false, message = "Interest rate must be positive")
    @DecimalMax(value = "100.0", message = "Interest rate cannot exceed 100 percent")
    @Digits(integer = 3, fraction = 2, message = "Interest rate format invalid")
    @Column(precision = 5, scale = 2)
    private BigDecimal interestRate;

    @NotBlank(message = "Requirements are required")
    @Size(max = 200, message = "Requirements cannot exceed 200 characters")
    private String requirements;

    @Min(value = 1, message = "Maximum tenure years must be at least 1")
    @Max(value = 30, message = "Maximum tenure years cannot exceed 30")
    private int maxTenureYears;

    @DecimalMin(value = "0.0", inclusive = false, message = "Maximum loan amount must be positive")
    @DecimalMax(value = "1000000000.00", message = "Maximum loan amount must not exceed ₹100 Cr")
    @Column(precision = 15, scale = 2)
    private BigDecimal maxLoanAmount;


    @DecimalMin(value = "0.0", message = "Penalty rate cannot be negative")
    @DecimalMax(value = "100.0", message = "Penalty rate cannot exceed 100 percent")
    @Column(precision = 5, scale = 2)
    private BigDecimal penaltyRatePercent;
}
