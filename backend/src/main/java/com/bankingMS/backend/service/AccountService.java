package com.bankingMS.backend.service;

import com.bankingMS.backend.dto.AccountRequestDTO;
import com.bankingMS.backend.dto.AccountResponseDTO;
import com.bankingMS.backend.dto.AccountUpdateDTO;
import com.bankingMS.backend.dto.BalanceResponseDTO;
import com.bankingMS.backend.entity.Account;
import com.bankingMS.backend.entity.Customer;
import com.bankingMS.backend.enums.AccountStatus;
import com.bankingMS.backend.enums.AccountType;
import com.bankingMS.backend.enums.CustomerStatus;
import com.bankingMS.backend.exception.ResourceNotFoundException;
import com.bankingMS.backend.repo.AccountRepository;
import com.bankingMS.backend.repo.CustomerRepository;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.util.List;
import java.util.Optional;
import java.util.concurrent.ThreadLocalRandom;

@Service
public class AccountService {
    private final AccountRepository accountRepository;
    private final CustomerRepository customerRepository;

    public AccountService(
            AccountRepository accountRepository,
            CustomerRepository customerRepository) {

        this.accountRepository = accountRepository;
        this.customerRepository = customerRepository;
    }


    // CREATE ACCOUNT
    public AccountResponseDTO createAccount(AccountRequestDTO request) {

        Customer customer =
                customerRepository.findByCustomerId(request.getCustomerId())
                        .orElseThrow(() ->
                                new ResourceNotFoundException("Customer not found"));


        if (customer.getStatus() != CustomerStatus.ACTIVE) {
            throw new IllegalArgumentException(
                    "Inactive customer cannot open an account");
        }


        BigDecimal overdraftLimit = request.getOverdraftLimit();

        if (overdraftLimit == null) {
            overdraftLimit = BigDecimal.ZERO;
        }


        // Savings accounts cannot have overdraft
        if (request.getAccountType() == AccountType.SAVINGS &&
                overdraftLimit.compareTo(BigDecimal.ZERO) > 0) {

            throw new IllegalArgumentException(
                    "Savings account cannot have overdraft");
        }


        Account account = new Account();

        account.setAccountId(generateAccountId());
        account.setAccountNumber(generateAccountNumber());
        account.setCustomer(customer);
        account.setAccountType(request.getAccountType());
        account.setBalance(request.getOpeningBalance());
        account.setOverdraftLimit(overdraftLimit);
        account.setStatus(AccountStatus.ACTIVE);

        Account savedAccount =
                accountRepository.save(account);

        return convertToResponseDTO(savedAccount);
    }


    // VIEW ACCOUNT
    public AccountResponseDTO getAccountByNumber(String accountNumber) {

        Account account =
                accountRepository.findByAccountNumber(accountNumber)
                        .orElseThrow(() ->
                                new ResourceNotFoundException("Account not found"));

        return convertToResponseDTO(account);
    }


    // VIEW ALL ACCOUNTS
    public List<AccountResponseDTO> getAllAccounts() {

        return accountRepository.findAll()
                .stream()
                .map(this::convertToResponseDTO)
                .toList();
    }


    // SEARCH ACCOUNT
    public AccountResponseDTO searchAccount(String keyword) {

        Optional<Account> accountByNumber =
                accountRepository.findByAccountNumber(keyword);

        if (accountByNumber.isPresent()) {
            return convertToResponseDTO(accountByNumber.get());
        }


        Optional<Account> accountById =
                accountRepository.findByAccountId(keyword);

        if (accountById.isPresent()) {
            return convertToResponseDTO(accountById.get());
        }

        throw new ResourceNotFoundException("Account not found");
    }


    // VIEW ALL ACCOUNTS BELONGING TO A CUSTOMER
    public List<AccountResponseDTO> getAccountsByCustomerId(
            String customerId) {

        customerRepository.findByCustomerId(customerId)
                .orElseThrow(() ->
                        new ResourceNotFoundException("Customer not found"));

        return accountRepository
                .findByCustomer_CustomerId(customerId)
                .stream()
                .map(this::convertToResponseDTO)
                .toList();
    }


