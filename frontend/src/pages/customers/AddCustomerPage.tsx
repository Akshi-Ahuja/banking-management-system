import { useState } from "react"
import { ChevronRight, ShieldCheck } from "lucide-react"
import { useNavigate } from "react-router"

import PageHeader from "../../components/common/PageHeader"
import { createCustomer } from "../../services/customerService"

import {
  useLocation,
} from "react-router"


function AddCustomerPage() {

  const navigate = useNavigate()
  const location = useLocation()


  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    phoneNumber: "",
    address: "",
    dateOfBirth: "",
  })


  const handleChange = (
    event:
      React.ChangeEvent<
        HTMLInputElement | HTMLTextAreaElement
      >
  ) => {

    setFormData({
      ...formData,
      [event.target.name]: event.target.value,
    })
  }


  const handleSubmit = async (
        event: React.FormEvent
        ) => {

        event.preventDefault()


        try {

            const createdCustomer =
            await createCustomer(formData)

            alert(
            `Customer created successfully.\nCustomer ID: ${createdCustomer.customerId}`
            )

            if (
              location.pathname.startsWith(
                "/portal"
              )
            ) {

              navigate(
                `/portal/open-account?customerId=${createdCustomer.customerId}`
              )

            } else {

              navigate(
                `/customers/${createdCustomer.customerId}`
              )
            }

        } catch (error: any) {

            console.error(error)

            alert(
            error.response?.data?.message ||
            "Unable to create customer"
            )
        }
    }


  return (
    <>

      <PageHeader
        eyebrow="Customers / New"
        title="Add New Customer"
        description="Create a customer profile to begin their banking relationship."
      />


      <form
        className="panel form-panel wide-form"
        onSubmit={handleSubmit}
      >

        <div className="form-grid">


          <label>
            Full Name *

            <input
              name="fullName"
              value={formData.fullName}
              onChange={handleChange}
              placeholder="Enter full name"
              required
            />
          </label>


          <label>
            Email Address *

            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="name@email.com"
              required
            />
          </label>


          <label>
            Phone Number *

            <input
              name="phoneNumber"
              value={formData.phoneNumber}
              onChange={handleChange}
              placeholder="9876543210"
              required
            />
          </label>


          <label>
            Date of Birth *

            <input
              type="date"
              name="dateOfBirth"
              value={formData.dateOfBirth}
              onChange={handleChange}
              required
            />
          </label>


          <label className="full">

            Address *

            <textarea
              name="address"
              value={formData.address}
              onChange={handleChange}
              rows={3}
              placeholder="Enter full address"
              required
            />

          </label>

        </div>


        <div className="helper-box">

          <ShieldCheck size={18} />

          <span>
            Customer ID, status, created date and
            updated date will automatically be
            handled by the backend.
          </span>

        </div>


        <div className="form-actions">

          <button
            type="button"
            className="secondary-btn"
            onClick={() => navigate("/customers")}
          >
            Cancel
          </button>


          <button
            type="submit"
            className="primary-btn"
          >
            Create Customer
            <ChevronRight size={17} />
          </button>

        </div>

      </form>

    </>
  )
}

export default AddCustomerPage