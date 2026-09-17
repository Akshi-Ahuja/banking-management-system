import api from "./api"

import type {
  DepositRequest,
  WithdrawalRequest,
  TransferRequest,
  TransactionResponse,
  TransferResponse,
  AccountStatementResponse,
} from "../types/transaction"


export const depositMoney = async (
  request: DepositRequest
) => {

  const response =
    await api.post<TransactionResponse>(
      "/transaction/deposit",
      request
    )

  return response.data
}


export const withdrawMoney = async (
  request: WithdrawalRequest
) => {

  const response =
    await api.post<TransactionResponse>(
      "/transaction/withdraw",
      request
    )

  return response.data
}


export const transferMoney = async (
  request: TransferRequest
) => {

  const response =
    await api.post<TransferResponse>(
      "/transaction/transfer",
      request
    )

  return response.data
}


export const getTransactionHistory = async (
  accountNumber: string
) => {

  const response =
    await api.get<TransactionResponse[]>(
      `/transaction/history/${accountNumber}`
    )

  return response.data
}

export const getAccountStatement = async (
  accountNumber: string,
  startDate: string,
  endDate: string
) => {

  const response =
    await api.get<AccountStatementResponse>(
      `/transaction/statement/${accountNumber}`,
      {
        params: {
          startDate,
          endDate,
        },
      }
    )

  return response.data
}