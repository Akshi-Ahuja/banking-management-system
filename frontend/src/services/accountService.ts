import api from "./api"

import type {
  AccountRequest,
  AccountResponse,
  AccountUpdateRequest,
  BalanceResponse,
} from "../types/account"


export const getAllAccounts = async () => {

  const response =
    await api.get<AccountResponse[]>(
      "/account"
    )

  return response.data
}


export const getAccountByNumber = async (
  accountNumber: string
) => {

  const response =
    await api.get<AccountResponse>(
      `/account/${accountNumber}`
    )

  return response.data
}


export const searchAccounts = async (
  keyword: string
) => {

  const response =
    await api.get<AccountResponse[]>(
      "/account/search",
      {
        params: {
          keyword,
        },
      }
    )

  return response.data
}


export const getAccountsByCustomerId = async (
  customerId: string
) => {

  const response =
    await api.get<AccountResponse[]>(
      `/account/customer/${customerId}`
    )

  return response.data
}


export const createAccount = async (
  request: AccountRequest
) => {

  const response =
    await api.post<AccountResponse>(
      "/account",
      request
    )

  return response.data
}


export const updateAccount = async (
  accountNumber: string,
  request: AccountUpdateRequest
) => {

  const response =
    await api.put<AccountResponse>(
      `/account/${accountNumber}`,
      request
    )

  return response.data
}


export const deactivateAccount = async (
  accountNumber: string
) => {

  const response =
    await api.patch<AccountResponse>(
      `/account/${accountNumber}/deactivate`
    )

  return response.data
}


export const closeAccount = async (
  accountNumber: string
) => {

  const response =
    await api.patch<AccountResponse>(
      `/account/${accountNumber}/close`
    )

  return response.data
}


export const getAccountBalance = async (
  accountNumber: string
) => {

  const response =
    await api.get<BalanceResponse>(
      `/account/${accountNumber}/balance`
    )

  return response.data
}