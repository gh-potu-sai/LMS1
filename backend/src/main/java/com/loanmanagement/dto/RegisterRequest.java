// DTO: Used to capture registration input from the frontend

package com.loanmanagement.dto;

import com.loanmanagement.model.User.Role;
import lombok.Data;

@Data  // Lombok generates getters, setters, toString, equals, and hashCode
public class RegisterRequest {

    private String username;     // Username chosen by the user
    private String name;         // Full name of the user
    private String email;        // Email ID
    private String password;     // Plain-text password to be encrypted in service layer
    private Role role;           // Role: USER or ADMIN

    // 🔐 Only required when role is ADMIN (for admin key validation)
    private String adminKey;
}
