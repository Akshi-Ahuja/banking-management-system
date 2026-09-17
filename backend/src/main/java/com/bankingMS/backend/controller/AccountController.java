package com.bankingMS.backend.controller;

import com.bankingMS.backend.dto.AccountRequestDTO;
import com.bankingMS.backend.dto.AccountResponseDTO;
import com.bankingMS.backend.dto.AccountUpdateDTO;
import com.bankingMS.backend.dto.BalanceResponseDTO;
import com.bankingMS.backend.service.AccountService;
import jakarta.validation.Valid;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/account")
public class AccountController {
    private final AccountService accountService;


    public AccountController(AccountService accountService) {
        this.accountService = accountService;
    }


    // CREATE ACCOUNT
    @PostMapping
    public AccountResponseDTO createAccount(
            @Valid @RequestBody AccountRequestDTO request) {

        return accountService.createAccount(request);
    }


    // GET ACCOUNT BY ACCOUNT NUMBER
    @GetMapping("/{accountNumber}")
    public AccountResponseDTO getAccountByNumber(
            @PathVariable String accountNumber) {

        return accountService
                .getAccountByNumber(accountNumber);
    }


    // GET ALL ACCOUNTS
    @GetMapping
    public List<AccountResponseDTO> getAllAccounts() {

        return accountService.getAllAccounts();
    }


    // SEARCH ACCOUNT
    @GetMapping("/search")
    public AccountResponseDTO searchAccount(
            @RequestParam String keyword) {

        return accountService.searchAccount(keyword);
    }


    // GET ALL ACCOUNTS OF ONE CUSTOMER
    @GetMapping("/customer/{customerId}")
    public List<AccountResponseDTO> getAccountsByCustomerId(
            @PathVariable String customerId) {

        return accountService
                .getAccountsByCustomerId(customerId);
    }


    // UPDATE ACCOUNT
    @PutMapping("/{accountNumber}")
    public AccountResponseDTO updateAccount(
            @PathVariable String accountNumber,
            @Valid @RequestBody AccountUpdateDTO request) {

        return accountService.updateAccount(
                accountNumber,
                request
        );
    }


    // FREEZE / DEACTIVATE ACCOUNT
    @PatchMapping("/{accountNumber}/deactivate")
    public AccountResponseDTO deactivateAccount(
            @PathVariable String accountNumber) {

        return accountService
                .deactivateAccount(accountNumber);
    }


    // CLOSE ACCOUNT
    @PatchMapping("/{accountNumber}/close")
    public AccountResponseDTO closeAccount(
            @PathVariable String accountNumber) {

        return accountService.closeAccount(accountNumber);
    }


    // CHECK BALANCE
    @GetMapping("/{accountNumber}/balance")
    public BalanceResponseDTO checkBalance(
            @PathVariable String accountNumber) {

        return accountService.checkBalance(accountNumber);
    }
}
