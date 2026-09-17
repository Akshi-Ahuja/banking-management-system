import {
  useEffect,
  useMemo,
  useState,
} from "react"

import {
  Search,
} from "lucide-react"

import { useSearchParams } from "react-router"

import PageHeader from "../../components/common/PageHeader"
import StatusBadge from "../../components/common/StatusBadge"
import EmptyState from "../../components/common/EmptyState"

import {
  getTransactionHistory,
} from "../../services/transactionService"

import type {
  TransactionResponse,
  TransactionType,
} from "../../types/transaction"


function money(value: number) {

  return `₹${value.toLocaleString(
    "en-IN"
  )}`
}


function TransactionHistoryPage() {

  const [searchParams] =
    useSearchParams()


  const accountFromUrl =
    searchParams.get(
      "accountNumber"
    ) || ""


  const [accountNumber, setAccountNumber] =
    useState(accountFromUrl)


  const [transactions, setTransactions] =
    useState<TransactionResponse[]>([])


  const [typeFilter, setTypeFilter] =
    useState<
      "ALL" | TransactionType
    >("ALL")


  const [fromDate, setFromDate] =
    useState("")

  const [toDate, setToDate] =
    useState("")


  const [loading, setLoading] =
    useState(false)

  const [error, setError] =
    useState("")

  const [searched, setSearched] =
    useState(false)


  const loadHistory = async (
    number: string
  ) => {

    if (!number.trim()) {

      setError(
        "Please enter an account number."
      )

      return
    }


    try {

      setLoading(true)
      setError("")
      setSearched(true)


      const data =
        await getTransactionHistory(
          number.trim()
        )


      setTransactions(data)

    } catch (error: any) {

      console.error(error)

      setTransactions([])

      setError(
        error.response?.data?.message ||
        "Unable to load transaction history"
      )

    } finally {

      setLoading(false)
    }
  }


  useEffect(() => {

    if (accountFromUrl) {

      loadHistory(
        accountFromUrl
      )
    }

  }, [accountFromUrl])


  const visibleTransactions =
    useMemo(() => {

      return transactions.filter(
        (transaction) => {

          const typeMatches =
            typeFilter === "ALL" ||
            transaction.transactionType ===
              typeFilter


          const transactionDate =
            transaction.transactionDate.slice(
              0,
              10
            )


          const fromMatches =
            !fromDate ||
            transactionDate >=
              fromDate


          const toMatches =
            !toDate ||
            transactionDate <=
              toDate


          return (
            typeMatches &&
            fromMatches &&
            toMatches
          )
        }
      )

    }, [
      transactions,
      typeFilter,
      fromDate,
      toDate,
    ])


  return (
    <>

      <PageHeader
        eyebrow="Transactions"
        title="Transaction History"
        description="View transaction records for an account."
      />


      <section className="panel form-panel mb-5">

        <div className="form-grid">

          <label>
            Account Number *

            <div className="search-field max-w-none">

              <Search
                size={16}
              />

              <input
                value={
                  accountNumber
                }
                onChange={(event) =>
                  setAccountNumber(
                    event.target.value
                  )
                }
                onKeyDown={(event) => {

                  if (
                    event.key ===
                    "Enter"
                  ) {

                    loadHistory(
                      accountNumber
                    )
                  }

                }}
                placeholder="Enter account number"
              />

            </div>
          </label>


          <label>
            Transaction Type

            <select
              value={
                typeFilter
              }
              onChange={(event) =>
                setTypeFilter(
                  event.target
                    .value as
                    | "ALL"
                    | TransactionType
                )
              }
            >
              <option value="ALL">
                ALL
              </option>

              <option value="DEPOSIT">
                DEPOSIT
              </option>

              <option value="WITHDRAWAL">
                WITHDRAWAL
              </option>

              <option value="TRANSFER_IN">
                TRANSFER IN
              </option>

              <option value="TRANSFER_OUT">
                TRANSFER OUT
              </option>
            </select>
          </label>


          <label>
            From Date

            <input
              type="date"
              value={fromDate}
              onChange={(event) =>
                setFromDate(
                  event.target.value
                )
              }
            />
          </label>


          <label>
            To Date

            <input
              type="date"
              value={toDate}
              onChange={(event) =>
                setToDate(
                  event.target.value
                )
              }
            />
          </label>

        </div>


        <div className="form-actions">

          <button
            className="primary-btn"
            onClick={() =>
              loadHistory(
                accountNumber
              )
            }
          >
            Search Transactions
          </button>

        </div>

      </section>


      {error && (

        <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded text-red-600 text-sm">
          {error}
        </div>

      )}


      <section className="panel">

        <div className="panel-heading">

          <div>

            <h2>
              Transaction Records
            </h2>

            <span className="panel-subtitle">
              {visibleTransactions.length} transactions
            </span>

          </div>

        </div>


        <div className="table-wrap">

          {loading ? (

            <div className="empty-state">
              <p>
                Loading transactions...
              </p>
            </div>

          ) : visibleTransactions.length > 0 ? (

            <table>

              <thead>
                <tr>
                  <th>
                    Transaction ID
                  </th>

                  <th>
                    Date & Time
                  </th>

                  <th>Type</th>

                  <th>Amount</th>

                  <th>
                    Related Account
                  </th>

                  <th>
                    Transfer ID
                  </th>

                  <th>
                    Description
                  </th>

                  <th>
                    Balance After
                  </th>

                  <th>Status</th>
                </tr>
              </thead>


              <tbody>

                {visibleTransactions.map(
                  (transaction) => {

                    const outgoing =
                      transaction.transactionType ===
                        "WITHDRAWAL" ||
                      transaction.transactionType ===
                        "TRANSFER_OUT"


                    return (

                      <tr
                        key={
                          transaction.transactionId
                        }
                      >

                        <td className="mono">
                          {
                            transaction.transactionId
                          }
                        </td>


                        <td className="muted-cell">
                          {new Date(
                            transaction.transactionDate
                          ).toLocaleString()}
                        </td>


                        <td>

                          <StatusBadge>
                            {
                              transaction.transactionType
                            }
                          </StatusBadge>

                        </td>


                        <td className="amount">

                          {outgoing
                            ? "-"
                            : "+"}

                          {money(
                            transaction.amount
                          )}

                        </td>


                        <td className="mono muted-cell">

                          {transaction.relatedAccountNumber ??
                            "-"}

                        </td>


                        <td className="mono muted-cell">

                          {transaction.transferId ??
                            "-"}

                        </td>


                        <td>
                          {
                            transaction.description
                          }
                        </td>


                        <td>
                          {money(
                            transaction.balanceAfterTransaction
                          )}
                        </td>


                        <td>

                          <StatusBadge>
                            {
                              transaction.status
                            }
                          </StatusBadge>

                        </td>

                      </tr>

                    )
                  }
                )}

              </tbody>

            </table>

          ) : searched ? (

            <EmptyState
              title="No transactions found"
              description="This account has no matching transactions."
            />

          ) : (

            <EmptyState
              title="Enter an account number"
              description="Search for an account to view its transaction history."
            />

          )}

        </div>

      </section>

    </>
  )
}

export default TransactionHistoryPage