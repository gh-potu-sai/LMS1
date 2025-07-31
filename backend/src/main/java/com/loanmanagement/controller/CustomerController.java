package com.loanmanagement.controller;

import com.loanmanagement.dto.CustomerUpdateDto;
import com.loanmanagement.dto.UserProfileDto;
import com.loanmanagement.service.CustomerService;
import jakarta.servlet.http.HttpServletRequest;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/customer")
public class CustomerController {

    @Autowired
    private CustomerService customerService;

    @GetMapping("/me")
    public UserProfileDto getCurrentUser(HttpServletRequest request) {
        return customerService.getCurrentUser(request);
    }

    @PutMapping("/update")
    public UserProfileDto updateCustomer(@RequestBody CustomerUpdateDto updateDto, HttpServletRequest request) {
        return customerService.updateCustomer(updateDto, request);
    }
}
