import {
  useEffect,
  useState,
  type FormEvent,
} from "react"

import {
  ArrowUpFromLine,
  CheckCircle2,
  ChevronRight,
  ShieldCheck,
} from "lucide-react"

import { useSearchParams } from "react-router"

import PageHeader from "../../components/common/PageHeader"
import AccountBalanceCard from "../../components/common/AccountBalanceCard"
import StatusBadge from "../../components/common/StatusBadge"

import {
  withdrawMoney,
} from "../../services/transactionService"

import {
  getAccountByNumber,
} from "../../services/accountService"

import type {
  AccountResponse,
} from "../../types/account"

import type {
  TransactionResponse,
} from "../../types/transaction"


function WithdrawPage() {

  const [searchParams] =
    useSearchParams()


  const accountFromUrl =
    searchParams.get(
      "accountNumber"
    ) || ""


  const [accountNumber, setAccountNumber] =
    useState(accountFromUrl)

  const [amount, setAmount] =
    useState("")

  const [description, setDescription] =
    useState("")

  const [selectedAccount, setSelectedAccount] =
    useState<AccountResponse | null>(
      null
    )

  const [result, setResult] =
    useState<TransactionResponse | null>(
      null
    )

  const [saving, setSaving] =
    useState(false)

  const [error, setError] =
    useState("")


  const loadAccount = async (
    number: string
  ) => {

    if (!number.trim()) {

      setSelectedAccount(null)

      return
    }


    try {

      const data =
        await getAccountByNumber(
          number.trim()
        )

      setSelectedAccount(data)

    } catch (error) {

      console.error(error)

      setSelectedAccount(null)
    }
  }


  useEffect(() => {

    if (accountFromUrl) {
      loadAccount(accountFromUrl)
    }

  }, [accountFromUrl])


  const handleSubmit = async (
    event: FormEvent
  ) => {

    event.preventDefault()


    try {

      setSaving(true)
      setError("")
      setResult(null)


      const transaction =
        await withdrawMoney({
          accountNumber:
            accountNumber.trim(),

          amount:
            Number(amount),

          description:
            description.trim(),
        })


      setResult(transaction)


      await loadAccount(
        accountNumber
      )


      setAmount("")
      setDescription("")

    } catch (error: any) {

      console.error(error)

      setError(
        error.response?.data?.message ||
        "Unable to withdraw money"
      )

    } finally {

      setSaving(false)
    }
  }


  return (
    <>

      <PageHeader
        eyebrow="Transactions / Withdrawal"
        title="Withdraw Money"
        description="Withdraw funds from a customer account."
      />


      {error && (

        <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded text-red-600 text-sm">
          {error}
        </div>

      )}


      <div className="operation-layout">

        <section className="panel form-panel">

          <div className="form-heading">

            <div className="operation-icon">
              <ArrowUpFromLine
                size={22}
              />
            </div>

            <div>

              <h2>
                Withdrawal Details
              </h2>

              <p>
                Enter account and withdrawal information.
              </p>

            </div>

          </div>


          <form
            onSubmit={
              handleSubmit
            }
          >

            <div className="form-grid">

              <label>
                Account Number *

                <input
                  value={
                    accountNumber
                  }
                  onChange={(event) => {

                    setAccountNumber(
                      event.target.value
                    )

                    setResult(null)

                  }}
                  onBlur={() =>
                    loadAccount(
                      accountNumber
                    )
                  }
                  required
                  placeholder="12-digit account number"
                />
              </label>


              <label>
                Amount *

                <div className="input-prefix">

                  <span>₹</span>

                  <input
                    type="number"
                    min="0.01"
                    step="0.01"
                    value={amount}
                    onChange={(event) =>
                      setAmount(
                        event.target.value
                      )
                    }
                    required
                    placeholder="0.00"
                  />

                </div>
              </label>


              <label className="full">

                Description

                <textarea
                  rows={3}
                  value={description}
                  onChange={(event) =>
                    setDescription(
                      event.target.value
                    )
                  }
                  placeholder="Add a note for this withdrawal"
                />

              </label>

            </div>


            <div className="rule-note">

              <ShieldCheck
                size={18}
              />

              <div>

                <strong>
                  Withdrawal Rules
                </strong>

                <p>
                  Savings accounts cannot withdraw beyond their balance. Current accounts may use the available overdraft limit.
                </p>

              </div>

            </div>


            <button
              type="submit"
              className="primary-btn full-btn"
              disabled={saving}
            >

              {saving
                ? "Processing..."
                : "Withdraw Money"}

              {!saving && (
                <ChevronRight
                  size={17}
                />
              )}

            </button>

          </form>


          {result && (

            <div className="mt-5 p-4 rounded-lg bg-green-50 border border-green-200">

              <div className="flex items-center gap-2 mb-4">

                <CheckCircle2
                  size={20}
                  className="text-green-600"
                />

                <strong>
                  Withdrawal Successful
                </strong>

              </div>


              <div className="grid grid-cols-2 gap-3 text-sm">

                <span>
                  Transaction ID
                </span>

                <strong>
                  {result.transactionId}
                </strong>


                <span>Amount</span>

                <strong>
                  ₹
                  {result.amount.toLocaleString(
                    "en-IN"
                  )}
                </strong>


                <span>
                  Balance After
                </span>

                <strong>
                  ₹
                  {result.balanceAfterTransaction.toLocaleString(
                    "en-IN"
                  )}
                </strong>


                <span>Status</span>

                <StatusBadge>
                  {result.status}
                </StatusBadge>

              </div>

            </div>

          )}

        </section>


        {selectedAccount && (

          <AccountBalanceCard
            accountNumber={
              selectedAccount.accountNumber
            }
            customerName={
              selectedAccount.customerName
            }
            accountType={
              selectedAccount.accountType
            }
            balance={
              selectedAccount.balance
            }
            overdraftLimit={
              selectedAccount.overdraftLimit
            }
            status={
              selectedAccount.status
            }
          />

        )}

      </div>

    </>
  )
}

export default WithdrawPage