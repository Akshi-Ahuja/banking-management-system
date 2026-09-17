package com.bankingMS.backend.service;

import com.bankingMS.backend.dto.CustomerDocumentRequestDTO;
import com.bankingMS.backend.dto.CustomerDocumentResponseDTO;
import com.bankingMS.backend.entity.Customer;
import com.bankingMS.backend.entity.CustomerDocument;
import com.bankingMS.backend.exception.ResourceNotFoundException;
import com.bankingMS.backend.repo.CustomerDocumentRepository;
import com.bankingMS.backend.repo.CustomerRepository;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class CustomerDocumentService {
    private final CustomerDocumentRepository customerDocumentRepository;
    private final CustomerRepository customerRepository;

    public CustomerDocumentService(
            CustomerDocumentRepository customerDocumentRepository,
            CustomerRepository customerRepository) {

        this.customerDocumentRepository = customerDocumentRepository;
        this.customerRepository = customerRepository;
    }


    // ADD DOCUMENT
    public CustomerDocumentResponseDTO addDocument(
            CustomerDocumentRequestDTO request) {

        Customer customer =
                customerRepository.findByCustomerId(request.getCustomerId())
                        .orElseThrow(() ->
                                new ResourceNotFoundException("Customer not found"));

        CustomerDocument document = new CustomerDocument();

        document.setCustomer(customer);
        document.setType(request.getDocumentType());
        document.setDocumentNumber(request.getDocumentNumber());
        document.setFilePath(request.getFilePath());

        CustomerDocument savedDocument =
                customerDocumentRepository.save(document);

        return convertToResponseDTO(savedDocument);
    }


    // VIEW ALL DOCUMENTS OF CUSTOMER
    public List<CustomerDocumentResponseDTO> getDocumentsByCustomerId(
            String customerId) {

        // First confirm customer exists
        customerRepository.findByCustomerId(customerId)
                .orElseThrow(() ->
                        new ResourceNotFoundException("Customer not found"));

        return customerDocumentRepository
                .findByCustomer_CustomerId(customerId)
                .stream()
                .map(this::convertToResponseDTO)
                .toList();
    }


    // ENTITY -> DTO
    private CustomerDocumentResponseDTO convertToResponseDTO(
            CustomerDocument document) {

        CustomerDocumentResponseDTO dto =
                new CustomerDocumentResponseDTO();

        dto.setId(document.getId());
        dto.setCustomerId(document.getCustomer().getCustomerId());
        dto.setDocumentType(document.getType());
        dto.setDocumentNumber(document.getDocumentNumber());
        dto.setFilePath(document.getFilePath());
        dto.setUploadedAt(document.getUploadedAt());

        return dto;
    }
}
