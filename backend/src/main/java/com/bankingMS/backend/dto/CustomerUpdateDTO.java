package com.bankingMS.backend.dto;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.Past;
import jakarta.validation.constraints.Pattern;
import jakarta.validation.constraints.Size;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDate;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class CustomerUpdateDTO {
    @Size(min = 2, max = 100)
    private String fullName;

    @Email(message = "Enter a valid email")
    private String email;

    @Pattern(
            regexp = "^[0-9]{10,15}$",
            message = "Phone number must contain 10 to 15 digits"
    )
    private String phoneNumber;

    @Size(max = 255)
    private String address;

    @Past(message = "Date of birth must be in the past")
    private LocalDate dateOfBirth;

}
