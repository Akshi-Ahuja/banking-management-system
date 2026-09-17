package com.bankingMS.backend.service;

import com.bankingMS.backend.dto.*;
import com.bankingMS.backend.entity.Account;
import com.bankingMS.backend.entity.Transaction;
import com.bankingMS.backend.enums.*;
import com.bankingMS.backend.exception.ResourceNotFoundException;
import com.bankingMS.backend.repo.AccountRepository;
import com.bankingMS.backend.repo.TransactionRepository;
import jakarta.transaction.Transactional;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;
import java.util.concurrent.ThreadLocalRandom;

@Service
public class TransactionService {
    private final AccountRepository accountRepository;
    private final TransactionRepository transactionRepository;

    public TransactionService(
            AccountRepository accountRepository,
            TransactionRepository transactionRepository) {

        this.accountRepository = accountRepository;
        this.transactionRepository = transactionRepository;
    }


    // DEPOSIT
    @Transactional
    public TransactionResponseDTO deposit(
            DepositRequestDTO request) {

        validateAmount(request.getAmount());


        Account account =
                getActiveAccount(request.getAccountNumber());


        BigDecimal newBalance =
                account.getBalance().add(request.getAmount());

        account.setBalance(newBalance);

        accountRepository.save(account);


        Transaction transaction = createTransaction(
                account,
                TransactionType.DEPOSIT,
                request.getAmount(),
                null,
                null,
                getDescription(
                        request.getDescription(),
                        "Deposit"
                ),
                newBalance
        );


        Transaction savedTransaction =
                transactionRepository.save(transaction);


        return convertToResponseDTO(savedTransaction);
    }


    // WITHDRAW
    @Transactional
    public TransactionResponseDTO withdraw(
            WithdrawalRequestDTO request) {

        validateAmount(request.getAmount());


        Account account =
                getActiveAccount(request.getAccountNumber());


        checkWithdrawalAllowed(
                account,
                request.getAmount()
        );


        BigDecimal newBalance =
                account.getBalance()
                        .subtract(request.getAmount());

        account.setBalance(newBalance);

        accountRepository.save(account);


        Transaction transaction = createTransaction(
                account,
                TransactionType.WITHDRAWAL,
                request.getAmount(),
                null,
                null,
                getDescription(
                        request.getDescription(),
                        "Withdrawal"
                ),
                newBalance
        );


        Transaction savedTransaction =
                transactionRepository.save(transaction);


        return convertToResponseDTO(savedTransaction);
    }


    // TRANSFER
    @Transactional
    public List<TransactionResponseDTO> transfer(
            TransferRequestDTO request) {

        validateAmount(request.getAmount());


        if (request.getSenderAccountNumber()
                .equals(request.getReceiverAccountNumber())) {

            throw new IllegalArgumentException(
                    "Sender and receiver accounts cannot be the same");
        }


        Account sender =
                getActiveAccount(
                        request.getSenderAccountNumber()
                );


        Account receiver =
                getActiveAccount(
                        request.getReceiverAccountNumber()
                );


        checkWithdrawalAllowed(
                sender,
                request.getAmount()
        );


        // Calculate new balances
        BigDecimal senderNewBalance =
                sender.getBalance()
                        .subtract(request.getAmount());


        BigDecimal receiverNewBalance =
                receiver.getBalance()
                        .add(request.getAmount());


        sender.setBalance(senderNewBalance);
        receiver.setBalance(receiverNewBalance);


        accountRepository.save(sender);
        accountRepository.save(receiver);


        // Same transfer ID for both transactions
        String transferId = generateTransferId();


        // Sender transaction
        Transaction transferOut = createTransaction(
                sender,
                TransactionType.TRANSFER_OUT,
                request.getAmount(),
                receiver,
                transferId,
                getDescription(
                        request.getDescription(),
                        "Transfer to " +
                                receiver.getAccountNumber()
                ),
                senderNewBalance
        );


        // Receiver transaction
        Transaction transferIn = createTransaction(
                receiver,
                TransactionType.TRANSFER_IN,
                request.getAmount(),
                sender,
                transferId,
                getDescription(
                        request.getDescription(),
                        "Transfer from " +
                                sender.getAccountNumber()
                ),
                receiverNewBalance
        );


        Transaction savedOut =
                transactionRepository.save(transferOut);

        Transaction savedIn =
                transactionRepository.save(transferIn);


        return List.of(
                convertToResponseDTO(savedOut),
                convertToResponseDTO(savedIn)
        );
    }


