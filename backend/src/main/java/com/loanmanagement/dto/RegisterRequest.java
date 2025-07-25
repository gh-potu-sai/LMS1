package com.loanmanagement.dto;

import com.loanmanagement.model.User.Role;
import lombok.Data;

@Data
public class RegisterRequest {
    private String username;
    private String name;
    private String email;
    private String password;
    private Role role;  // Must match Enum defined in User model
}
