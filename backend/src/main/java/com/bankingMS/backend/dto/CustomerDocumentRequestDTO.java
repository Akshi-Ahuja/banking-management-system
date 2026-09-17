package com.bankingMS.backend.dto;

import com.bankingMS.backend.enums.DocumentType;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class CustomerDocumentRequestDTO {
    @NotBlank(message = "Customer ID is required")
    private String customerId;

    @NotNull(message = "Document type is required")
    private DocumentType documentType;

    private String documentNumber;

    @NotBlank(message = "File path is required")
    private String filePath;
}
