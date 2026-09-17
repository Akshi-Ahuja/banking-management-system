package com.bankingMS.backend.dto;

import com.bankingMS.backend.enums.DocumentType;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class CustomerDocumentResponseDTO {
    private Long id;

    private String customerId;

    private DocumentType documentType;

    private String documentNumber;

    private String filePath;

    private LocalDateTime uploadedAt;
}
