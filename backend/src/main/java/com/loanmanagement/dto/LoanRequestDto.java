package com.loanmanagement.dto;

import lombok.Data;
import java.math.BigDecimal;

@Data
public class LoanRequestDto {

    private Long loanTypeId;

    private BigDecimal loanAmount;

    private int loanDuration;

    private String loanPurpose;

    private String income;

    private String employmentInfo;

    private String aadhaar;

    private String pan;

    private int cibilScore;
}
