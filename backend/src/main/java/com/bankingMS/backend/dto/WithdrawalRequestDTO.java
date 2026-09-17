package com.bankingMS.backend.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Positive;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class WithdrawalRequestDTO {
    @NotBlank(message = "Account number is required")
    private String accountNumber;

    @NotNull(message = "Withdrawal amount is required")
    @Positive(message = "Withdrawal amount must be greater than zero")
    private BigDecimal amount;

    private String description;
}
