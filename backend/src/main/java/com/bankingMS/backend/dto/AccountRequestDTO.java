package com.bankingMS.backend.dto;

import com.bankingMS.backend.enums.AccountType;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.PositiveOrZero;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class AccountRequestDTO {
    @NotBlank(message = "Customer ID is required")
    private String customerId;

    @NotNull(message = "Account type is required")
    private AccountType accountType;

    @NotNull(message = "Opening balance is required")
    @PositiveOrZero(message = "Opening balance cannot be negative")
    private BigDecimal openingBalance;

    @PositiveOrZero(message = "Overdraft limit cannot be negative")
    private BigDecimal overdraftLimit;
}
