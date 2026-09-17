package com.bankingMS.backend.repo;

import com.bankingMS.backend.entity.Account;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface AccountRepository extends JpaRepository<Account, Long> {
    Optional<Account> findByAccountId(String accountId);

    Optional<Account> findByAccountNumber(String accountNumber);

    List<Account> findByCustomer_CustomerId(String customerId);

    boolean existsByAccountId(String accountId);

    boolean existsByAccountNumber(String accountNumber);
}
