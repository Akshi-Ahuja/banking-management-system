package com.bankingMS.backend.dto;

import com.bankingMS.backend.enums.TransactionStatus;
import com.bankingMS.backend.enums.TransactionType;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.time.LocalDateTime;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class TransactionResponseDTO {
    private String transactionId;

    private String accountNumber;

    private TransactionType transactionType;

    private BigDecimal amount;

    private String relatedAccountNumber;

    private String transferId;

    private String description;

    private BigDecimal balanceAfterTransaction;

    private LocalDateTime transactionDate;

    private TransactionStatus status;
}
