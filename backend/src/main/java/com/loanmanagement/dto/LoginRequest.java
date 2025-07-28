// DTO: Represents login input sent from the frontend (username + password)

package com.loanmanagement.dto;

// --- Imports ---
import lombok.Data;  // Lombok generates getters, setters, toString, equals, and hashCode


@Data  // Automatically generates getter/setter and other utility methods
public class LoginRequest {

    private String username;  // The username entered by the user
    private String password;  // The password entered by the user
}
