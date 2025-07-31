package com.loanmanagement.dto;

import lombok.Data;

// ✅ DTO to carry forgot password data from frontend to backend
@Data
public class UpdatePasswordRequest {
    private String username;
    private String newPassword;
    private String confirmPassword;
}
