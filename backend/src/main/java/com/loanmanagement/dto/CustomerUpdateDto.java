package com.loanmanagement.dto;

import lombok.Data;

@Data
public class CustomerUpdateDto {
    private String name;
    private String password; // Still editable via profile

    // 📞 Contact
    private String contactNumber;
    private String alternatePhoneNumber;

    // 📅 Personal
    private String dateOfBirth;
    private String gender;

    // 🏠 Address
    private String street;
    private String city;
    private String state;
    private String pincode;
    private String country;
}
