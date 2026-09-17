import {
  useEffect,
  useState,
} from "react"

import {
  ArrowLeftRight,
  ChevronRight,
  MoreHorizontal,
  Plus,
  ShieldCheck,
  Users,
  WalletCards,
} from "lucide-react"

import {
  useNavigate,
} from "react-router"

import PageHeader from "../components/common/PageHeader"
import MetricCard from "../components/common/MetricCard"
import StatusBadge from "../components/common/StatusBadge"

import {
  getAllCustomers,
} from "../services/customerService"

import {
  getAllAccounts,
} from "../services/accountService"

import {
  getTransactionHistory,
} from "../services/transactionService"

import type {
  CustomerResponse,
} from "../types/customer"

import type {
  AccountResponse,
} from "../types/account"

import type {
  TransactionResponse,
} from "../types/transaction"


function money(value: number) {

  return `₹${value.toLocaleString(
    "en-IN"
  )}`
}


function Dashboard() {

  const navigate = useNavigate()


  const [customers, setCustomers] =
    useState<CustomerResponse[]>([])

  const [accounts, setAccounts] =
    useState<AccountResponse[]>([])

  const [transactions, setTransactions] =
    useState<TransactionResponse[]>([])

  const [loading, setLoading] =
    useState(true)


  useEffect(() => {

    const loadDashboard = async () => {

      try {

        setLoading(true)


        const [
          customerData,
          accountData,
        ] =
          await Promise.all([
            getAllCustomers(),
            getAllAccounts(),
          ])


        setCustomers(
          customerData
        )

        setAccounts(
          accountData
        )


        /*
        Backend currently has transaction
        history per account rather than a
        global transaction endpoint.

        So for this internship dashboard,
        collect histories for all accounts.
        */

        const histories =
          await Promise.all(

            accountData.map(
              async (account) => {

                try {

                  return await getTransactionHistory(
                    account.accountNumber
                  )

                } catch {

                  return []
                }

              }
            )
          )


        const allTransactions =
          histories.flat()


        /*
        Sort newest first.
        */

        allTransactions.sort(
          (a, b) =>
            new Date(
              b.transactionDate
            ).getTime() -
            new Date(
              a.transactionDate
            ).getTime()
        )


        setTransactions(
          allTransactions
        )

      } catch (error) {

        console.error(
          "Dashboard error:",
          error
        )

      } finally {

        setLoading(false)
      }
    }


    loadDashboard()

  }, [])


  const activeAccounts =
    accounts.filter(
      (account) =>
        account.status ===
        "ACTIVE"
    )


  const savingsAccounts =
    accounts.filter(
      (account) =>
        account.accountType ===
        "SAVINGS"
    )


  const currentAccounts =
    accounts.filter(
      (account) =>
        account.accountType ===
        "CURRENT"
    )


  const savingsPercent =
    accounts.length
      ? (
          savingsAccounts.length /
          accounts.length *
          100
        ).toFixed(1)
      : "0"


  const currentPercent =
    accounts.length
      ? (
          currentAccounts.length /
          accounts.length *
          100
        ).toFixed(1)
      : "0"


  return (
    <>

      <PageHeader
        eyebrow="Overview"
        title="Good morning, Admin"
        description={
          loading
            ? "Loading banking operations..."
            : "Here's what's happening across your banking operations."
        }
        action={
          <button
            className="primary-btn"
            onClick={() =>
              navigate(
                "/transactions/deposit"
              )
            }
          >
            <Plus size={17} />
            New Transaction
          </button>
        }
      />


      {/* REAL COUNTS */}

      <div className="metric-grid">

        <MetricCard
          label="Total Customers"
          value={
            customers.length.toString()
          }
          detail="Registered customers"
          icon={Users}
          accent="blue"
        />


        <MetricCard
          label="Total Accounts"
          value={
            accounts.length.toString()
          }
          detail="Savings + Current"
          icon={WalletCards}
          accent="teal"
        />


        <MetricCard
          label="Active Accounts"
          value={
            activeAccounts.length.toString()
          }
          detail="Currently operational"
          icon={ShieldCheck}
          accent="violet"
        />


        <MetricCard
          label="Transactions"
          value={
            transactions.length.toString()
          }
          detail="Recorded transactions"
          icon={ArrowLeftRight}
          accent="amber"
        />

      </div>


      <div className="dashboard-grid">


        {/* RECENT TRANSACTIONS */}

        <section className="panel">

          <div className="panel-heading">

            <div>

              <h2>
                Recent Transactions
              </h2>

              <span className="panel-subtitle">
                Latest banking activity
              </span>

            </div>


            <button
              className="text-btn"
              onClick={() =>
                navigate(
                  "/transactions/history"
                )
              }
            >
              View History
              <ChevronRight
                size={15}
              />
            </button>

          </div>


          <div className="table-wrap">

            {transactions.length >
            0 ? (

              <table>

                <thead>
                  <tr>
                    <th>
                      Transaction ID
                    </th>

                    <th>
                      Account
                    </th>

                    <th>Type</th>

                    <th>Amount</th>

                    <th>Status</th>
                  </tr>
                </thead>


                <tbody>

                  {transactions
                    .slice(0, 5)
                    .map(
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


                            <td className="mono muted-cell">
                              {
                                transaction.accountNumber
                              }
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

              <div className="empty-state">

                <p>
                  No transactions yet.
                </p>

              </div>

            )}

          </div>

        </section>


        {/* ACCOUNT DISTRIBUTION */}

        <section className="panel distribution">

          <div className="panel-heading">

            <div>

              <h2>
                Account Distribution
              </h2>

              <span className="panel-subtitle">
                By account type
              </span>

            </div>

            <MoreHorizontal
              size={19}
            />

          </div>


          <div className="donut">

            <div className="donut-hole">

              <strong>
                {accounts.length}
              </strong>

              <span>
                Accounts
              </span>

            </div>

          </div>


          <div className="legend">

            <div>

              <span className="legend-dot savings" />

              <span>
                Savings Accounts
              </span>

              <strong>

                {
                  savingsAccounts.length
                }{" "}

                <small>
                  {savingsPercent}%
                </small>

              </strong>

            </div>


            <div>

              <span className="legend-dot current" />

              <span>
                Current Accounts
              </span>

              <strong>

                {
                  currentAccounts.length
                }{" "}

                <small>
                  {currentPercent}%
                </small>

              </strong>

            </div>

          </div>

        </section>

      </div>


      {/* RECENT CUSTOMERS */}

      <section className="panel customer-strip">

        <div className="panel-heading">

          <div>

            <h2>
              Recent Customers
            </h2>

            <span className="panel-subtitle">
              Latest registered customers
            </span>

          </div>


          <button
            className="text-btn"
            onClick={() =>
              navigate(
                "/customers"
              )
            }
          >
            View All

            <ChevronRight
              size={15}
            />
          </button>

        </div>


        <div className="customer-row">

          {customers
            .slice(-3)
            .reverse()
            .map(
              (customer) => {

                const initials =
                  customer.fullName
                    .split(" ")
                    .map(
                      (name) =>
                        name[0]
                    )
                    .join("")


                return (

                  <div
                    className="customer-mini"
                    key={
                      customer.customerId
                    }
                  >

                    <div className="avatar">
                      {initials}
                    </div>


                    <div>

                      <strong>
                        {
                          customer.fullName
                        }
                      </strong>

                      <span>
                        {
                          customer.customerId
                        }
                      </span>

                    </div>


                    <StatusBadge>
                      {
                        customer.status
                      }
                    </StatusBadge>

                  </div>

                )
              }
            )}

        </div>

      </section>

    </>
  )
}

export default Dashboard