package com.loanmanagement.controller;

import com.loanmanagement.dto.CustomerUpdateDto;
import com.loanmanagement.dto.UserProfileDto;
import com.loanmanagement.model.User;
import com.loanmanagement.service.CustomerService;
import com.loanmanagement.service.UserService;
import jakarta.servlet.http.HttpServletRequest;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/user")
public class UserController {

    @Autowired
    private UserService userService;

    @Autowired
    private CustomerService customerService;

    // ✅ Get current logged-in user
    @GetMapping("/me")
    public UserProfileDto getCurrentUser(HttpServletRequest request) {
        User user = userService.getUserFromRequest(request);
        return userService.mapToDto(user);
    }

    // ✅ Update profile (customer side)
    @PutMapping("/update")
    public UserProfileDto updateProfile(@RequestBody CustomerUpdateDto dto, HttpServletRequest request) {
        return customerService.updateCustomer(dto, request);
    }
}
