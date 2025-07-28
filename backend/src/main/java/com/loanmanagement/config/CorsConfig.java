// Global CORS configuration for allowing frontend requests

package com.loanmanagement.config;

// --- Spring MVC Imports ---
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.web.servlet.config.annotation.CorsRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;


@Configuration                                      // Marks this as a Spring configuration class
public class CorsConfig {

    @Bean
    public WebMvcConfigurer corsConfigurer() {
        return new WebMvcConfigurer() {

            // Configure global CORS mappings
            @Override
            public void addCorsMappings(CorsRegistry registry) {
                registry.addMapping("/**")                       // Apply to all endpoints
                        .allowedOrigins("http://localhost:3000") // Allow frontend origin
                        .allowedMethods("GET", "POST", "PUT", "DELETE", "OPTIONS") // Allowed HTTP methods
                        .allowedHeaders("*")                    // Allow all headers
                        .allowCredentials(true);                // Allow cookies/authorization headers
            }
        };
    }
}
