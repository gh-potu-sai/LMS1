package com.loanmanagement.dto;

import lombok.Data;

@Data
public class AdminUpdateDto {
    private String name;

    // 📞 Contact Info
    private String contactNumber;
    private String alternatePhoneNumber;

    // 📅 Personal Info
    private String dateOfBirth;
    private String gender;

    // 🏠 Address
    private String street;
    private String city;
    private String state;
    private String pincode;
    private String country;
}
