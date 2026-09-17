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
import TableShell from "../../components/common/TableShell"
import EmptyState from "../../components/common/EmptyState"

import {
  getAllCustomers,
  searchCustomers,
} from "../../services/customerService"

import type {
  CustomerResponse,
} from "../../types/customer"


function CustomersPage() {

  const navigate = useNavigate()

  const [customers, setCustomers] =
    useState<CustomerResponse[]>([])

  const [query, setQuery] =
    useState("")

  const [loading, setLoading] =
    useState(true)

  const [error, setError] =
    useState("")


  // LOAD CUSTOMERS
  const loadCustomers = async () => {

    try {

      setLoading(true)
      setError("")

      const data =
        await getAllCustomers()

      setCustomers(data)

    } catch (error) {

      console.error(error)

      setError(
        "Unable to load customers"
      )

    } finally {

      setLoading(false)
    }
  }


  useEffect(() => {

    loadCustomers()

  }, [])


  // SEARCH CUSTOMER
  const handleSearch = async () => {

    if (!query.trim()) {

      loadCustomers()

      return
    }


    try {

      setLoading(true)

      const data =
        await searchCustomers(query)

      setCustomers(data)

    } catch (error) {

      console.error(error)

      setError(
        "Unable to search customers"
      )

    } finally {

      setLoading(false)
    }
  }


  return (
    <>

      <PageHeader
        eyebrow="Directory"
        title="Customers"
        description="Manage customer profiles and their banking relationships."
        action={
          <button
            className="primary-btn"
            onClick={() =>
              navigate("/customers/new")
            }
          >
            <Plus size={17} />
            Add Customer
          </button>
        }
      />


      <div className="toolbar">

        <div className="search-field">

          <Search size={17} />

          <input
            value={query}
            placeholder="Search by name, ID, email or phone"
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

      </div>


      {error && (

        <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded text-red-600 text-sm">
          {error}
        </div>

      )}


      <TableShell
        title="Customers"
        action={
          <span className="table-count">
            {customers.length} records
          </span>
        }
      >

        {loading ? (

          <div className="empty-state">
            <p>Loading customers...</p>
          </div>

        ) : customers.length > 0 ? (

          <table>

            <thead>
              <tr>
                <th>Customer</th>
                <th>Customer ID</th>
                <th>Email</th>
                <th>Phone</th>
                <th>Date of Birth</th>
                <th>Status</th>
                <th>Created At</th>
                <th>Actions</th>
              </tr>
            </thead>


            <tbody>

              {customers.map(
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

                    <tr
                      key={
                        customer.customerId
                      }
                    >

                      <td>

                        <div className="person-cell">

                          <div className="avatar small">
                            {initials}
                          </div>

                          <strong>
                            {customer.fullName}
                          </strong>

                        </div>

                      </td>


                      <td className="mono muted-cell">
                        {customer.customerId}
                      </td>


                      <td className="muted-cell">
                        {customer.email}
                      </td>


                      <td className="muted-cell">
                        {customer.phoneNumber}
                      </td>


                      <td className="muted-cell">
                        {customer.dateOfBirth}
                      </td>


                      <td>
                        <StatusBadge>
                          {customer.status}
                        </StatusBadge>
                      </td>


                      <td className="muted-cell">
                        {new Date(
                          customer.createdAt
                        ).toLocaleDateString()}
                      </td>


                      <td>

                        <div className="flex gap-2">

                          <button
                            className="icon-btn"
                            onClick={() =>
                              navigate(
                                `/customers/${customer.customerId}`
                              )
                            }
                          >
                            <Eye size={17} />
                          </button>


                          <button
                            className="icon-btn"
                            onClick={() =>
                              navigate(
                                `/customers/${customer.customerId}/edit`
                              )
                            }
                          >
                            <Pencil size={16} />
                          </button>

                        </div>

                      </td>

                    </tr>

                  )
                }
              )}

            </tbody>

          </table>

        ) : (

          <EmptyState
            title="No customers found"
            description="No matching customer records were found."
          />

        )}

      </TableShell>

    </>
  )
}

export default CustomersPage