package com.bankingMS.backend.dto;

import com.bankingMS.backend.enums.AccountStatus;
import com.bankingMS.backend.enums.AccountType;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.time.LocalDateTime;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class AccountResponseDTO {
    private String accountId;

    private String accountNumber;

    private String customerId;

    private String customerName;

    private AccountType accountType;

    private BigDecimal balance;

    private BigDecimal overdraftLimit;

    private AccountStatus status;

    private LocalDateTime openedAt;

    private LocalDateTime updatedAt;
}
