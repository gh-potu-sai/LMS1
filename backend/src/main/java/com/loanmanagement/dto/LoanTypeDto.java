package com.loanmanagement.dto;

import lombok.*;
import java.math.BigDecimal;

@Data
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class LoanTypeDto {
    private Long loanTypeId;
    private String name;
    private BigDecimal interestRate;
    private String requirements;
    private int maxTenureYears;
    private BigDecimal maxLoanAmount;
    private BigDecimal penaltyRatePercent;
}
