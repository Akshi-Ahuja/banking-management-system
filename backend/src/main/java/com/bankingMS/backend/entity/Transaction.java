package com.bankingMS.backend.entity;

import com.bankingMS.backend.enums.TransactionStatus;
import com.bankingMS.backend.enums.TransactionType;
import jakarta.persistence.*;
import jakarta.validation.constraints.Digits;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Positive;
import jakarta.validation.constraints.Size;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.hibernate.annotations.CreationTimestamp;

import java.math.BigDecimal;
import java.time.LocalDateTime;

@Entity
@Table(name = "transactions_tb")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Transaction {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(
            name = "transaction_id",
            nullable = false,
            unique = true,
            updatable = false,
            length = 30
    )
    private String transactionId;

    @NotNull
    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(
            name = "account_record_id",
            nullable = false,
            foreignKey = @ForeignKey(name = "fk_transaction_account")
    )
    private Account account;

    @NotNull
    @Enumerated(EnumType.STRING)
    @Column(name = "transaction_type", nullable = false, length = 30)
    private TransactionType type;

    @NotNull
    @Positive(message = "Transaction amount must be greater than zero")
    @Digits(integer = 13, fraction = 2)
    @Column(nullable = false, precision = 15, scale = 2)
    private BigDecimal amount;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(
            name = "related_account_record_id",
            foreignKey = @ForeignKey(name = "fk_transaction_related_account")
    )
    private Account relatedAccount;

    @Size(max = 30)
    @Column(name = "transfer_id", length = 30)
    private String transferId;

    @Size(max = 255)
    @Column(length = 255)
    private String description;

    @NotNull
    @Digits(integer = 13, fraction = 2)
    @Column(
            name = "balance_after_transaction",
            nullable = false,
            precision = 15,
            scale = 2
    )
    private BigDecimal balanceAfterTransaction;

    @CreationTimestamp
    @Column(
            name = "transaction_date",
            nullable = false,
            updatable = false
    )
    private LocalDateTime transactionDate;

    @NotNull
    @Enumerated(EnumType.STRING)
    @Column(nullable = false, length = 20)
    private TransactionStatus status = TransactionStatus.SUCCESS;
}