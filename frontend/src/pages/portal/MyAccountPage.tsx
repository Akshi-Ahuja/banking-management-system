import {
  useEffect,
  useState,
} from "react"

import {
  ArrowDownToLine,
  ArrowLeftRight,
  ArrowUpFromLine,
  FileText,
  History,
} from "lucide-react"

import {
  useNavigate,
  useParams,
} from "react-router"

import AccountBalanceCard from "../../components/common/AccountBalanceCard"
import EmptyState from "../../components/common/EmptyState"
import StatusBadge from "../../components/common/StatusBadge"

import {
  getAccountByNumber,
} from "../../services/accountService"

import type {
  AccountResponse,
} from "../../types/account"


function money(value: number) {

  return `₹${value.toLocaleString(
    "en-IN"
  )}`
}


function MyAccountPage() {

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


    const loadAccount = async () => {

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
          "Account not found. Please check your account number."
        )

      } finally {

        setLoading(false)
      }

    }


    loadAccount()

  }, [accountNumber])


  if (loading) {

    return (
      <div className="empty-state">
        <p>Loading your account...</p>
      </div>
    )
  }


  if (error || !account) {

    return (
      <EmptyState
        title="Account Not Found"
        description={
          error ||
          "Unable to find this account."
        }
      />
    )
  }


  return (
    <>

      <div className="page-header">

        <div>

          <div className="eyebrow">
            MY ACCOUNT
          </div>

          <h1>
            Welcome, {account.customerName}
          </h1>

          <p>
            Manage your banking account and transactions.
          </p>

        </div>


        <StatusBadge>
          {account.status}
        </StatusBadge>

      </div>


      <div className="operation-layout">

        {/* ACCOUNT DETAILS */}

        <section className="panel form-panel">

          <h2 className="text-lg font-semibold mb-6">
            Account Details
          </h2>


          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

            <Detail
              label="Customer Name"
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
              label="Account Number"
              value={
                account.accountNumber
              }
            />

            <Detail
              label="Account Type"
              value={
                account.accountType
              }
            />

            <Detail
              label="Current Balance"
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

          </div>


          {/* BANKING ACTIONS */}

          <div className="mt-8">

            <h3 className="text-sm font-semibold mb-4">
              Banking Services
            </h3>


            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">


              <button
                className="secondary-btn"
                onClick={() =>
                  navigate(
                    `/portal/deposit?accountNumber=${account.accountNumber}`
                  )
                }
              >
                <ArrowDownToLine size={17} />
                Deposit Money
              </button>


              <button
                className="secondary-btn"
                onClick={() =>
                  navigate(
                    `/portal/withdraw?accountNumber=${account.accountNumber}`
                  )
                }
              >
                <ArrowUpFromLine size={17} />
                Withdraw Money
              </button>


              <button
                className="secondary-btn"
                onClick={() =>
                  navigate(
                    `/portal/transfer?accountNumber=${account.accountNumber}`
                  )
                }
              >
                <ArrowLeftRight size={17} />
                Transfer Money
              </button>


              <button
                className="secondary-btn"
                onClick={() =>
                  navigate(
                    `/portal/history?accountNumber=${account.accountNumber}`
                  )
                }
              >
                <History size={17} />
                Transaction History
              </button>


              <button
                className="primary-btn"
                onClick={() =>
                  navigate(
                    `/portal/statements?accountNumber=${account.accountNumber}`
                  )
                }
              >
                <FileText size={17} />
                Account Statement
              </button>

            </div>

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


export default MyAccountPage