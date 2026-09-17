package com.bankingMS.backend.dto;

import com.bankingMS.backend.enums.AccountType;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class AccountStatementResponseDTO {
    private String accountNumber;

    private String customerId;

    private String customerName;

    private AccountType accountType;

    private LocalDateTime statementFrom;

    private LocalDateTime statementTo;

    private BigDecimal openingBalance;

    private BigDecimal closingBalance;

    private List<TransactionResponseDTO> transactions;
}
