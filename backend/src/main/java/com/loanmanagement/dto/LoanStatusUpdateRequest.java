package com.loanmanagement.dto;

import com.loanmanagement.model.Loan;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class LoanStatusUpdateRequest {
    
    @NotNull
    private Loan.LoanStatus status;

    @Size(max = 500)
    private String comments;
}

