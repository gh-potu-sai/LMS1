package com.loanmanagement.controller;

import com.loanmanagement.config.JwtUtil;
import com.loanmanagement.dto.AuthResponse;
import com.loanmanagement.dto.LoginRequest;
import com.loanmanagement.dto.RegisterRequest;

import com.loanmanagement.dto.UpdatePasswordRequest;

import com.loanmanagement.model.User;
import com.loanmanagement.service.AuthService;

import lombok.RequiredArgsConstructor;
import org.springframework.http.*;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@CrossOrigin(origins = "http://localhost:3000")
@RestController
@RequestMapping("/api/auth")
@RequiredArgsConstructor
public class AuthController {

    private final AuthService authService;
    private final JwtUtil jwtUtil;

    // GET /api/auth/me
    @GetMapping("/me")
    public ResponseEntity<?> getUserDetails(@RequestHeader("Authorization") String authHeader) {
        String token = authHeader.replace("Bearer ", "");
        if (!jwtUtil.isTokenValid(token)) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                    .body(Map.of("message", "Invalid token"));
        }
        String username = jwtUtil.extractUsername(token);
        User user = authService.getUserByUsername(username);
        return ResponseEntity.ok(user);
    }

    // POST /api/auth/register
    @PostMapping("/register")
    public ResponseEntity<?> register(@RequestBody RegisterRequest request) {
        try {
            authService.register(request);
            return ResponseEntity.ok(Map.of("message", "User registered successfully!"));
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(Map.of("message", e.getMessage()));
        }
    }

    // POST /api/auth/login
    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody LoginRequest request) {
        try {
            System.out.println("📲 Login API hit with username: " + request.getUsername());
            AuthResponse response = authService.login(request);
            return ResponseEntity.ok(response);
        } catch (RuntimeException e) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                    .body(Map.of("message", e.getMessage()));
        }
    }

    // ✅ POST /api/auth/update-password
    @PostMapping("/update-password")
    public ResponseEntity<?> updatePassword(@RequestBody UpdatePasswordRequest request) {
        try {
            authService.updatePassword(request.getUsername(), request.getNewPassword(), request.getConfirmPassword());
            return ResponseEntity.ok(Map.of("message", "Password updated successfully!"));
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(Map.of("message", e.getMessage()));
        }
    }
}
