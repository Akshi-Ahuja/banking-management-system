package com.bankingMS.backend.controller;

import com.bankingMS.backend.dto.CustomerRequestDTO;
import com.bankingMS.backend.dto.CustomerResponseDTO;
import com.bankingMS.backend.dto.CustomerUpdateDTO;
import com.bankingMS.backend.service.CustomerService;
import jakarta.validation.Valid;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/customers")
public class CustomerController {
    private final CustomerService customerService;

    // Constructor Injection
    public CustomerController(CustomerService customerService) {
        this.customerService = customerService;
    }


    // ADD CUSTOMER
    @PostMapping
    public CustomerResponseDTO addCustomer(
            @Valid @RequestBody CustomerRequestDTO request) {

        return customerService.addCustomer(request);
    }


    // GET CUSTOMER BY CUSTOMER ID
    @GetMapping("/{customerId}")
    public CustomerResponseDTO getCustomerById(
            @PathVariable String customerId) {

        return customerService.getCustomerById(customerId);
    }


    // GET ALL CUSTOMERS
    @GetMapping
    public List<CustomerResponseDTO> getAllCustomers() {

        return customerService.getAllCustomers();
    }


    // SEARCH CUSTOMER
    @GetMapping("/search")
    public List<CustomerResponseDTO> searchCustomer(
            @RequestParam String keyword) {

        return customerService.searchCustomer(keyword);
    }


    // UPDATE CUSTOMER
    @PutMapping("/{customerId}")
    public CustomerResponseDTO updateCustomer(
            @PathVariable String customerId,
            @Valid @RequestBody CustomerUpdateDTO request) {

        return customerService.updateCustomer(
                customerId,
                request
        );
    }


    // DEACTIVATE CUSTOMER
    @PatchMapping("/{customerId}/deactivate")
    public CustomerResponseDTO deactivateCustomer(
            @PathVariable String customerId) {

        return customerService.deactivateCustomer(customerId);
    }
}