    // VIEW TRANSACTION HISTORY
    public List<TransactionResponseDTO> getTransactionHistory(
            String accountNumber) {

        accountRepository.findByAccountNumber(accountNumber)
                .orElseThrow(() ->
                        new ResourceNotFoundException("Account not found"));


        return transactionRepository
                .findByAccount_AccountNumberOrderByTransactionDateDesc(
                        accountNumber
                )
                .stream()
                .map(this::convertToResponseDTO)
                .toList();
    }


    // GENERATE ACCOUNT STATEMENT
    public AccountStatementResponseDTO generateStatement(
            String accountNumber,
            LocalDateTime startDate,
            LocalDateTime endDate) {

        if (startDate.isAfter(endDate)) {
            throw new IllegalArgumentException(
                    "Start date cannot be after end date");
        }


        Account account =
                accountRepository.findByAccountNumber(accountNumber)
                        .orElseThrow(() ->
                                new ResourceNotFoundException("Account not found"));


        List<Transaction> statementTransactions =
                transactionRepository
                        .findByAccount_AccountNumberAndTransactionDateBetweenOrderByTransactionDateAsc(
                                accountNumber,
                                startDate,
                                endDate
                        );


        BigDecimal openingBalance =
                calculateOpeningBalance(
                        account,
                        startDate
                );


        BigDecimal closingBalance =
                openingBalance;


        // Apply transactions inside statement period
        for (Transaction transaction : statementTransactions) {

            if (transaction.getStatus()
                    != TransactionStatus.SUCCESS) {

                continue;
            }


            if (isCreditTransaction(
                    transaction.getType())) {

                closingBalance =
                        closingBalance.add(
                                transaction.getAmount());

            } else {

                closingBalance =
                        closingBalance.subtract(
                                transaction.getAmount());
            }
        }


        List<TransactionResponseDTO> transactionDTOs =
                statementTransactions
                        .stream()
                        .map(this::convertToResponseDTO)
                        .toList();


        AccountStatementResponseDTO statement =
                new AccountStatementResponseDTO();


        statement.setAccountNumber(
                account.getAccountNumber());

        statement.setCustomerId(account.getCustomer().getCustomerId());

        statement.setCustomerName(
                account.getCustomer().getFullName());

        statement.setAccountType(
                account.getAccountType());

        statement.setStatementFrom(startDate);
        statement.setStatementTo(endDate);

        statement.setOpeningBalance(openingBalance);
        statement.setClosingBalance(closingBalance);

        statement.setTransactions(transactionDTOs);


        return statement;
    }


    // FIND ACCOUNT AND CHECK WHETHER TRANSACTIONS ARE ALLOWED
    private Account getActiveAccount(String accountNumber) {

        Account account =
                accountRepository.findByAccountNumber(accountNumber)
                        .orElseThrow(() ->
                                new ResourceNotFoundException("Account not found"));


        if (account.getStatus() != AccountStatus.ACTIVE) {
            throw new IllegalArgumentException(
                    "Transactions are not allowed on this account");
        }


        if (account.getCustomer().getStatus()
                != CustomerStatus.ACTIVE) {

            throw new IllegalArgumentException(
                    "Customer is inactive");
        }


        return account;
    }


    // CHECK WITHDRAWAL RULES
    private void checkWithdrawalAllowed(
            Account account,
            BigDecimal amount) {


        // SAVINGS ACCOUNT
        if (account.getAccountType() == AccountType.SAVINGS) {

            if (account.getBalance()
                    .compareTo(amount) < 0) {

                throw new IllegalArgumentException(
                        "Insufficient balance");
            }
        }


        // CURRENT ACCOUNT
        if (account.getAccountType() == AccountType.CURRENT) {

            BigDecimal overdraft =
                    account.getOverdraftLimit();

            if (overdraft == null) {
                overdraft = BigDecimal.ZERO;
            }


            BigDecimal availableBalance =
                    account.getBalance()
                            .add(overdraft);


            if (availableBalance.compareTo(amount) < 0) {

                throw new IllegalArgumentException(
                        "Insufficient balance and overdraft limit");
            }
        }
    }


