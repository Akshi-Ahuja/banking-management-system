package com.bankingMS.backend.dto;

import com.bankingMS.backend.enums.AccountType;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class BalanceResponseDTO {
    private String accountNumber;

    private String customerName;

    private AccountType accountType;

    private BigDecimal balance;

    private BigDecimal overdraftLimit;

    private BigDecimal availableBalance;
}
