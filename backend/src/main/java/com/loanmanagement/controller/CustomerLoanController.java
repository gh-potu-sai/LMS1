package com.loanmanagement.controller;

import com.loanmanagement.dto.LoanRequestDto;
import com.loanmanagement.model.Loan;
import com.loanmanagement.model.Loan.LoanStatus;
import com.loanmanagement.model.User;
import com.loanmanagement.repository.LoanRepository;
import com.loanmanagement.repository.UserRepository;
import com.loanmanagement.service.CustomerLoanService;
import com.loanmanagement.config.JwtUtil;
import jakarta.servlet.http.HttpServletRequest;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.*;

import java.util.Collections;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/customer/loans")
@Validated
public class CustomerLoanController {

    @Autowired
    private CustomerLoanService loanService;

    @Autowired
    private JwtUtil jwtUtil;
    
    @Autowired
    private LoanRepository loanRepository;

    @Autowired
    private UserRepository userRepository;

    private User getAuthenticatedCustomer(HttpServletRequest request) {
        String token = jwtUtil.resolveToken(request);
        if (token == null || !jwtUtil.isTokenValid(token)) {
            throw new RuntimeException("Invalid or missing JWT token");
        }
        String username = jwtUtil.extractUsername(token);
        return userRepository.findByUsername(username)
                .orElseThrow(() -> new RuntimeException("User not found with username: " + username));
    }

    // If DTO validations are removed, remove @Valid here
    @PostMapping
    public Loan applyLoan(@RequestBody LoanRequestDto dto, HttpServletRequest request) {
        User customer = getAuthenticatedCustomer(request);
        return loanService.applyLoan(dto, customer);
    }

    @GetMapping
    public List<Loan> getCustomerLoans(HttpServletRequest request) {
        User customer = getAuthenticatedCustomer(request);
        return loanService.getLoansByCustomer(customer);
    }

    @GetMapping("/{id}")
    public Loan getLoanById(@PathVariable Long id, HttpServletRequest request) {
        User customer = getAuthenticatedCustomer(request);
        return loanService.getLoanByIdForCustomer(id, customer);
    }
    
    @GetMapping("/active-count")
    public ResponseEntity<Map<String, Integer>> getActiveLoanCount(HttpServletRequest request) {
        User customer = getAuthenticatedCustomer(request);
        int count = loanRepository.countByCustomerAndLoanStatus(customer, LoanStatus.APPROVED);
        return ResponseEntity.ok(Collections.singletonMap("count", count));
    }
    
    @GetMapping("/active-loan-counts")
    public ResponseEntity<Map<Long, Integer>> getActiveLoanCounts(HttpServletRequest request) {
        User customer = getAuthenticatedCustomer(request);
        return ResponseEntity.ok(loanService.getActiveLoanCounts(customer));
    }


}