    // UPDATE ACCOUNT
    public AccountResponseDTO updateAccount(
            String accountNumber,
            AccountUpdateDTO request) {

        Account account =
                accountRepository.findByAccountNumber(accountNumber)
                        .orElseThrow(() ->
                                new ResourceNotFoundException("Account not found"));


        if (account.getStatus() == AccountStatus.CLOSED) {
            throw new IllegalArgumentException(
                    "Closed account cannot be updated");
        }


        // Update overdraft limit
        if (request.getOverdraftLimit() != null) {

            if (account.getAccountType() == AccountType.SAVINGS &&
                    request.getOverdraftLimit()
                            .compareTo(BigDecimal.ZERO) > 0) {

                throw new IllegalArgumentException(
                        "Savings account cannot have overdraft");
            }

            account.setOverdraftLimit(
                    request.getOverdraftLimit());
        }


        // Update status
        if (request.getStatus() != null) {

            // Cannot close account if balance is not zero
            if (request.getStatus() == AccountStatus.CLOSED &&
                    account.getBalance()
                            .compareTo(BigDecimal.ZERO) != 0) {

                throw new IllegalArgumentException(
                        "Account balance must be zero before closing");
            }

            account.setStatus(request.getStatus());
        }


        Account updatedAccount =
                accountRepository.save(account);

        return convertToResponseDTO(updatedAccount);
    }


    // DEACTIVATE / FREEZE ACCOUNT
    public AccountResponseDTO deactivateAccount(String accountNumber) {

        Account account =
                accountRepository.findByAccountNumber(accountNumber)
                        .orElseThrow(() ->
                                new ResourceNotFoundException("Account not found"));


        if (account.getStatus() == AccountStatus.CLOSED) {
            throw new IllegalArgumentException(
                    "Account is already closed");
        }


        account.setStatus(AccountStatus.FROZEN);

        Account savedAccount =
                accountRepository.save(account);

        return convertToResponseDTO(savedAccount);
    }


    // CLOSE ACCOUNT
    public AccountResponseDTO closeAccount(String accountNumber) {

        Account account =
                accountRepository.findByAccountNumber(accountNumber)
                        .orElseThrow(() ->
                                new ResourceNotFoundException("Account not found"));


        if (account.getBalance().compareTo(BigDecimal.ZERO) != 0) {
            throw new IllegalArgumentException(
                    "Account balance must be zero before closing");
        }


        account.setStatus(AccountStatus.CLOSED);

        Account savedAccount =
                accountRepository.save(account);

        return convertToResponseDTO(savedAccount);
    }


    // CHECK BALANCE
    public BalanceResponseDTO checkBalance(String accountNumber) {

        Account account =
                accountRepository.findByAccountNumber(accountNumber)
                        .orElseThrow(() ->
                                new ResourceNotFoundException("Account not found"));


        BigDecimal availableBalance = account.getBalance();


        // Current account gets additional overdraft availability
        if (account.getAccountType() == AccountType.CURRENT) {

            BigDecimal overdraft = account.getOverdraftLimit();

            if (overdraft == null) {
                overdraft = BigDecimal.ZERO;
            }

            availableBalance =
                    account.getBalance().add(overdraft);
        }


        BalanceResponseDTO dto = new BalanceResponseDTO();

        dto.setAccountNumber(account.getAccountNumber());
        dto.setCustomerName(
                account.getCustomer().getFullName());
        dto.setAccountType(account.getAccountType());
        dto.setBalance(account.getBalance());
        dto.setOverdraftLimit(account.getOverdraftLimit());
        dto.setAvailableBalance(availableBalance);

        return dto;
    }


    // GENERATE ACCOUNT ID
    private String generateAccountId() {

        String accountId;

        do {

            int number =
                    ThreadLocalRandom.current()
                            .nextInt(100000, 1000000);

            accountId = "ACC" + number;

        } while (accountRepository.existsByAccountId(accountId));

        return accountId;
    }


    // GENERATE 12-DIGIT ACCOUNT NUMBER
    private String generateAccountNumber() {

        String accountNumber;

        do {

            long number =
                    ThreadLocalRandom.current().nextLong(
                            100000000000L,
                            1000000000000L
                    );

            accountNumber = String.valueOf(number);

        } while (
                accountRepository.existsByAccountNumber(accountNumber)
        );

        return accountNumber;
    }


    // ENTITY -> DTO
    private AccountResponseDTO convertToResponseDTO(Account account) {

        AccountResponseDTO dto =
                new AccountResponseDTO();

        dto.setAccountId(account.getAccountId());
        dto.setAccountNumber(account.getAccountNumber());

        dto.setCustomerId(
                account.getCustomer().getCustomerId());

        dto.setCustomerName(
                account.getCustomer().getFullName());

        dto.setAccountType(account.getAccountType());
        dto.setBalance(account.getBalance());
        dto.setOverdraftLimit(account.getOverdraftLimit());
        dto.setStatus(account.getStatus());
        dto.setOpenedAt(account.getOpenedAt());
        dto.setUpdatedAt(account.getUpdatedAt());

        return dto;
    }

}
