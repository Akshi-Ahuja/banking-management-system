package com.bankingMS.backend.repo;

import com.bankingMS.backend.entity.CustomerDocument;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface CustomerDocumentRepository extends JpaRepository<CustomerDocument, Long> {

        List<CustomerDocument> findByCustomer_CustomerId (String customerId);
    }
