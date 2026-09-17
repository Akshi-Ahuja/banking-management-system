import {
  useState,
  type FormEvent,
} from "react"

import {
  ArrowRight,
  CreditCard,
  UserPlus,
  WalletCards,
} from "lucide-react"

import {
  useNavigate,
} from "react-router"


function CustomerPortalPage() {

  const navigate = useNavigate()

  const [accountNumber, setAccountNumber] =
    useState("")


  const handleAccessAccount = (
    event: FormEvent
  ) => {

    event.preventDefault()


    if (!accountNumber.trim()) {

      alert(
        "Please enter your account number."
      )

      return
    }


    navigate(
      `/portal/my-account/${accountNumber.trim()}`
    )
  }


  return (
    <>

      {/* WELCOME */}

      <section className="mb-8">

        <div className="eyebrow">
          CUSTOMER BANKING
        </div>

        <h1 className="text-3xl font-semibold text-[#14243c]">
          Welcome to CoreBank
        </h1>

        <p className="text-sm text-slate-500 mt-2">
          Create your banking profile, open an account
          and manage your money online.
        </p>

      </section>


      {/* NEW CUSTOMER */}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-5 mb-8">


        <section className="panel form-panel">

          <div className="operation-icon mb-4">
            <UserPlus size={22} />
          </div>

          <h2 className="text-lg font-semibold">
            New to CoreBank?
          </h2>

          <p className="text-sm text-slate-500 mt-2 mb-6">
            Create your customer profile first.
            You will receive a unique Customer ID.
          </p>


          <button
            className="primary-btn"
            onClick={() =>
              navigate(
                "/portal/create-profile"
              )
            }
          >
            Create Customer Profile
            <ArrowRight size={16} />
          </button>

        </section>


        <section className="panel form-panel">

          <div className="operation-icon mb-4">
            <WalletCards size={22} />
          </div>

          <h2 className="text-lg font-semibold">
            Already have a Customer ID?
          </h2>

          <p className="text-sm text-slate-500 mt-2 mb-6">
            Open a Savings or Current account using
            your Customer ID.
          </p>


          <button
            className="primary-btn"
            onClick={() =>
              navigate(
                "/portal/open-account"
              )
            }
          >
            Open Bank Account
            <ArrowRight size={16} />
          </button>

        </section>

      </div>


      {/* RETURNING USER */}

      <section className="panel form-panel max-w-3xl">

        <div className="form-heading">

          <div className="operation-icon">
            <CreditCard size={22} />
          </div>

          <div>

            <h2>
              Already have an account?
            </h2>

            <p>
              Enter your account number to access your banking account.
            </p>

          </div>

        </div>


        <form
          onSubmit={
            handleAccessAccount
          }
        >

          <div className="form-grid">

            <label className="full">

              Account Number *

              <input
                value={accountNumber}
                onChange={(event) =>
                  setAccountNumber(
                    event.target.value
                  )
                }
                placeholder="Enter your account number"
                required
              />

            </label>

          </div>


          <div className="form-actions">

            <button
              type="submit"
              className="primary-btn"
            >
              Access My Account
              <ArrowRight size={16} />
            </button>

          </div>

        </form>

      </section>

    </>
  )
}

export default CustomerPortalPage