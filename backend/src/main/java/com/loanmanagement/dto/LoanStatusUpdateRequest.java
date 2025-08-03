package com.loanmanagement.dto;

import lombok.*;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class LoanStatusUpdateRequest {
    private String status;  // APPROVED / REJECTED
    private String comments;  // Optional comment from admin
}
