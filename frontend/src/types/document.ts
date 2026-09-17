export type DocumentType =
  | "AADHAR"
  | "PAN"
  | "PASSPORT"
  | "DRIVING_LICENSE"
  | "VOTER_ID"
  | "PROFILE_PHOTO"


export interface CustomerDocumentRequest {
  customerId: string
  documentType: DocumentType
  documentNumber: string | null
  filePath: string
}


export interface CustomerDocumentResponse {
  id: number
  customerId: string
  documentType: DocumentType
  documentNumber: string | null
  filePath: string
  uploadedAt: string
}