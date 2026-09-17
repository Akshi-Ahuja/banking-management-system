import {
  useEffect,
  useState,
  type FormEvent,
} from "react"

import {
  ArrowLeftRight,
  CheckCircle2,
  ChevronRight,
  ShieldCheck,
} from "lucide-react"

import { useSearchParams } from "react-router"

import PageHeader from "../../components/common/PageHeader"
import AccountBalanceCard from "../../components/common/AccountBalanceCard"

import {
  transferMoney,
} from "../../services/transactionService"

import {
  getAccountByNumber,
} from "../../services/accountService"

import type {
  AccountResponse,
} from "../../types/account"

import type {
  TransferResponse,
} from "../../types/transaction"


function TransferPage() {

  const [searchParams] =
    useSearchParams()


  const senderFromUrl =
    searchParams.get(
      "accountNumber"
    ) || ""


  const [
    senderAccountNumber,
    setSenderAccountNumber,
  ] = useState(
    senderFromUrl
  )


  const [
    receiverAccountNumber,
    setReceiverAccountNumber,
  ] = useState("")


  const [amount, setAmount] =
    useState("")

  const [description, setDescription] =
    useState("")


  const [senderAccount, setSenderAccount] =
    useState<AccountResponse | null>(
      null
    )


  const [result, setResult] =
    useState<TransferResponse | null>(
      null
    )


  const [saving, setSaving] =
    useState(false)

  const [error, setError] =
    useState("")


  const loadSender = async (
    number: string
  ) => {

    if (!number.trim()) {

      setSenderAccount(null)

      return
    }


    try {

      const data =
        await getAccountByNumber(
          number.trim()
        )

      setSenderAccount(data)

    } catch (error) {

      console.error(error)

      setSenderAccount(null)
    }
  }


  useEffect(() => {

    if (senderFromUrl) {
      loadSender(
        senderFromUrl
      )
    }

  }, [senderFromUrl])


  const handleSubmit = async (
    event: FormEvent
  ) => {

    event.preventDefault()


    if (
      senderAccountNumber.trim() ===
      receiverAccountNumber.trim()
    ) {

      setError(
        "Sender and receiver accounts cannot be the same."
      )

      return
    }


    try {

      setSaving(true)
      setError("")
      setResult(null)


      const transfer =
        await transferMoney({
          senderAccountNumber:
            senderAccountNumber.trim(),

          receiverAccountNumber:
            receiverAccountNumber.trim(),

          amount:
            Number(amount),

          description:
            description.trim(),
        })


      setResult(transfer)


      await loadSender(
        senderAccountNumber
      )


      setAmount("")
      setDescription("")

    } catch (error: any) {

      console.error(error)


      setError(
        error.response?.data?.message ||
        "Unable to transfer money"
      )

    } finally {

      setSaving(false)
    }
  }


  const transferRows =
    result
      ? Array.isArray(result)
        ? result
        : [result]
      : []


  return (
    <>

      <PageHeader
        eyebrow="Transactions / Transfer"
        title="Transfer Funds"
        description="Move money securely between customer accounts."
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
              <ArrowLeftRight
                size={22}
              />
            </div>

            <div>
              <h2>
                Transfer Details
              </h2>

              <p>
                Enter sender, receiver and transfer information.
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
                Sender Account Number *

                <input
                  value={
                    senderAccountNumber
                  }
                  onChange={(event) => {

                    setSenderAccountNumber(
                      event.target.value
                    )

                    setResult(null)

                  }}
                  onBlur={() =>
                    loadSender(
                      senderAccountNumber
                    )
                  }
                  required
                />
              </label>


              <label>
                Receiver Account Number *

                <input
                  value={
                    receiverAccountNumber
                  }
                  onChange={(event) =>
                    setReceiverAccountNumber(
                      event.target.value
                    )
                  }
                  required
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
                  placeholder="Add a note for this transfer"
                />

              </label>

            </div>


            <div className="rule-note">

              <ShieldCheck
                size={18}
              />

              <div>

                <strong>
                  Transfer Validation
                </strong>

                <p>
                  Sender and receiver must be different accounts and the sender must have sufficient available balance.
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
                : "Confirm Transfer"}

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
                  Transfer Successful
                </strong>

              </div>


              {transferRows.map(
                (
                  transaction,
                  index
                ) => (

                  <div
                    key={
                      transaction.transactionId ||
                      index
                    }
                    className="grid grid-cols-2 gap-2 text-sm mb-4"
                  >

                    <span>
                      Transaction ID
                    </span>

                    <strong>
                      {
                        transaction.transactionId
                      }
                    </strong>


                    <span>
                      Type
                    </span>

                    <strong>
                      {
                        transaction.transactionType
                      }
                    </strong>


                    <span>
                      Transfer ID
                    </span>

                    <strong>
                      {
                        transaction.transferId ??
                        "-"
                      }
                    </strong>


                    <span>
                      Amount
                    </span>

                    <strong>
                      ₹
                      {transaction.amount.toLocaleString(
                        "en-IN"
                      )}
                    </strong>

                  </div>

                )
              )}

            </div>

          )}

        </section>


        {senderAccount && (

          <AccountBalanceCard
            accountNumber={
              senderAccount.accountNumber
            }
            customerName={
              senderAccount.customerName
            }
            accountType={
              senderAccount.accountType
            }
            balance={
              senderAccount.balance
            }
            overdraftLimit={
              senderAccount.overdraftLimit
            }
            status={
              senderAccount.status
            }
          />

        )}

      </div>

    </>
  )
}

export default TransferPage