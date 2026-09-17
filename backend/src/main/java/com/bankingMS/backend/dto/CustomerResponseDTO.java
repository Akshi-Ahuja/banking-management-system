package com.bankingMS.backend.dto;

import com.bankingMS.backend.enums.CustomerStatus;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDate;
import java.time.LocalDateTime;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class CustomerResponseDTO {
    private String customerId;

    private String fullName;

    private String email;

    private String phoneNumber;

    private String address;

    private LocalDate dateOfBirth;

    private CustomerStatus status;

    private LocalDateTime createdAt;

    private LocalDateTime updatedAt;
}
