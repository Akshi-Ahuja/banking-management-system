package com.bankingMS.backend.controller;

import com.bankingMS.backend.dto.CustomerDocumentRequestDTO;
import com.bankingMS.backend.dto.CustomerDocumentResponseDTO;
import com.bankingMS.backend.service.CustomerDocumentService;
import jakarta.validation.Valid;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/document")
public class CustomerDocumentController {
    private final CustomerDocumentService customerDocumentService;


    public CustomerDocumentController(
            CustomerDocumentService customerDocumentService) {

        this.customerDocumentService =
                customerDocumentService;
    }


    // ADD CUSTOMER DOCUMENT
    @PostMapping
    public CustomerDocumentResponseDTO addDocument(
            @Valid @RequestBody CustomerDocumentRequestDTO request) {

        return customerDocumentService.addDocument(request);
    }


    // GET DOCUMENTS OF A CUSTOMER
    @GetMapping("/customer/{customerId}")
    public List<CustomerDocumentResponseDTO>
    getDocumentsByCustomerId(
            @PathVariable String customerId) {

        return customerDocumentService.getDocumentsByCustomerId(customerId);
    }
}
