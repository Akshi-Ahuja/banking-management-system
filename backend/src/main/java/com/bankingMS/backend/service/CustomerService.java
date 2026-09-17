package com.bankingMS.backend.service;

import com.bankingMS.backend.dto.CustomerRequestDTO;
import com.bankingMS.backend.dto.CustomerResponseDTO;
import com.bankingMS.backend.dto.CustomerUpdateDTO;
import com.bankingMS.backend.entity.Customer;
import com.bankingMS.backend.enums.CustomerStatus;
import com.bankingMS.backend.exception.ResourceNotFoundException;
import com.bankingMS.backend.repo.CustomerRepository;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;
import java.util.concurrent.ThreadLocalRandom;

@Service
public class CustomerService {
    private final CustomerRepository customerRepository;

    public CustomerService(CustomerRepository customerRepository) {
        this.customerRepository = customerRepository;
    }


    // ADD CUSTOMER
    public CustomerResponseDTO addCustomer(CustomerRequestDTO request) {

        // Check duplicate email
        if (customerRepository.existsByEmail(request.getEmail())) {
            throw new IllegalArgumentException("Email already exists");
        }

        // Check duplicate phone number
        if (customerRepository.existsByPhoneNumber(request.getPhoneNumber())) {
            throw new IllegalArgumentException("Phone number already exists");
        }

        Customer customer = new Customer();

        customer.setCustomerId(generateCustomerId());
        customer.setFullName(request.getFullName());
        customer.setEmail(request.getEmail());
        customer.setPhoneNumber(request.getPhoneNumber());
        customer.setAddress(request.getAddress());
        customer.setDateOfBirth(request.getDateOfBirth());
        customer.setStatus(CustomerStatus.ACTIVE);

        Customer savedCustomer = customerRepository.save(customer);

        return convertToResponseDTO(savedCustomer);
    }


    // VIEW CUSTOMER BY CUSTOMER ID
    public CustomerResponseDTO getCustomerById(String customerId) {

        Customer customer = customerRepository.findByCustomerId(customerId)
                .orElseThrow(() ->
                        new ResourceNotFoundException("Customer not found"));

        return convertToResponseDTO(customer);
    }


    // VIEW ALL CUSTOMERS
    public List<CustomerResponseDTO> getAllCustomers() {

        return customerRepository.findAll()
                .stream()
                .map(this::convertToResponseDTO)
                .toList();
    }


    // SEARCH CUSTOMER
    public List<CustomerResponseDTO> searchCustomer(String keyword) {

        // Search by customerId
        Optional<Customer> customerById =
                customerRepository.findByCustomerId(keyword);

        if (customerById.isPresent()) {
            return List.of(convertToResponseDTO(customerById.get()));
        }


        // Search by email
        Optional<Customer> customerByEmail =
                customerRepository.findByEmail(keyword);

        if (customerByEmail.isPresent()) {
            return List.of(convertToResponseDTO(customerByEmail.get()));
        }


        // Search by phone number
        Optional<Customer> customerByPhone =
                customerRepository.findByPhoneNumber(keyword);

        if (customerByPhone.isPresent()) {
            return List.of(convertToResponseDTO(customerByPhone.get()));
        }


        // Otherwise search by name
        return customerRepository
                .findByFullNameContainingIgnoreCase(keyword)
                .stream()
                .map(this::convertToResponseDTO)
                .toList();
    }


    // UPDATE CUSTOMER
    public CustomerResponseDTO updateCustomer(
            String customerId,
            CustomerUpdateDTO request) {

        Customer customer = customerRepository.findByCustomerId(customerId)
                .orElseThrow(() ->
                        new ResourceNotFoundException("Customer not found"));


        if (request.getFullName() != null &&
                !request.getFullName().isBlank()) {

            customer.setFullName(request.getFullName());
        }


        if (request.getEmail() != null &&
                !request.getEmail().equals(customer.getEmail())) {

            if (customerRepository.existsByEmail(request.getEmail())) {
                throw new IllegalArgumentException("Email already exists");
            }

            customer.setEmail(request.getEmail());
        }


        if (request.getPhoneNumber() != null &&
                !request.getPhoneNumber()
                        .equals(customer.getPhoneNumber())) {

            if (customerRepository
                    .existsByPhoneNumber(request.getPhoneNumber())) {

                throw new IllegalArgumentException(
                        "Phone number already exists");
            }

            customer.setPhoneNumber(request.getPhoneNumber());
        }


        if (request.getAddress() != null &&
                !request.getAddress().isBlank()) {

            customer.setAddress(request.getAddress());
        }


        if (request.getDateOfBirth() != null) {
            customer.setDateOfBirth(request.getDateOfBirth());
        }


        Customer updatedCustomer =
                customerRepository.save(customer);

        return convertToResponseDTO(updatedCustomer);
    }


    // DEACTIVATE CUSTOMER
    public CustomerResponseDTO deactivateCustomer(String customerId) {

        Customer customer = customerRepository.findByCustomerId(customerId)
                .orElseThrow(() ->
                        new ResourceNotFoundException("Customer not found"));

        customer.setStatus(CustomerStatus.INACTIVE);

        Customer savedCustomer =
                customerRepository.save(customer);

        return convertToResponseDTO(savedCustomer);
    }


    // GENERATE CUSTOMER ID
    private String generateCustomerId() {

        String customerId;

        do {

            int number =
                    ThreadLocalRandom.current()
                            .nextInt(100000, 1000000);

            customerId = "CUST" + number;

        } while (customerRepository.existsByCustomerId(customerId));

        return customerId;
    }


    // ENTITY -> DTO
    private CustomerResponseDTO convertToResponseDTO(Customer customer) {

        CustomerResponseDTO dto = new CustomerResponseDTO();

        dto.setCustomerId(customer.getCustomerId());
        dto.setFullName(customer.getFullName());
        dto.setEmail(customer.getEmail());
        dto.setPhoneNumber(customer.getPhoneNumber());
        dto.setAddress(customer.getAddress());
        dto.setDateOfBirth(customer.getDateOfBirth());
        dto.setStatus(customer.getStatus());
        dto.setCreatedAt(customer.getCreatedAt());
        dto.setUpdatedAt(customer.getUpdatedAt());

        return dto;
    }
}

