export type AccountType =
  | "SAVINGS"
  | "CURRENT"

export type AccountStatus =
  | "ACTIVE"
  | "FROZEN"
  | "CLOSED"


export interface AccountRequest {
  customerId: string
  accountType: AccountType
  openingBalance: number
  overdraftLimit: number
}


export interface AccountUpdateRequest {
  overdraftLimit: number
  status: AccountStatus
}


export interface AccountResponse {
  accountId: string
  accountNumber: string
  customerId: string
  customerName: string
  accountType: AccountType
  balance: number
  overdraftLimit: number
  status: AccountStatus
  openedAt: string
  updatedAt: string
}


export interface BalanceResponse {
  accountNumber: string
  customerName: string
  accountType: AccountType
  balance: number
  overdraftLimit: number
  availableBalance: number
}