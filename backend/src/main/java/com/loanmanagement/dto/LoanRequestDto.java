package com.loanmanagement.dto;

import lombok.Data;

@Data
public class LoanRequestDto {

    private Long loanTypeId;

    private java.math.BigDecimal loanAmount;

    private int loanDuration;

    private String loanPurpose;

    private String income;

    private String employmentInfo;

    private String aadhaar;

    private String pan;

    private int previousActiveLoans;

    private int cibilScore;
}
