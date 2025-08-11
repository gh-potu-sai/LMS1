package com.loanmanagement.dto;

import com.loanmanagement.model.EmiPayment;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.util.List;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class LoanWithEmiDto {
    private Long loanId;
    private BigDecimal amount;          // principal
    private double appliedInterestRate;
    private int tenureYears;
    private int remainingEmis;
    private BigDecimal remainingAmount; // <- BigDecimal now
    private List<EmiPayment> emis;
}
