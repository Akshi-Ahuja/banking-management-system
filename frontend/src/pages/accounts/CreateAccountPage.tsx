import {
  useState,
  type ChangeEvent,
  type FormEvent,
} from "react"

import {
  ChevronRight,
  ShieldCheck,
} from "lucide-react"

import {
  useNavigate,
  useSearchParams,
} from "react-router"

import PageHeader from "../../components/common/PageHeader"

import {
  createAccount,
} from "../../services/accountService"

import type {
  AccountType,
} from "../../types/account"

import {
  useLocation,
} from "react-router"


function CreateAccountPage() {

  const navigate = useNavigate()
  const location = useLocation()

  const [searchParams] =
    useSearchParams()


  const customerFromUrl =
    searchParams.get(
      "customerId"
    ) || ""


  const [formData, setFormData] =
    useState({
      customerId:
        customerFromUrl,

      accountType:
        "SAVINGS" as AccountType,

      openingBalance: "",

      overdraftLimit: "0",
    })


  const [saving, setSaving] =
    useState(false)

  const [error, setError] =
    useState("")


  const handleChange = (
    event: ChangeEvent<
      HTMLInputElement |
      HTMLSelectElement
    >
  ) => {

    const {
      name,
      value,
    } = event.target


    if (
      name === "accountType" &&
      value === "SAVINGS"
    ) {

      setFormData({
        ...formData,
        accountType: "SAVINGS",
        overdraftLimit: "0",
      })

      return
    }


    setFormData({
      ...formData,
      [name]: value,
    })
  }


  const handleSubmit = async (
    event: FormEvent
  ) => {

    event.preventDefault()


    try {

      setSaving(true)
      setError("")


      const account =
        await createAccount({
          customerId:
            formData.customerId,

          accountType:
            formData.accountType,

          openingBalance:
            Number(
              formData.openingBalance
            ),

          overdraftLimit:
            formData.accountType ===
            "SAVINGS"
              ? 0
              : Number(
                  formData.overdraftLimit
                ),
        })


      alert(
        `Account created successfully.\nAccount Number: ${account.accountNumber}`
      )


      if (
        location.pathname.startsWith(
          "/portal"
        )
      ) {

        navigate(
          `/portal/my-account/${account.accountNumber}`
        )

      } else {

        navigate(
          `/accounts/${account.accountNumber}`
        )
      }

    } catch (error: any) {

      console.error(error)

      setError(
        error.response?.data?.message ||
        "Unable to create account"
      )

    } finally {

      setSaving(false)
    }
  }


  const isSavings =
    formData.accountType ===
    "SAVINGS"


  return (
    <>

      <PageHeader
        eyebrow="Accounts / New"
        title="Create Account"
        description="Open a new deposit account for an existing customer."
      />


      {error && (

        <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded text-red-600 text-sm">
          {error}
        </div>

      )}


      <form
        className="panel form-panel wide-form"
        onSubmit={handleSubmit}
      >

        <div className="form-grid">


          <label>
            Customer ID *

            <input
              name="customerId"
              value={
                formData.customerId
              }
              onChange={handleChange}
              placeholder="CUST123456"
              required
            />
          </label>


          <label>
            Account Type *

            <select
              name="accountType"
              value={
                formData.accountType
              }
              onChange={handleChange}
            >
              <option value="SAVINGS">
                SAVINGS
              </option>

              <option value="CURRENT">
                CURRENT
              </option>
            </select>
          </label>


          <label>
            Opening Balance *

            <div className="input-prefix">

              <span>₹</span>

              <input
                type="number"
                min="0"
                step="0.01"
                name="openingBalance"
                value={
                  formData.openingBalance
                }
                onChange={
                  handleChange
                }
                placeholder="0.00"
                required
              />

            </div>
          </label>


          <label>
            Overdraft Limit

            <div className="input-prefix">

              <span>₹</span>

              <input
                type="number"
                min="0"
                step="0.01"
                name="overdraftLimit"
                value={
                  formData.overdraftLimit
                }
                onChange={handleChange}
                disabled={
                  isSavings
                }
              />

            </div>

            <small>
              {isSavings
                ? "Savings accounts cannot use overdraft."
                : "Optional overdraft limit for Current accounts."}
            </small>

          </label>

        </div>


        <div className="helper-box">

          <ShieldCheck size={18} />

          <span>
            Account ID and account number will be generated automatically.
          </span>

        </div>


        <div className="form-actions">

          <button
            type="button"
            className="secondary-btn"
            onClick={() =>
              navigate("/accounts")
            }
            disabled={saving}
          >
            Cancel
          </button>


          <button
            type="submit"
            className="primary-btn"
            disabled={saving}
          >

            {saving
              ? "Creating..."
              : "Create Account"}

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

export default CreateAccountPage