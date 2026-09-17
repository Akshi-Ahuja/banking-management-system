export type CustomerStatus =
  | "ACTIVE"
  | "INACTIVE"


export interface CustomerResponse {
  customerId: string
  fullName: string
  email: string
  phoneNumber: string
  address: string
  dateOfBirth: string
  status: CustomerStatus
  createdAt: string
  updatedAt: string
}


export interface CustomerRequest {
  fullName: string
  email: string
  phoneNumber: string
  address: string
  dateOfBirth: string
}


export interface CustomerUpdateRequest {
  fullName?: string
  email?: string
  phoneNumber?: string
  address?: string
  dateOfBirth?: string
}