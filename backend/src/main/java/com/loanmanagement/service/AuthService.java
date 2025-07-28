// Service to handle user registration, login, and authentication logic

package com.loanmanagement.service;

// --- Project Imports ---
import com.loanmanagement.dto.*;                           // DTOs for request/response
import com.loanmanagement.model.User;                      // User entity
import com.loanmanagement.repository.UserRepository;       // JPA Repository for User
import com.loanmanagement.config.JwtUtil;                  // JWT utility for token generation

// --- Spring & Java Utility Imports ---
import lombok.RequiredArgsConstructor;                     // Lombok for constructor injection
import org.springframework.beans.factory.annotation.Value; // For reading properties
import org.springframework.security.crypto.password.PasswordEncoder; // For password hashing
import org.springframework.stereotype.Service;             // Marks class as Spring service
import java.time.LocalDateTime;                            // Used to set timestamps


@Service                                                   // Marks this class as a Spring-managed service
@RequiredArgsConstructor                                   // Lombok: generates constructor for final fields
public class AuthService {

    private final UserRepository userRepo;                 // DB access for User entity
    private final JwtUtil jwtUtil;                         // JWT helper for tokens
    private final PasswordEncoder passwordEncoder;         // Encodes and verifies passwords

    @Value("${app.admin.secret}")                          // Inject admin secret from config
    private String adminSecret;

    // Register a new user (validates role and uniqueness)
    public void register(RegisterRequest request) {
        String email = request.getEmail().trim();          // Trim whitespace
        String username = request.getUsername().trim();

        // Check for duplicate email
        if (userRepo.findByEmail(email).isPresent()) {
            throw new RuntimeException("Email already exists");
        }

        // Check for duplicate username
        if (userRepo.findByUsername(username).isPresent()) {
            throw new RuntimeException("Username already taken");
        }

        // If ADMIN role, validate admin secret key
        if (request.getRole() == User.Role.ADMIN) {
            if (request.getAdminKey() == null || !request.getAdminKey().trim().equals(adminSecret.trim())) {
                System.out.println("🔑 Received Admin Key: '" + request.getAdminKey() + "'");
                System.out.println("🛡️ Expected Admin Secret: '" + adminSecret + "'");
                throw new RuntimeException("Invalid or missing Admin Secret Key");
            }
        }

        // Build and save the new User
        User user = User.builder()
                .name(request.getName())
                .email(email)
                .username(username)
                .password(passwordEncoder.encode(request.getPassword()))
                .role(request.getRole())
                .createdAt(LocalDateTime.now())
                .build();

        userRepo.save(user);                               // Save user to DB
        System.out.println("✅ User registered: " + username);
    }

    // Login user and return JWT token with role
    public AuthResponse login(LoginRequest request) {
        System.out.println("🔐 Manual login for: " + request.getUsername());

        // Fetch user by username
        User user = userRepo.findByUsername(request.getUsername())
                .orElseThrow(() -> new RuntimeException("User not found"));

        // Compare input password with hashed password
        boolean match = passwordEncoder.matches(request.getPassword(), user.getPassword());
        System.out.println("📦 Stored hash: " + user.getPassword());
        System.out.println("🔍 Password matches? " + match);

        if (!match) {
            throw new RuntimeException("Invalid username or password");
        }

        // Generate JWT token
        String token = jwtUtil.generateToken(user.getUsername(), user.getRole().name());
        System.out.println("🎫 JWT issued for: " + user.getUsername());

        return new AuthResponse(token, user.getRole());     // Return token + role
    }

    // Fetch user by username
    public User getUserByUsername(String username) {
        return userRepo.findByUsername(username)
                .orElseThrow(() -> new RuntimeException("User not found"));
    }
}
