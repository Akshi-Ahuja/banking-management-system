package com.bankingMS.backend.repo;

import com.bankingMS.backend.entity.Customer;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface CustomerRepository extends JpaRepository<Customer, Long> {

    Optional<Customer> findByCustomerId(String customerId);

    Optional<Customer> findByEmail(String email);

    Optional<Customer> findByPhoneNumber(String phoneNumber);

    List<Customer> findByFullNameContainingIgnoreCase(String fullName);

    boolean existsByCustomerId(String customerId);

    boolean existsByEmail(String email);

    boolean existsByPhoneNumber(String phoneNumber);
}