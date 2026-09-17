package com.bankingMS.backend.entity;

import com.bankingMS.backend.enums.CustomerStatus;
import jakarta.persistence.*;
import jakarta.validation.constraints.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;

import java.time.LocalDate;
import java.time.LocalDateTime;

@Entity
@Table(name = "customer_tb")
@Data
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class Customer {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(
            name = "customer_id",
            nullable = false,
            unique = true,
            updatable = false,
            length = 20
    )
    private String customerId;

    @NotBlank(message = "Full Name is required!")
    @Size(message = "Full Name cannot exceed 100 characters")
    @Column(name = "full_name", nullable = false, length = 100)
    private String fullName;

    @NotBlank(message = "Email is Required!")
    @Email(message = "Enter a valid email!")
    @Size(max = 150)
    @Column(nullable = false, unique = true, length = 150)
    private String email;

    @NotBlank(message = "Phone Number is required!")
    @Pattern(
            regexp = "^[0-9]{10,15}$",
            message = "Phone Number must contain 10-15 digits!"
    )
    @Column(
            name = "phone_number",
            nullable = false,
            unique = true,
            length = 15
    )
    private String phoneNumber;

    @NotBlank(message = "Address is required")
    @Size(max = 255)
    @Column(nullable = false, length = 255)
    private String address;

    @NotNull(message = "Date of Birth is required!")
    @Past(message = "DOB should be in the past!")
    @Column(name = "date_of_birth", nullable = false)
    private LocalDate dateOfBirth;

    @CreationTimestamp
    @Column(name = "created_at", nullable = false, updatable = false)
    private LocalDateTime createdAt;

    @UpdateTimestamp
    @Column(name = "updated_at")
    private LocalDateTime updatedAt;

    @NotNull
    @Enumerated(EnumType.STRING)
    @Column(nullable = false, length = 20)
    private CustomerStatus status = CustomerStatus.ACTIVE;
}
