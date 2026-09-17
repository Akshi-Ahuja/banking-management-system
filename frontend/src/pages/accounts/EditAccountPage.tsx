import {
  useEffect,
  useState,
  type FormEvent,
} from "react"

import {
  ChevronRight,
  ShieldCheck,
} from "lucide-react"

import {
  useNavigate,
  useParams,
} from "react-router"

import PageHeader from "../../components/common/PageHeader"
import EmptyState from "../../components/common/EmptyState"

import {
  getAccountByNumber,
  updateAccount,
} from "../../services/accountService"

import type {
  AccountResponse,
  AccountStatus,
} from "../../types/account"


function EditAccountPage() {

  const navigate = useNavigate()

  const { accountNumber } =
    useParams()


  const [account, setAccount] =
    useState<AccountResponse | null>(
      null
    )


  const [overdraftLimit, setOverdraftLimit] =
    useState("0")


  const [status, setStatus] =
    useState<AccountStatus>(
      "ACTIVE"
    )


  const [loading, setLoading] =
    useState(true)

  const [saving, setSaving] =
    useState(false)

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

          const data =
            await getAccountByNumber(
              accountNumber
            )


          setAccount(data)

          setOverdraftLimit(
            data.overdraftLimit.toString()
          )

          setStatus(data.status)

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


  const handleSubmit = async (
    event: FormEvent
  ) => {

    event.preventDefault()


    if (!account) return


    try {

      setSaving(true)
      setError("")


      await updateAccount(
        account.accountNumber,
        {
          overdraftLimit:
            account.accountType ===
            "SAVINGS"
              ? 0
              : Number(
                  overdraftLimit
                ),

          status,
        }
      )


      alert(
        "Account updated successfully"
      )


      navigate(
        `/accounts/${account.accountNumber}`
      )

    } catch (error: any) {

      setError(
        error.response?.data?.message ||
        "Unable to update account"
      )

    } finally {

      setSaving(false)
    }
  }


  if (loading) {

    return (
      <div className="empty-state">
        <p>Loading account...</p>
      </div>
    )
  }


  if (!account) {

    return (
      <EmptyState
        title="Account not found"
        description={
          error ||
          "The account does not exist."
        }
      />
    )
  }


  const isSavings =
    account.accountType ===
    "SAVINGS"


  return (
    <>

      <PageHeader
        eyebrow="Accounts / Update"
        title="Update Account"
        description={`Update settings for ${account.accountNumber}.`}
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
            Account Number

            <input
              value={
                account.accountNumber
              }
              disabled
            />
          </label>


          <label>
            Account Type

            <input
              value={
                account.accountType
              }
              disabled
            />
          </label>


          <label>
            Overdraft Limit

            <div className="input-prefix">

              <span>₹</span>

              <input
                type="number"
                min="0"
                step="0.01"
                value={
                  isSavings
                    ? "0"
                    : overdraftLimit
                }
                onChange={(event) =>
                  setOverdraftLimit(
                    event.target.value
                  )
                }
                disabled={
                  isSavings
                }
              />

            </div>

            <small>
              {isSavings
                ? "Savings accounts cannot use overdraft."
                : "Overdraft is available for Current accounts."}
            </small>
          </label>


          <label>
            Account Status

            <select
              value={status}
              onChange={(event) =>
                setStatus(
                  event.target.value as AccountStatus
                )
              }
            >
              <option value="ACTIVE">
                ACTIVE
              </option>

              <option value="FROZEN">
                FROZEN
              </option>

              {account.status ===
                "CLOSED" && (
                <option value="CLOSED">
                  CLOSED
                </option>
              )}
            </select>

          </label>

        </div>


        <div className="helper-box">

          <ShieldCheck size={18} />

          <span>
            Balance is changed only through deposit,
            withdrawal and transfer operations.
          </span>

        </div>


        <div className="form-actions">

          <button
            type="button"
            className="secondary-btn"
            disabled={saving}
            onClick={() =>
              navigate(
                `/accounts/${account.accountNumber}`
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

export default EditAccountPage