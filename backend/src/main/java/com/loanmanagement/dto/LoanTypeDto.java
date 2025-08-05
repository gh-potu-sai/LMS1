package com.loanmanagement.dto;

import lombok.*;
import java.math.BigDecimal;

import jakarta.validation.constraints.DecimalMax;
import jakarta.validation.constraints.DecimalMin;

@Data
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class LoanTypeDto {
    private Long loanTypeId;
    private String name;

    private int maxTenureYears;
    private BigDecimal maxLoanAmount;
    
    @DecimalMin(value = "0.0", inclusive = false, message = "Interest rate must be positive")
    @DecimalMax(value = "15.0", message = "Interest rate cannot exceed 15 percent")
    private BigDecimal interestRate;

    @DecimalMin(value = "0.0", message = "Penalty rate cannot be negative")
    @DecimalMax(value = "5.0", message = "Penalty rate cannot exceed 5 percent")
    private BigDecimal penaltyRatePercent;

    // ✅ New field added
    private int maxLoansPerCustomerPerLoanType;
}
