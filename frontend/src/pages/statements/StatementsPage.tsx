import {
  useState,
  type FormEvent,
} from "react"

import {
  FileText,
  Printer,
} from "lucide-react"

import {
  useSearchParams,
} from "react-router"

import PageHeader from "../../components/common/PageHeader"
import EmptyState from "../../components/common/EmptyState"
import StatusBadge from "../../components/common/StatusBadge"

import {
  getAccountStatement,
} from "../../services/transactionService"

import type {
  AccountStatementResponse,
} from "../../types/transaction"


function money(value: number) {

  return `₹${value.toLocaleString(
    "en-IN",
    {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }
  )}`
}


function StatementsPage() {

  const [searchParams] =
    useSearchParams()


  const accountFromUrl =
    searchParams.get(
      "accountNumber"
    ) || ""


  const [accountNumber, setAccountNumber] =
    useState(accountFromUrl)

  const [startDate, setStartDate] =
    useState("")

  const [endDate, setEndDate] =
    useState("")


  const [statement, setStatement] =
    useState<AccountStatementResponse | null>(
      null
    )


  const [loading, setLoading] =
    useState(false)

  const [error, setError] =
    useState("")


  const handleGenerate = async (
    event: FormEvent
  ) => {

    event.preventDefault()


    if (
      !accountNumber.trim() ||
      !startDate ||
      !endDate
    ) {

      setError(
        "Please enter account number and both dates."
      )

      return
    }


    if (startDate > endDate) {

      setError(
        "Start date cannot be after end date."
      )

      return
    }


    try {

      setLoading(true)
      setError("")
      setStatement(null)


      const data =
        await getAccountStatement(

          accountNumber.trim(),

          `${startDate}T00:00:00`,

          `${endDate}T23:59:59`

        )


      setStatement(data)

    } catch (error: any) {

      console.error(error)


      setError(
        error.response?.data?.message ||
        "Unable to generate statement"
      )

    } finally {

      setLoading(false)
    }
  }


  const credits =
    statement?.transactions
      .filter(
        (transaction) =>
          transaction.transactionType ===
            "DEPOSIT" ||
          transaction.transactionType ===
            "TRANSFER_IN"
      )
      .reduce(
        (total, transaction) =>
          total + transaction.amount,
        0
      ) ?? 0


  const debits =
    statement?.transactions
      .filter(
        (transaction) =>
          transaction.transactionType ===
            "WITHDRAWAL" ||
          transaction.transactionType ===
            "TRANSFER_OUT"
      )
      .reduce(
        (total, transaction) =>
          total + transaction.amount,
        0
      ) ?? 0


  return (
    <>

      <PageHeader
        eyebrow="Statements"
        title="Account Statement"
        description="Generate an account statement for a selected date range."
      />


      <form
        className="panel form-panel mb-6"
        onSubmit={handleGenerate}
      >

        <div className="form-grid">


          <label>
            Account Number *

            <input
              value={accountNumber}
              onChange={(event) => {
                setAccountNumber(
                  event.target.value
                )

                setStatement(null)
              }}
              placeholder="Enter account number"
              required
            />
          </label>


          <label>
            Start Date *

            <input
              type="date"
              value={startDate}
              onChange={(event) => {
                setStartDate(
                  event.target.value
                )

                setStatement(null)
              }}
              required
            />
          </label>


          <label>
            End Date *

            <input
              type="date"
              value={endDate}
              onChange={(event) => {
                setEndDate(
                  event.target.value
                )

                setStatement(null)
              }}
              required
            />
          </label>

        </div>


        <div className="form-actions">

          <button
            type="submit"
            className="primary-btn"
            disabled={loading}
          >

            <FileText size={16} />

            {loading
              ? "Generating..."
              : "Generate Statement"}

          </button>

        </div>

      </form>


      {error && (

        <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded text-red-600 text-sm">

          {error}

        </div>

      )}


      {statement && (

        <>

          {/* STATEMENT INFORMATION */}

          <section className="panel form-panel mb-5">

            <div className="flex justify-between gap-5 flex-wrap">

              <div>

                <div className="eyebrow">
                  CoreBank Account Statement
                </div>

                <h2 className="text-xl font-semibold">
                  {statement.customerName}
                </h2>

                <p className="text-sm text-slate-500 mt-3">
                  Customer ID:{" "}
                  {statement.customerId}
                </p>

                <p className="text-sm text-slate-500">
                  Account Number:{" "}
                  {statement.accountNumber}
                </p>

                <p className="text-sm text-slate-500">
                  Account Type:{" "}
                  {statement.accountType}
                </p>

                <p className="text-sm text-slate-500">
                  Statement Period:{" "}
                  {new Date(
                    statement.statementFrom
                  ).toLocaleDateString()}
                  {" - "}
                  {new Date(
                    statement.statementTo
                  ).toLocaleDateString()}
                </p>

              </div>


              <button
                className="secondary-btn"
                onClick={() =>
                  window.print()
                }
              >
                <Printer size={16} />
                Print Statement
              </button>

            </div>

          </section>


          {/* SUMMARY */}

          <div className="metric-grid">

            <SummaryCard
              label="Opening Balance"
              value={
                statement.openingBalance
              }
            />

            <SummaryCard
              label="Total Credits"
              value={credits}
            />

            <SummaryCard
              label="Total Debits"
              value={debits}
            />

            <SummaryCard
              label="Closing Balance"
              value={
                statement.closingBalance
              }
            />

          </div>


          {/* TRANSACTIONS */}

          <section className="panel">

            <div className="panel-heading">

              <div>

                <h2>
                  Statement Transactions
                </h2>

                <span className="panel-subtitle">

                  {
                    statement.transactions
                      .length
                  }{" "}
                  transactions

                </span>

              </div>

            </div>


            <div className="table-wrap">

              {statement.transactions.length >
              0 ? (

                <table>

                  <thead>

                    <tr>
                      <th>Date</th>
                      <th>Transaction ID</th>
                      <th>Type</th>
                      <th>Description</th>
                      <th>Debit</th>
                      <th>Credit</th>
                      <th>Balance</th>
                      <th>Status</th>
                    </tr>

                  </thead>


                  <tbody>

                    {statement.transactions.map(
                      (transaction) => {

                        const credit =
                          transaction.transactionType ===
                            "DEPOSIT" ||
                          transaction.transactionType ===
                            "TRANSFER_IN"


                        return (

                          <tr
                            key={
                              transaction.transactionId
                            }
                          >

                            <td className="muted-cell">

                              {new Date(
                                transaction.transactionDate
                              ).toLocaleString()}

                            </td>


                            <td className="mono">

                              {
                                transaction.transactionId
                              }

                            </td>


                            <td>

                              <StatusBadge>
                                {
                                  transaction.transactionType
                                }
                              </StatusBadge>

                            </td>


                            <td>

                              {
                                transaction.description
                              }

                            </td>


                            <td>

                              {!credit
                                ? money(
                                    transaction.amount
                                  )
                                : "-"}

                            </td>


                            <td className="amount">

                              {credit
                                ? money(
                                    transaction.amount
                                  )
                                : "-"}

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

              ) : (

                <EmptyState
                  title="No transactions"
                  description="No transactions were found for the selected period."
                />

              )}

            </div>

          </section>

        </>

      )}

    </>
  )
}


function SummaryCard({
  label,
  value,
}: {
  label: string
  value: number
}) {

  return (

    <div className="metric-card">

      <div className="metric-copy">

        <span>
          {label}
        </span>

        <strong>
          {money(value)}
        </strong>

      </div>

    </div>

  )
}


export default StatementsPage