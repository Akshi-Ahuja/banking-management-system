export type TransactionType =
  | "DEPOSIT"
  | "WITHDRAWAL"
  | "TRANSFER_IN"
  | "TRANSFER_OUT"

export type TransactionStatus =
  | "PENDING"
  | "SUCCESS"
  | "FAILED"
  | "REVERSED"


export interface DepositRequest {
  accountNumber: string
  amount: number
  description: string
}


export interface WithdrawalRequest {
  accountNumber: string
  amount: number
  description: string
}


export interface TransferRequest {
  senderAccountNumber: string
  receiverAccountNumber: string
  amount: number
  description: string
}


export interface TransactionResponse {
  transactionId: string
  accountNumber: string
  transactionType: TransactionType
  amount: number
  relatedAccountNumber: string | null
  transferId: string | null
  description: string
  balanceAfterTransaction: number
  transactionDate: string
  status: TransactionStatus
}


/*
Transfer may return either one response or
two transaction responses depending on
how your controller was written.
*/
export type TransferResponse =
  | TransactionResponse
  | TransactionResponse[]



export interface AccountStatementResponse {
  accountNumber: string
  customerId: string
  customerName: string
  accountType: string
  statementFrom: string
  statementTo: string
  openingBalance: number
  closingBalance: number
  transactions: TransactionResponse[]
}