package com.bankingMS.backend.controller;

import com.bankingMS.backend.dto.*;
import com.bankingMS.backend.service.TransactionService;
import jakarta.validation.Valid;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;
import java.util.List;

@RestController
@RequestMapping("/api/transaction")
public class TransactionController {
    private final TransactionService transactionService;


    public TransactionController(
            TransactionService transactionService) {

        this.transactionService = transactionService;
    }


    // DEPOSIT MONEY
    @PostMapping("/deposit")
    public TransactionResponseDTO deposit(
            @Valid @RequestBody DepositRequestDTO request) {

        return transactionService.deposit(request);
    }


    // WITHDRAW MONEY
    @PostMapping("/withdraw")
    public TransactionResponseDTO withdraw(
            @Valid @RequestBody WithdrawalRequestDTO request) {

        return transactionService.withdraw(request);
    }


    // TRANSFER MONEY
    @PostMapping("/transfer")
    public List<TransactionResponseDTO> transfer(
            @Valid @RequestBody TransferRequestDTO request) {

        return transactionService.transfer(request);
    }


    // VIEW TRANSACTION HISTORY
    @GetMapping("/history/{accountNumber}")
    public List<TransactionResponseDTO>
    getTransactionHistory(
            @PathVariable String accountNumber) {

        return transactionService
                .getTransactionHistory(accountNumber);
    }


    // GENERATE ACCOUNT STATEMENT
    @GetMapping("/statement/{accountNumber}")
    public AccountStatementResponseDTO generateStatement(

            @PathVariable String accountNumber,

            @RequestParam
            @DateTimeFormat(
                    iso = DateTimeFormat.ISO.DATE_TIME
            )
            LocalDateTime startDate,

            @RequestParam
            @DateTimeFormat(
                    iso = DateTimeFormat.ISO.DATE_TIME
            )
            LocalDateTime endDate) {

        return transactionService.generateStatement(
                accountNumber,
                startDate,
                endDate
        );
    }
}
