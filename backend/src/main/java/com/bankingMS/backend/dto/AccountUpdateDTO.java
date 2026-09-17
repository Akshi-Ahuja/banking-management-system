package com.bankingMS.backend.dto;

import com.bankingMS.backend.enums.AccountStatus;
import jakarta.validation.constraints.PositiveOrZero;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class AccountUpdateDTO {

    @PositiveOrZero(message = "Overdraft limit cannot be negative")
    private BigDecimal overdraftLimit;

    private AccountStatus status;
}
