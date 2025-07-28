// Security Configuration for Spring Boot + JWT + CORS

package com.loanmanagement.config;

// --- Spring Core Annotations ---
import org.springframework.context.annotation.Bean;                                 // Declares a method as a Spring-managed bean
import org.springframework.context.annotation.Configuration;                      // Marks this class as a configuration class
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity; // Enables Spring Security

// --- Spring Security Configuration ---
import org.springframework.security.config.annotation.web.builders.HttpSecurity;   // Builds security filter chain rules
import org.springframework.security.config.http.SessionCreationPolicy;             // Defines how sessions are managed
import org.springframework.security.config.Customizer;                             // Utility for concise configuration blocks
import org.springframework.security.web.SecurityFilterChain;                       // Defines the filter chain for Spring Security

// --- Password Encryption ---
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;           // BCrypt implementation for hashing passwords
import org.springframework.security.crypto.password.PasswordEncoder;               // Interface for password encoders

// --- CORS Configuration ---
import org.springframework.web.cors.CorsConfiguration;                             // Represents CORS config options
import org.springframework.web.cors.CorsConfigurationSource;                       // Source for CORS config
import org.springframework.web.cors.UrlBasedCorsConfigurationSource;               // Maps URL paths to CORS config

import java.util.List;                                                             // Utility for working with lists

// Main Spring Security Configuration Class
@Configuration
@EnableWebSecurity       // Enables Spring Security support
public class SecurityConfig {

    // Configures the Spring Security filter chain
    @Bean
    public SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception {
        http
            .csrf(csrf -> csrf.disable())                                           // Disables CSRF (not needed for stateless APIs)
            .cors(Customizer.withDefaults())                                       // Enables CORS using custom or default configuration
            .sessionManagement(session -> session
                .sessionCreationPolicy(SessionCreationPolicy.STATELESS))           // Configures stateless session (ideal for JWT)
            .authorizeHttpRequests(auth -> auth
                .requestMatchers("/api/auth/**").permitAll()                       // Allows public access to auth endpoints
                .anyRequest().permitAll());                                        // Allows all other requests (can restrict later)

        return http.build();                                                       // Returns the configured security chain
    }

    // Password encoder bean using BCrypt (used during registration/login)
    @Bean
    public PasswordEncoder passwordEncoder() {
        return new BCryptPasswordEncoder();                                        // Strong password hashing
    }

    // Global CORS configuration bean
    @Bean
    public CorsConfigurationSource corsConfigurationSource() {
        CorsConfiguration config = new CorsConfiguration();
        config.setAllowedOrigins(List.of("http://localhost:3000"));                // Allow requests from React frontend
        config.setAllowedMethods(List.of("GET", "POST", "PUT", "DELETE", "OPTIONS")); // Allow common HTTP methods
        config.setAllowedHeaders(List.of("*"));                                    // Allow all request headers
        config.setAllowCredentials(true);                                          // Allow cookies and auth headers

        UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();
        source.registerCorsConfiguration("/**", config);                           // Apply config to all paths

        return source;                                                             // Return CORS config source
    }
}
