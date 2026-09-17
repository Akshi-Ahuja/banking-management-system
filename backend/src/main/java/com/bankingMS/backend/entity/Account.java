package com.bankingMS.backend.entity;

import com.bankingMS.backend.enums.AccountStatus;
import com.bankingMS.backend.enums.AccountType;
import jakarta.persistence.*;
import jakarta.validation.constraints.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;

import java.math.BigDecimal;
import java.time.LocalDateTime;

@Entity
@Table(name = "accounts_tb")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Account {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(
            name = "account_id",
            nullable = false,
            unique = true,
            updatable = false,
            length = 20
    )
    private String accountId;

    @Pattern(
            regexp = "^[0-9]{10,20}$",
            message = "Account number must contain 10 to 20 digits"
    )
    @Column(
            name = "account_number",
            nullable = false,
            unique = true,
            updatable = false,
            length = 20
    )
    private String accountNumber;

    @NotNull
    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(
            name = "customer_record_id",
            nullable = false,
            foreignKey = @ForeignKey(name = "fk_account_customer")
    )
    private Customer customer;

    @NotNull(message = "Account type is required")
    @Enumerated(EnumType.STRING)
    @Column(name = "account_type", nullable = false, length = 20)
    private AccountType accountType;

    @NotNull
    @Digits(integer = 13, fraction = 2)
    @Column(nullable = false, precision = 15, scale = 2)
    private BigDecimal balance = BigDecimal.ZERO;

    @NotNull
    @PositiveOrZero(message = "Overdraft limit cannot be negative")
    @Digits(integer = 13, fraction = 2)
    @Column(
            name = "overdraft_limit",
            nullable = false,
            precision = 15,
            scale = 2
    )
    private BigDecimal overdraftLimit = BigDecimal.ZERO;

    @NotNull
    @Enumerated(EnumType.STRING)
    @Column(nullable = false, length = 20)
    private AccountStatus status;

    @CreationTimestamp
    @Column(name = "opened_at", nullable = false, updatable = false)
    private LocalDateTime openedAt;

    @UpdateTimestamp
    @Column(name = "updated_at")
    private LocalDateTime updatedAt;

}
