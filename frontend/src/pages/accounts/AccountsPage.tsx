import {
  useEffect,
  useState,
} from "react"

import {
  Eye,
  Pencil,
  Plus,
  Search,
} from "lucide-react"

import { useNavigate } from "react-router"

import PageHeader from "../../components/common/PageHeader"
import StatusBadge from "../../components/common/StatusBadge"
import EmptyState from "../../components/common/EmptyState"
import TableShell from "../../components/common/TableShell"

import {
  getAllAccounts,
  searchAccounts,
} from "../../services/accountService"

import type {
  AccountResponse,
  AccountStatus,
} from "../../types/account"


function money(value: number) {
  return `₹${value.toLocaleString("en-IN")}`
}


function AccountsPage() {

  const navigate = useNavigate()

  const [accounts, setAccounts] =
    useState<AccountResponse[]>([])

  const [query, setQuery] =
    useState("")

  const [statusFilter, setStatusFilter] =
    useState<"ALL" | AccountStatus>("ALL")

  const [loading, setLoading] =
    useState(true)

  const [error, setError] =
    useState("")


  const loadAccounts = async () => {

    try {

      setLoading(true)
      setError("")

      const data =
        await getAllAccounts()

      setAccounts(data)

    } catch (error) {

      console.error(error)

      setError(
        "Unable to load accounts"
      )

    } finally {

      setLoading(false)
    }
  }


  useEffect(() => {

    loadAccounts()

  }, [])


  const handleSearch = async () => {

    try {

      setLoading(true)
      setError("")


      if (!query.trim()) {

        const data =
          await getAllAccounts()

        setAccounts(data)

        return
      }


      const data =
        await searchAccounts(query)

      setAccounts(data)

    } catch (error) {

      console.error(error)

      setError(
        "Unable to search accounts"
      )

    } finally {

      setLoading(false)
    }
  }


  const visibleAccounts =
    statusFilter === "ALL"
      ? accounts
      : accounts.filter(
          (account) =>
            account.status ===
            statusFilter
        )


  return (
    <>

      <PageHeader
        eyebrow="Portfolio"
        title="Accounts"
        description="View and manage customer deposit accounts."
        action={
          <button
            className="primary-btn"
            onClick={() =>
              navigate("/accounts/new")
            }
          >
            <Plus size={17} />
            Create Account
          </button>
        }
      />


      <div className="toolbar">

        <div className="search-field">

          <Search size={17} />

          <input
            placeholder="Search by account number, ID or customer"
            value={query}
            onChange={(event) =>
              setQuery(event.target.value)
            }
            onKeyDown={(event) => {

              if (event.key === "Enter") {
                handleSearch()
              }

            }}
          />

        </div>


        <button
          className="secondary-btn"
          onClick={handleSearch}
        >
          Search
        </button>


        <select
          className="secondary-btn"
          value={statusFilter}
          onChange={(event) =>
            setStatusFilter(
              event.target.value as
                | "ALL"
                | AccountStatus
            )
          }
        >
          <option value="ALL">
            All Statuses
          </option>

          <option value="ACTIVE">
            ACTIVE
          </option>

          <option value="FROZEN">
            FROZEN
          </option>

          <option value="CLOSED">
            CLOSED
          </option>
        </select>

      </div>


      {error && (

        <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded text-red-600 text-sm">
          {error}
        </div>

      )}


      <TableShell
        title="Accounts"
        action={
          <span className="table-count">
            {visibleAccounts.length} records
          </span>
        }
      >

        {loading ? (

          <div className="empty-state">
            <p>Loading accounts...</p>
          </div>

        ) : visibleAccounts.length > 0 ? (

          <table>

            <thead>
              <tr>
                <th>Account</th>
                <th>Customer</th>
                <th>Type</th>
                <th>Balance</th>
                <th>Overdraft</th>
                <th>Status</th>
                <th>Opened At</th>
                <th>Actions</th>
              </tr>
            </thead>


            <tbody>

              {visibleAccounts.map(
                (account) => (

                  <tr
                    key={
                      account.accountId
                    }
                  >

                    <td>

                      <strong className="mono">
                        {
                          account.accountNumber
                        }
                      </strong>

                      <span className="sub-cell mono">
                        {account.accountId}
                      </span>

                    </td>


                    <td>

                      <strong>
                        {
                          account.customerName
                        }
                      </strong>

                      <span className="sub-cell">
                        {
                          account.customerId
                        }
                      </span>

                    </td>


                    <td>
                      <StatusBadge>
                        {account.accountType}
                      </StatusBadge>
                    </td>


                    <td className="amount">
                      {money(
                        account.balance
                      )}
                    </td>


                    <td className="muted-cell">
                      {money(
                        account.overdraftLimit
                      )}
                    </td>


                    <td>
                      <StatusBadge>
                        {account.status}
                      </StatusBadge>
                    </td>


                    <td className="muted-cell">
                      {new Date(
                        account.openedAt
                      ).toLocaleDateString()}
                    </td>


                    <td>

                      <div className="flex gap-2">

                        <button
                          className="icon-btn"
                          onClick={() =>
                            navigate(
                              `/accounts/${account.accountNumber}`
                            )
                          }
                        >
                          <Eye size={17} />
                        </button>


                        <button
                          className="icon-btn"
                          onClick={() =>
                            navigate(
                              `/accounts/${account.accountNumber}/edit`
                            )
                          }
                        >
                          <Pencil size={16} />
                        </button>

                      </div>

                    </td>

                  </tr>

                )
              )}

            </tbody>

          </table>

        ) : (

          <EmptyState
            title="No accounts found"
            description="No matching account records were found."
          />

        )}

      </TableShell>

    </>
  )
}

export default AccountsPage