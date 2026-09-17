import {
  useEffect,
  useState,
  type ChangeEvent,
  type FormEvent,
} from "react"

import { ChevronRight } from "lucide-react"

import {
  useNavigate,
  useParams,
} from "react-router"

import PageHeader from "../../components/common/PageHeader"
import EmptyState from "../../components/common/EmptyState"

import {
  getCustomerById,
  updateCustomer,
} from "../../services/customerService"


function EditCustomerPage() {

  const navigate = useNavigate()

  const { customerId } = useParams()


  // FORM DATA
  const [formData, setFormData] =
    useState({
      fullName: "",
      email: "",
      phoneNumber: "",
      address: "",
      dateOfBirth: "",
    })


  // PAGE STATES
  const [loading, setLoading] =
    useState(true)

  const [saving, setSaving] =
    useState(false)

  const [error, setError] =
    useState("")


  // LOAD CUSTOMER FROM BACKEND
  useEffect(() => {

    if (!customerId) {
      setLoading(false)
      setError("Customer ID is missing.")
      return
    }


    const loadCustomer = async () => {

      try {

        setLoading(true)
        setError("")


        const customer =
          await getCustomerById(
            customerId
          )


        // FILL FORM WITH CUSTOMER DATA
        setFormData({
          fullName:
            customer.fullName,

          email:
            customer.email,

          phoneNumber:
            customer.phoneNumber,

          address:
            customer.address,

          dateOfBirth:
            customer.dateOfBirth,
        })

      } catch (error) {

        console.error(error)

        setError(
          "Unable to load customer details."
        )

      } finally {

        setLoading(false)
      }

    }


    loadCustomer()

  }, [customerId])


  // INPUT CHANGE
  const handleChange = (
    event: ChangeEvent<
      HTMLInputElement |
      HTMLTextAreaElement
    >
  ) => {

    const {
      name,
      value,
    } = event.target


    setFormData({
      ...formData,
      [name]: value,
    })
  }


  // UPDATE CUSTOMER
  const handleSubmit = async (
    event: FormEvent
  ) => {

    event.preventDefault()


    if (!customerId) {
      return
    }


    try {

      setSaving(true)
      setError("")


      await updateCustomer(
        customerId,
        formData
      )


      alert(
        "Customer updated successfully"
      )


      navigate(
        `/customers/${customerId}`
      )

    } catch (error: any) {

      console.error(error)


      const message =
        error.response?.data?.message ||
        "Unable to update customer"


      setError(message)

    } finally {

      setSaving(false)
    }
  }


  // LOADING
  if (loading) {

    return (
      <div className="empty-state">
        <p>
          Loading customer...
        </p>
      </div>
    )
  }


  // CUSTOMER LOAD ERROR
  if (
    error &&
    !formData.fullName
  ) {

    return (
      <EmptyState
        title="Unable to load customer"
        description={error}
      />
    )
  }


  return (
    <>

      {/* PAGE HEADER */}

      <PageHeader
        eyebrow="Customers / Edit"
        title="Edit Customer"
        description={`Update customer information for ${customerId}.`}
      />


      {/* ERROR MESSAGE */}

      {error && (

        <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded text-red-600 text-sm">

          {error}

        </div>

      )}


      {/* EDIT FORM */}

      <form
        className="panel form-panel wide-form"
        onSubmit={handleSubmit}
      >

        <div className="form-grid">


          {/* FULL NAME */}

          <label>

            Full Name *

            <input
              type="text"
              name="fullName"
              value={
                formData.fullName
              }
              onChange={
                handleChange
              }
              placeholder="Enter full name"
              required
            />

          </label>


          {/* EMAIL */}

          <label>

            Email Address *

            <input
              type="email"
              name="email"
              value={
                formData.email
              }
              onChange={
                handleChange
              }
              placeholder="name@email.com"
              required
            />

          </label>


          {/* PHONE */}

          <label>

            Phone Number *

            <input
              type="text"
              name="phoneNumber"
              value={
                formData.phoneNumber
              }
              onChange={
                handleChange
              }
              placeholder="9876543210"
              required
            />

          </label>


          {/* DATE OF BIRTH */}

          <label>

            Date of Birth *

            <input
              type="date"
              name="dateOfBirth"
              value={
                formData.dateOfBirth
              }
              onChange={
                handleChange
              }
              required
            />

          </label>


          {/* ADDRESS */}

          <label className="full">

            Address *

            <textarea
              name="address"
              rows={3}
              value={
                formData.address
              }
              onChange={
                handleChange
              }
              placeholder="Enter full address"
              required
            />

          </label>

        </div>


        {/* ACTION BUTTONS */}

        <div className="form-actions">

          <button
            type="button"
            className="secondary-btn"
            disabled={saving}
            onClick={() =>
              navigate(
                `/customers/${customerId}`
              )
            }
          >
            Cancel
          </button>


          <button
            type="submit"
            className="primary-btn"
            disabled={saving}
          >

            {saving
              ? "Saving..."
              : "Save Changes"}

            {!saving && (
              <ChevronRight
                size={17}
              />
            )}

          </button>

        </div>

      </form>

    </>
  )
}

export default EditCustomerPage