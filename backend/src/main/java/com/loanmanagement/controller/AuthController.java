// Controller to handle user authentication (login, register, get user info)

package com.loanmanagement.controller;

// --- Imports from project modules ---
import com.loanmanagement.config.JwtUtil;                       // Utility for JWT token operations
import com.loanmanagement.dto.AuthResponse;                     // DTO for login response (token + role)
import com.loanmanagement.dto.LoginRequest;                     // DTO for login request
import com.loanmanagement.dto.RegisterRequest;                  // DTO for registration request
import com.loanmanagement.model.User;                           // User model
import com.loanmanagement.service.AuthService;                  // Service class for business logic

// --- Spring and utility imports ---
import lombok.RequiredArgsConstructor;                          // Lombok annotation to auto-generate constructor
import org.springframework.http.*;                              // Spring HTTP classes for responses
import org.springframework.web.bind.annotation.*;               // Spring MVC REST controller annotations
import java.util.Map;                                           // Utility to return key-value pairs in response

@CrossOrigin(origins = "http://localhost:3000")                 // Allow frontend (localhost:3000) to access these endpoints
@RestController                                                 // Mark this class as a REST controller
@RequestMapping("/api/auth")                                    // Base path for all authentication routes
@RequiredArgsConstructor                                        // Lombok generates constructor for final fields
public class AuthController {

    private final AuthService authService;                      // Injected service to handle authentication logic
    private final JwtUtil jwtUtil;                              // Injected utility to handle JWT token parsing/validation

    // GET /api/auth/me
    // Returns the current user's details based on JWT
    @GetMapping("/me")
    public ResponseEntity<?> getUserDetails(@RequestHeader("Authorization") String authHeader) {
        String token = authHeader.replace("Bearer ", "");       // Remove Bearer prefix from token

        if (!jwtUtil.isTokenValid(token)) {                     // Validate the token
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                                 .body(Map.of("message", "Invalid token"));
        }

        String username = jwtUtil.extractUsername(token);       // Extract username from token
        User user = authService.getUserByUsername(username);    // Fetch user from DB using username

        return ResponseEntity.ok(user);                         // Return user details
    }

    // POST /api/auth/register
    // Registers a new user (with optional admin key validation)
    @PostMapping("/register")
    public ResponseEntity<?> register(@RequestBody RegisterRequest request) {
        try {
            authService.register(request);                      // Call service to register user
            return ResponseEntity.ok(Map.of("message", "User registered successfully!"));
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(Map.of("message", e.getMessage()));
        }
    }

    // POST /api/auth/login
    // Authenticates the user and returns JWT + role
    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody LoginRequest request) {
        try {
            System.out.println("📲 Login API hit with username: " + request.getUsername());
            AuthResponse response = authService.login(request); // Authenticate user and generate token
            return ResponseEntity.ok(response);                 // Return token and role in response
        } catch (RuntimeException e) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                                 .body(Map.of("message", e.getMessage()));
        }
    }
}
