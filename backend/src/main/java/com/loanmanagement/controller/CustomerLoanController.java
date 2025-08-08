package com.loanmanagement.controller;

import com.loanmanagement.dto.LoanRequestDto;
import com.loanmanagement.dto.LoanStatusHistoryDto;
import com.loanmanagement.dto.LoanTypeActiveCountDto;
import com.loanmanagement.model.Loan;
import com.loanmanagement.model.User;
import com.loanmanagement.repository.UserRepository;
import com.loanmanagement.service.CustomerLoanService;
import com.loanmanagement.config.JwtUtil;

import jakarta.servlet.http.HttpServletRequest;
import jakarta.validation.Valid; // ✅ Import added

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.*;

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

    // ✅ POST /api/customer/loans — validate DTO before applying loan
    @PostMapping
    public Loan applyLoan(@Valid @RequestBody LoanRequestDto dto, HttpServletRequest request) {
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

    @GetMapping("/active-loan-counts")
    public ResponseEntity<Map<Long, Integer>> getActiveLoanCounts(HttpServletRequest request) {
        User customer = getAuthenticatedCustomer(request);
        return ResponseEntity.ok(loanService.getActiveLoanCounts(customer));
    }
    
    // ✅ New version — with loanTypeId, name, and count
    @GetMapping("/active-loan-counts-detailed")
    public ResponseEntity<List<LoanTypeActiveCountDto>> getActiveLoanCountsDetailed(HttpServletRequest request) {
        User customer = getAuthenticatedCustomer(request);
        return ResponseEntity.ok(loanService.getActiveLoanCountsDetailed(customer));
    }
    
    @GetMapping("/{loanId}/status-history")
    public ResponseEntity<List<LoanStatusHistoryDto>> getStatusHistory(
            @PathVariable Long loanId,
            HttpServletRequest request) {

        User customer = getAuthenticatedCustomer(request);
        List<LoanStatusHistoryDto> history = loanService.getStatusHistoryByLoanId(loanId, customer);
        return ResponseEntity.ok(history);
    }


}
