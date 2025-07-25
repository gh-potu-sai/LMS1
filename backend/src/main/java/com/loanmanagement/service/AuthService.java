package com.loanmanagement.service;

import com.loanmanagement.dto.*;
import com.loanmanagement.model.User;
import com.loanmanagement.repository.UserRepository;
import com.loanmanagement.config.JwtUtil;
import lombok.RequiredArgsConstructor;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;

@Service
@RequiredArgsConstructor
public class AuthService {

    private final UserRepository userRepo;
    private final JwtUtil jwtUtil;
    private final PasswordEncoder passwordEncoder;

    public void register(RegisterRequest request) {
        String email = request.getEmail().trim();
        String username = request.getUsername().trim();

        if (userRepo.findByEmail(email).isPresent())
            throw new RuntimeException("Email already exists");

        if (userRepo.findByUsername(username).isPresent())
            throw new RuntimeException("Username already taken");

        User user = User.builder()
                .name(request.getName())
                .email(email)
                .username(username)
                .password(passwordEncoder.encode(request.getPassword()))
                .role(request.getRole())
                .createdAt(LocalDateTime.now())
                .build();

        userRepo.save(user);
        System.out.println("✅ User registered: " + username);
    }

    public AuthResponse login(LoginRequest request) {
        System.out.println("🔐 Manual login for: " + request.getUsername());

        User user = userRepo.findByUsername(request.getUsername())
                .orElseThrow(() -> new RuntimeException("User not found"));

        boolean match = passwordEncoder.matches(request.getPassword(), user.getPassword());
        System.out.println("📦 Stored hash: " + user.getPassword());
        System.out.println("🔍 Password matches? " + match);

        if (!match) {
            throw new RuntimeException("Invalid username or password");
        }

        String token = jwtUtil.generateToken(user.getUsername(), user.getRole().name());
        System.out.println("🎫 JWT issued for: " + user.getUsername());

        return new AuthResponse(token, user.getRole());
    }
}
