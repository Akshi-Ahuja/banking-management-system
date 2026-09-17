import api from "./api"

import type {
  CustomerRequest,
  CustomerResponse,
  CustomerUpdateRequest,
} from "../types/customer"


export const getAllCustomers = async () => {

  const response =
    await api.get<CustomerResponse[]>(
      "/customers"
    )

  return response.data
}


export const getCustomerById = async (
  customerId: string
) => {

  const response =
    await api.get<CustomerResponse>(
      `/customers/${customerId}`
    )

  return response.data
}


export const searchCustomers = async (
  keyword: string
) => {

  const response =
    await api.get<CustomerResponse[]>(
      "/customers/search",
      {
        params: {
          keyword: keyword,
        },
      }
    )

  return response.data
}


export const createCustomer = async (
  customer: CustomerRequest
) => {

  const response =
    await api.post<CustomerResponse>(
      "/customers",
      customer
    )

  return response.data
}


export const updateCustomer = async (
  customerId: string,
  customer: CustomerUpdateRequest
) => {

  const response =
    await api.put<CustomerResponse>(
      `/customers/${customerId}`,
      customer
    )

  return response.data
}


export const deactivateCustomer = async (
  customerId: string
) => {

  const response =
    await api.patch<CustomerResponse>(
      `/customers/${customerId}/deactivate`
    )

  return response.data
}