    // VALIDATE MONEY AMOUNT
    private void validateAmount(BigDecimal amount) {

        if (amount == null ||
                amount.compareTo(BigDecimal.ZERO) <= 0) {

            throw new IllegalArgumentException(
                    "Amount must be greater than zero");
        }
    }


    // CREATE TRANSACTION OBJECT
    private Transaction createTransaction(
            Account account,
            TransactionType type,
            BigDecimal amount,
            Account relatedAccount,
            String transferId,
            String description,
            BigDecimal balanceAfterTransaction) {


        Transaction transaction = new Transaction();

        transaction.setTransactionId(
                generateTransactionId());

        transaction.setAccount(account);

        transaction.setType(type);

        transaction.setAmount(amount);

        transaction.setRelatedAccount(relatedAccount);

        transaction.setTransferId(transferId);

        transaction.setDescription(description);

        transaction.setBalanceAfterTransaction(
                balanceAfterTransaction);

        transaction.setStatus(
                TransactionStatus.SUCCESS);


        return transaction;
    }


    // CALCULATE OPENING BALANCE FOR STATEMENT
    private BigDecimal calculateOpeningBalance(
            Account account,
            LocalDateTime startDate) {


        BigDecimal openingBalance =
                account.getBalance();


        List<Transaction> allTransactions =
                transactionRepository
                        .findByAccount_AccountNumberOrderByTransactionDateDesc(
                                account.getAccountNumber()
                        );


        /*
         * Current balance contains all transactions.
         *
         * To find the balance at the beginning of
         * the statement, reverse all transactions
         * that happened from startDate onwards.
         */
        for (Transaction transaction : allTransactions) {


            if (transaction.getTransactionDate() == null) {
                continue;
            }


            if (transaction.getStatus()
                    != TransactionStatus.SUCCESS) {

                continue;
            }


            if (!transaction.getTransactionDate()
                    .isBefore(startDate)) {


                if (isCreditTransaction(
                        transaction.getType())) {

                    openingBalance =
                            openingBalance.subtract(
                                    transaction.getAmount());

                } else {

                    openingBalance =
                            openingBalance.add(
                                    transaction.getAmount());
                }
            }
        }


        return openingBalance;
    }


    // CHECK WHETHER TRANSACTION ADDED MONEY
    private boolean isCreditTransaction(
            TransactionType type) {

        return type == TransactionType.DEPOSIT ||
                type == TransactionType.TRANSFER_IN;
    }


    // DEFAULT DESCRIPTION
    private String getDescription(
            String description,
            String defaultDescription) {

        if (description == null ||
                description.isBlank()) {

            return defaultDescription;
        }

        return description;
    }


    // GENERATE TRANSACTION ID
    private String generateTransactionId() {

        String transactionId;

        do {

            int number =
                    ThreadLocalRandom.current()
                            .nextInt(
                                    10000000,
                                    100000000
                            );

            transactionId = "TXN" + number;

        } while (
                transactionRepository
                        .findByTransactionId(transactionId)
                        .isPresent()
        );


        return transactionId;
    }


    // GENERATE TRANSFER ID
    private String generateTransferId() {

        String transferId;

        do {

            int number =
                    ThreadLocalRandom.current()
                            .nextInt(
                                    10000000,
                                    100000000
                            );

            transferId = "TRF" + number;

        } while (
                !transactionRepository
                        .findByTransferId(transferId)
                        .isEmpty()
        );


        return transferId;
    }


    // ENTITY -> DTO
    private TransactionResponseDTO convertToResponseDTO(
            Transaction transaction) {


        TransactionResponseDTO dto =
                new TransactionResponseDTO();


        dto.setTransactionId(
                transaction.getTransactionId());

        dto.setAccountNumber(
                transaction.getAccount()
                        .getAccountNumber());

        dto.setTransactionType(
                transaction.getType());

        dto.setAmount(
                transaction.getAmount());


        if (transaction.getRelatedAccount() != null) {

            dto.setRelatedAccountNumber(
                    transaction.getRelatedAccount()
                            .getAccountNumber());
        }


        dto.setTransferId(
                transaction.getTransferId());

        dto.setDescription(
                transaction.getDescription());

        dto.setBalanceAfterTransaction(
                transaction.getBalanceAfterTransaction());

        dto.setTransactionDate(
                transaction.getTransactionDate());

        dto.setStatus(
                transaction.getStatus());


        return dto;
    }
}
