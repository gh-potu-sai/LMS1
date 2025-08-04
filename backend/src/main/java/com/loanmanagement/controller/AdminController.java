package com.loanmanagement.controller;

import com.loanmanagement.dto.AdminUpdateDto;
import com.loanmanagement.dto.CustomerUpdateDto;
import com.loanmanagement.dto.UserProfileDto;
import com.loanmanagement.service.AdminLoanService;
import com.loanmanagement.service.AdminService;
import jakarta.servlet.http.HttpServletRequest;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/admin")
public class AdminController {

    @Autowired
    private AdminService adminService;

    // ✅ Admin fetches own profile
    @GetMapping("/me")
    public UserProfileDto getOwnProfile(HttpServletRequest request) {
        return adminService.getOwnProfile(request);
    }


    @GetMapping("/user/{userId}")
    public UserProfileDto getUserById(@PathVariable Long userId) {
        return adminService.getUserById(userId);
    }

    @PutMapping("/user/{userId}")
    public UserProfileDto updateUserById(@PathVariable Long userId, @RequestBody AdminUpdateDto updateDto) {
        return adminService.updateUserById(userId, updateDto);
    }

    // ✅ New: Admin can update their own profile
    @PutMapping("/update")
    public UserProfileDto updateOwnProfile(@RequestBody CustomerUpdateDto dto, HttpServletRequest request) {
        return adminService.updateOwnProfile(dto, request);
    }
    


}
