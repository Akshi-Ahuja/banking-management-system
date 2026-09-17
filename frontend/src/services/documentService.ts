import api from "./api"

import type {
  CustomerDocumentRequest,
  CustomerDocumentResponse,
} from "../types/document"


export const getCustomerDocuments = async (
  customerId: string
) => {

  const response =
    await api.get<CustomerDocumentResponse[]>(
      `/document/customer/${customerId}`
    )

  return response.data
}


export const addCustomerDocument = async (
  document: CustomerDocumentRequest
) => {

  const response =
    await api.post<CustomerDocumentResponse>(
      "/document",
      document
    )

  return response.data
}