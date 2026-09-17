import {
  useEffect,
  useState,
} from "react"

import {
  ArrowDownToLine,
  ArrowLeftRight,
  ArrowUpFromLine,
  FileText,
  Pencil,
  Snowflake,
  XCircle,
} from "lucide-react"

import {
  useNavigate,
  useParams,
} from "react-router"

import PageHeader from "../../components/common/PageHeader"
import StatusBadge from "../../components/common/StatusBadge"
import EmptyState from "../../components/common/EmptyState"
import AccountBalanceCard from "../../components/common/AccountBalanceCard"

import {
  closeAccount,
  deactivateAccount,
  getAccountByNumber,
} from "../../services/accountService"

import type {
  AccountResponse,
} from "../../types/account"


function money(value: number) {
  return `₹${value.toLocaleString("en-IN")}`
}


function AccountDetailsPage() {

  const navigate = useNavigate()

  const { accountNumber } =
    useParams()


  const [account, setAccount] =
    useState<AccountResponse | null>(
      null
    )

  const [loading, setLoading] =
    useState(true)

  const [error, setError] =
    useState("")


  useEffect(() => {

    if (!accountNumber) {

      setLoading(false)

      return
    }


    const loadAccount =
      async () => {

        try {

          setLoading(true)
          setError("")


          const data =
            await getAccountByNumber(
              accountNumber
            )


          setAccount(data)

        } catch (error) {

          console.error(error)

          setError(
            "Unable to load account"
          )

        } finally {

          setLoading(false)
        }
      }


    loadAccount()

  }, [accountNumber])


  const handleFreeze = async () => {

    if (!account) return


    const confirmed =
      window.confirm(
        "Freeze this account?"
      )


    if (!confirmed) return


    try {

      const updated =
        await deactivateAccount(
          account.accountNumber
        )


      setAccount(updated)

      alert(
        "Account frozen successfully"
      )

    } catch (error: any) {

      alert(
        error.response?.data?.message ||
        "Unable to freeze account"
      )
    }
  }


  const handleClose = async () => {

    if (!account) return


    const confirmed =
      window.confirm(
        "Close this account? Balance must be zero."
      )


    if (!confirmed) return


    try {

      const updated =
        await closeAccount(
          account.accountNumber
        )


      setAccount(updated)

      alert(
        "Account closed successfully"
      )

    } catch (error: any) {

      alert(
        error.response?.data?.message ||
        "Unable to close account"
      )
    }
  }


  if (loading) {

    return (
      <div className="empty-state">
        <p>Loading account...</p>
      </div>
    )
  }


  if (error || !account) {

    return (
      <EmptyState
        title="Account not found"
        description={
          error ||
          "The requested account does not exist."
        }
      />
    )
  }


  return (
    <>

      <PageHeader
        eyebrow="Accounts / Details"
        title={`Account ${account.accountNumber}`}
        description={`${account.customerName} • ${account.accountId}`}
        action={

          <div className="flex gap-2 flex-wrap">

            <button
              className="secondary-btn"
              onClick={() =>
                navigate(
                  `/accounts/${account.accountNumber}/edit`
                )
              }
            >
              <Pencil size={16} />
              Update
            </button>


            {account.status ===
              "ACTIVE" && (

              <button
                className="secondary-btn"
                onClick={
                  handleFreeze
                }
              >
                <Snowflake
                  size={16}
                />
                Freeze
              </button>

            )}


            {account.status !==
              "CLOSED" && (

              <button
                className="secondary-btn"
                onClick={
                  handleClose
                }
              >
                <XCircle
                  size={16}
                />
                Close
              </button>

            )}

          </div>
        }
      />


      <div className="operation-layout">

        <section className="panel form-panel">

          <div className="flex items-center justify-between mb-7">

            <div>

              <h2 className="text-base font-semibold">
                Account Information
              </h2>

              <p className="text-xs text-slate-500 mt-1">
                Banking and ownership details
              </p>

            </div>


            <div className="flex gap-2">

              <StatusBadge>
                {account.accountType}
              </StatusBadge>

              <StatusBadge>
                {account.status}
              </StatusBadge>

            </div>

          </div>


          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

            <Detail
              label="Account ID"
              value={
                account.accountId
              }
            />

            <Detail
              label="Account Number"
              value={
                account.accountNumber
              }
            />

            <Detail
              label="Customer"
              value={
                account.customerName
              }
            />

            <Detail
              label="Customer ID"
              value={
                account.customerId
              }
            />

            <Detail
              label="Account Type"
              value={
                account.accountType
              }
            />

            <Detail
              label="Balance"
              value={
                money(
                  account.balance
                )
              }
            />

            <Detail
              label="Overdraft Limit"
              value={
                money(
                  account.overdraftLimit
                )
              }
            />

            <Detail
              label="Status"
              value={
                account.status
              }
            />

            <Detail
              label="Opened At"
              value={
                new Date(
                  account.openedAt
                ).toLocaleString()
              }
            />

            <Detail
              label="Updated At"
              value={
                new Date(
                  account.updatedAt
                ).toLocaleString()
              }
            />

          </div>


          <div className="form-actions flex-wrap">

            <button
              className="secondary-btn"
              onClick={() =>
                navigate(
                  `/transactions/deposit?accountNumber=${account.accountNumber}`
                )
              }
            >
              <ArrowDownToLine
                size={16}
              />
              Deposit
            </button>


            <button
              className="secondary-btn"
              onClick={() =>
                navigate(
                  `/transactions/withdraw?accountNumber=${account.accountNumber}`
                )
              }
            >
              <ArrowUpFromLine
                size={16}
              />
              Withdraw
            </button>


            <button
              className="secondary-btn"
              onClick={() =>
                navigate(
                  `/transactions/transfer?accountNumber=${account.accountNumber}`
                )
              }
            >
              <ArrowLeftRight
                size={16}
              />
              Transfer
            </button>


            <button
              className="secondary-btn"
              onClick={() =>
                navigate(
                  `/transactions/history?accountNumber=${account.accountNumber}`
                )
              }
            >
              Transaction History
            </button>


            <button
              className="primary-btn"
              onClick={() =>
                navigate(
                  `/statements?accountNumber=${account.accountNumber}`
                )
              }
            >
              <FileText size={16} />
              Statement
            </button>

          </div>

        </section>


        <AccountBalanceCard
          accountNumber={
            account.accountNumber
          }
          customerName={
            account.customerName
          }
          accountType={
            account.accountType
          }
          balance={
            account.balance
          }
          overdraftLimit={
            account.overdraftLimit
          }
          status={
            account.status
          }
        />

      </div>

    </>
  )
}


function Detail({
  label,
  value,
}: {
  label: string
  value: string
}) {

  return (
    <div>

      <span className="text-xs text-slate-400">
        {label}
      </span>

      <p className="text-sm font-medium mt-1">
        {value}
      </p>

    </div>
  )
}


export default AccountDetailsPage