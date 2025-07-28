// Utility class for generating, parsing, and validating JWT tokens

package com.loanmanagement.config;

// --- JWT Library Imports ---
import io.jsonwebtoken.*;
import io.jsonwebtoken.security.Keys;

// --- Spring & Java Imports ---
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;
import java.util.Date;


@Component                                             // Marks this as a Spring-managed utility bean
public class JwtUtil {

    @Value("${jwt.secret}")                            // Secret key for signing JWT
    private String secret;

    @Value("${jwt.expiration}")                        // Expiration time (in milliseconds)
    private long expirationMs;

    // Generate a JWT token with username and role
    public String generateToken(String username, String role) {
        return Jwts.builder()
                .setSubject(username)                  // Set username as subject
                .claim("role", role)                   // Add role as a custom claim
                .setIssuedAt(new Date())               // Set token issue time
                .setExpiration(new Date(System.currentTimeMillis() + expirationMs)) // Set expiry
                .signWith(Keys.hmacShaKeyFor(secret.getBytes()), SignatureAlgorithm.HS256) // Sign token
                .compact();                            // Finalize token
    }

    // Extract the username (subject) from token
    public String extractUsername(String token) {
        return extractAllClaims(token).getSubject();
    }

    // Extract the user's role from token
    public String extractRole(String token) {
        return extractAllClaims(token).get("role", String.class);
    }

    // Validate if the token is well-formed and not expired
    public boolean isTokenValid(String token) {
        try {
            extractAllClaims(token);                   // Will throw if token is invalid/expired
            return true;
        } catch (JwtException | IllegalArgumentException e) {
            return false;
        }
    }

    // Extract all claims (payload) from token
    private Claims extractAllClaims(String token) {
        return Jwts.parserBuilder()
                .setSigningKey(Keys.hmacShaKeyFor(secret.getBytes()))
                .build()
                .parseClaimsJws(token)
                .getBody();
    }

}
