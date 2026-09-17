import {
  useEffect,
  useState,
  type ChangeEvent,
  type FormEvent,
} from "react"

import {
  FilePlus,
  Pencil,
  Plus,
  UserX,
} from "lucide-react"

import {
  useNavigate,
  useParams,
} from "react-router"

import PageHeader from "../../components/common/PageHeader"
import StatusBadge from "../../components/common/StatusBadge"
import EmptyState from "../../components/common/EmptyState"

import {
  deactivateCustomer,
  getCustomerById,
} from "../../services/customerService"

import {
  addCustomerDocument,
  getCustomerDocuments,
} from "../../services/documentService"

import type {
  CustomerResponse,
} from "../../types/customer"

import type {
  CustomerDocumentResponse,
  DocumentType,
} from "../../types/document"

import {
  getAccountsByCustomerId,
} from "../../services/accountService"

import type {
  AccountResponse,
} from "../../types/account"


function CustomerDetailsPage() {

  const navigate = useNavigate()

  const { customerId } = useParams()


  // CUSTOMER
  const [customer, setCustomer] =
    useState<CustomerResponse | null>(null)


  // DOCUMENTS
  const [documents, setDocuments] =
    useState<CustomerDocumentResponse[]>([])

  const [customerAccounts, setCustomerAccounts] =
  useState<AccountResponse[]>([])

  // PAGE STATES
  const [loading, setLoading] =
    useState(true)

  const [documentsLoading, setDocumentsLoading] =
    useState(true)

  const [error, setError] =
    useState("")


  // TABS
  const [activeTab, setActiveTab] =
    useState<"accounts" | "documents">(
      "accounts"
    )


  // DOCUMENT FORM
  const [
    showDocumentForm,
    setShowDocumentForm,
  ] = useState(false)


  const [savingDocument, setSavingDocument] =
    useState(false)


  const [documentForm, setDocumentForm] =
    useState<{
      documentType: DocumentType
      documentNumber: string
      filePath: string
    }>({
      documentType: "PAN",
      documentNumber: "",
      filePath: "",
    })


  // LOAD CUSTOMER
  useEffect(() => {

    if (!customerId) {

      setLoading(false)
      setDocumentsLoading(false)

      return
    }


    const loadCustomer = async () => {

      try {

        setLoading(true)
        setError("")


        const data =
          await getCustomerById(
            customerId
          )


        setCustomer(data)

      } catch (error) {

        console.error(error)

        setError(
          "Unable to load customer."
        )

      } finally {

        setLoading(false)
      }

    }


    loadCustomer()

  }, [customerId])


  useEffect(() => {

  if (!customerId) return


  const loadAccounts = async () => {

    try {

      const data =
        await getAccountsByCustomerId(
          customerId
        )

      setCustomerAccounts(data)

    } catch (error) {

      console.error(
        "Unable to load customer accounts",
        error
      )
    }
  }


  loadAccounts()

}, [customerId])


  // LOAD DOCUMENTS
  useEffect(() => {

    if (!customerId) {
      return
    }


    const loadDocuments = async () => {

      try {

        setDocumentsLoading(true)


        const data =
          await getCustomerDocuments(
            customerId
          )


        setDocuments(data)

      } catch (error) {

        console.error(
          "Unable to load documents",
          error
        )

      } finally {

        setDocumentsLoading(false)
      }

    }


    loadDocuments()

  }, [customerId])


  // DEACTIVATE CUSTOMER
  const handleDeactivate = async () => {

    if (!customer) {
      return
    }


    if (
      customer.status === "INACTIVE"
    ) {

      alert(
        "This customer is already inactive."
      )

      return
    }


    const confirmed =
      window.confirm(
        "Are you sure you want to deactivate this customer?"
      )


    if (!confirmed) {
      return
    }


    try {

      const updatedCustomer =
        await deactivateCustomer(
          customer.customerId
        )


      setCustomer(updatedCustomer)


      alert(
        "Customer deactivated successfully"
      )

    } catch (error: any) {

      console.error(error)


      alert(
        error.response?.data?.message ||
        "Unable to deactivate customer"
      )
    }
  }


  // DOCUMENT FORM CHANGE
  const handleDocumentChange = (
    event: ChangeEvent<
      HTMLInputElement |
      HTMLSelectElement
    >
  ) => {

    const {
      name,
      value,
    } = event.target


    // PROFILE PHOTO DOES NOT REQUIRE DOCUMENT NUMBER
    if (
      name === "documentType" &&
      value === "PROFILE_PHOTO"
    ) {

      setDocumentForm({
        ...documentForm,
        documentType:
          value as DocumentType,
        documentNumber: "",
      })

      return
    }


    setDocumentForm({
      ...documentForm,
      [name]: value,
    })
  }


  // ADD DOCUMENT
  const handleAddDocument = async (
    event: FormEvent
  ) => {

    event.preventDefault()


    if (!customer) {
      return
    }


    if (!documentForm.filePath.trim()) {

      alert(
        "Please enter the document file path."
      )

      return
    }


    if (
      documentForm.documentType !==
        "PROFILE_PHOTO" &&
      !documentForm.documentNumber.trim()
    ) {

      alert(
        "Please enter the document number."
      )

      return
    }


    try {

      setSavingDocument(true)


      const newDocument =
        await addCustomerDocument({
          customerId:
            customer.customerId,

          documentType:
            documentForm.documentType,

          documentNumber:
            documentForm.documentType ===
            "PROFILE_PHOTO"
              ? null
              : documentForm.documentNumber,

          filePath:
            documentForm.filePath,
        })


      // ADD NEW DOCUMENT TO TABLE IMMEDIATELY
      setDocuments(
        (previousDocuments) => [
          ...previousDocuments,
          newDocument,
        ]
      )


      // RESET FORM
      setDocumentForm({
        documentType: "PAN",
        documentNumber: "",
        filePath: "",
      })


      setShowDocumentForm(false)


      alert(
        "Document added successfully"
      )

    } catch (error: any) {

      console.error(error)


      alert(
        error.response?.data?.message ||
        "Unable to add document"
      )

    } finally {

      setSavingDocument(false)
    }
  }


  // LOADING CUSTOMER
  if (loading) {

    return (
      <div className="empty-state">

        <p>
          Loading customer...
        </p>

      </div>
    )
  }


  // CUSTOMER ERROR
  if (error) {

    return (
      <EmptyState
        title="Unable to load customer"
        description={error}
      />
    )
  }


  // CUSTOMER NOT FOUND
  if (!customer) {

    return (
      <EmptyState
        title="Customer not found"
        description="The requested customer does not exist."
      />
    )
  }


  return (
    <>

      {/* PAGE HEADER */}

      <PageHeader
        eyebrow="Customers / Details"
        title={customer.fullName}
        description={`Customer ID: ${customer.customerId}`}
        action={

          <div className="flex gap-2">

            <button
              className="secondary-btn"
              onClick={() =>
                navigate(
                  `/customers/${customer.customerId}/edit`
                )
              }
            >
              <Pencil size={16} />
              Edit Customer
            </button>


            <button
              className="secondary-btn"
              onClick={handleDeactivate}
              disabled={
                customer.status ===
                "INACTIVE"
              }
            >

              <UserX size={16} />

              {customer.status ===
              "INACTIVE"
                ? "Inactive"
                : "Deactivate"}

            </button>

          </div>
        }
      />


      {/* CUSTOMER INFORMATION */}

      <section className="panel form-panel">

        <div className="flex items-center justify-between mb-6">

          <div>

            <h2 className="text-base font-semibold">
              Customer Information
            </h2>

            <p className="text-xs text-slate-500 mt-1">
              Personal and customer profile details
            </p>

          </div>


          <StatusBadge>
            {customer.status}
          </StatusBadge>

        </div>


        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">


          <Detail
            label="Customer ID"
            value={
              customer.customerId
            }
          />


          <Detail
            label="Full Name"
            value={
              customer.fullName
            }
          />


          <Detail
            label="Email"
            value={
              customer.email
            }
          />


          <Detail
            label="Phone Number"
            value={
              customer.phoneNumber
            }
          />


          <Detail
            label="Date of Birth"
            value={
              customer.dateOfBirth
            }
          />


          <Detail
            label="Address"
            value={
              customer.address
            }
          />


          <Detail
            label="Status"
            value={
              customer.status
            }
          />


          <Detail
            label="Created At"
            value={
              new Date(
                customer.createdAt
              ).toLocaleString()
            }
          />


          <Detail
            label="Updated At"
            value={
              new Date(
                customer.updatedAt
              ).toLocaleString()
            }
          />

        </div>

      </section>


      {/* TABS */}

      <div className="flex gap-3 mt-6 mb-4">

        <button
          className={
            activeTab === "accounts"
              ? "primary-btn"
              : "secondary-btn"
          }
          onClick={() =>
            setActiveTab(
              "accounts"
            )
          }
        >
          Accounts
        </button>


        <button
          className={
            activeTab === "documents"
              ? "primary-btn"
              : "secondary-btn"
          }
          onClick={() =>
            setActiveTab(
              "documents"
            )
          }
        >
          Documents
        </button>

      </div>


      {/* ACCOUNTS TAB */}

      {activeTab === "accounts" && (

        <section className="panel">

          <div className="panel-heading">

            <div>

              <h2>
                Customer Accounts
              </h2>

              <span className="panel-subtitle">
                Accounts linked to this customer
              </span>

            </div>


            <button
              className="primary-btn"
              onClick={() =>
                navigate(
                  `/accounts/new?customerId=${customer.customerId}`
                )
              }
            >

              <Plus size={16} />

              Open New Account

            </button>

          </div>


          <div className="table-wrap">

            {customerAccounts.length >
            0 ? (

              <table>

                <thead>

                  <tr>
                    <th>
                      Account Number
                    </th>

                    <th>
                      Account ID
                    </th>

                    <th>
                      Type
                    </th>

                    <th>
                      Balance
                    </th>

                    <th>
                      Status
                    </th>

                    <th>
                      Opened At
                    </th>
                  </tr>

                </thead>


                <tbody>

                  {customerAccounts.map(
                    (account) => (

                      <tr
                        key={
                          account.accountId
                        }
                      >

                        <td className="mono">
                          {
                            account.accountNumber
                          }
                        </td>


                        <td className="mono muted-cell">
                          {account.accountId}
                        </td>


                        <td>

                          <StatusBadge>
                            {
                              account.accountType
                            }
                          </StatusBadge>

                        </td>


                        <td className="amount">

                          ₹
                          {account.balance.toLocaleString(
                            "en-IN"
                          )}

                        </td>


                        <td>

                          <StatusBadge>
                            {
                              account.status
                            }
                          </StatusBadge>

                        </td>


                        <td className="muted-cell">
                          {
                            new Date(account.openedAt).toLocaleDateString()
                          }
                        </td>

                      </tr>

                    )
                  )}

                </tbody>

              </table>

            ) : (

              <EmptyState
                title="No accounts found"
                description="This customer does not have any accounts yet."
              />

            )}

          </div>

        </section>

      )}


      {/* DOCUMENTS TAB */}

      {activeTab === "documents" && (

        <section className="panel">

          <div className="panel-heading">

            <div>

              <h2>
                Customer Documents
              </h2>

              <span className="panel-subtitle">
                Identity and supporting documents
              </span>

            </div>


            <button
              className="primary-btn"
              onClick={() =>
                setShowDocumentForm(
                  !showDocumentForm
                )
              }
            >

              <FilePlus size={16} />

              Add Document

            </button>

          </div>


          {/* ADD DOCUMENT FORM */}

          {showDocumentForm && (

            <form
              className="form-panel border-t"
              onSubmit={
                handleAddDocument
              }
            >

              <div className="form-grid">


                {/* DOCUMENT TYPE */}

                <label>

                  Document Type *

                  <select
                    name="documentType"
                    value={
                      documentForm.documentType
                    }
                    onChange={
                      handleDocumentChange
                    }
                  >

                    <option value="PAN">
                      PAN
                    </option>

                    <option value="AADHAR">
                      AADHAR
                    </option>

                    <option value="PASSPORT">
                      PASSPORT
                    </option>

                    <option value="DRIVING_LICENSE">
                      DRIVING LICENSE
                    </option>

                    <option value="VOTER_ID">
                      VOTER ID
                    </option>

                    <option value="PROFILE_PHOTO">
                      PROFILE PHOTO
                    </option>

                  </select>

                </label>


                {/* DOCUMENT NUMBER */}

                <label>

                  Document Number
                  {documentForm.documentType !==
                    "PROFILE_PHOTO" &&
                    " *"}

                  <input
                    type="text"
                    name="documentNumber"
                    value={
                      documentForm.documentNumber
                    }
                    onChange={
                      handleDocumentChange
                    }
                    disabled={
                      documentForm.documentType ===
                      "PROFILE_PHOTO"
                    }
                    placeholder={
                      documentForm.documentType ===
                      "PROFILE_PHOTO"
                        ? "Not required"
                        : "Enter document number"
                    }
                  />

                </label>


                {/* FILE PATH */}

                <label className="full">

                  File Path *

                  <input
                    type="text"
                    name="filePath"
                    value={
                      documentForm.filePath
                    }
                    onChange={
                      handleDocumentChange
                    }
                    placeholder="/uploads/customers/document.pdf"
                    required
                  />

                  <small>
                    For now this project stores the document file path, not the actual file upload.
                  </small>

                </label>

              </div>


              <div className="form-actions">

                <button
                  type="button"
                  className="secondary-btn"
                  disabled={
                    savingDocument
                  }
                  onClick={() => {

                    setShowDocumentForm(
                      false
                    )

                    setDocumentForm({
                      documentType:
                        "PAN",

                      documentNumber:
                        "",

                      filePath:
                        "",
                    })

                  }}
                >
                  Cancel
                </button>


                <button
                  type="submit"
                  className="primary-btn"
                  disabled={
                    savingDocument
                  }
                >

                  {savingDocument
                    ? "Adding..."
                    : "Add Document"}

                </button>

              </div>

            </form>

          )}


          {/* DOCUMENTS TABLE */}

          <div className="table-wrap">

            {documentsLoading ? (

              <div className="empty-state">

                <p>
                  Loading documents...
                </p>

              </div>

            ) : documents.length > 0 ? (

              <table>

                <thead>

                  <tr>

                    <th>
                      Document Type
                    </th>

                    <th>
                      Document Number
                    </th>

                    <th>
                      File Path
                    </th>

                    <th>
                      Uploaded At
                    </th>

                  </tr>

                </thead>


                <tbody>

                  {documents.map(
                    (document) => (

                      <tr
                        key={
                          document.id
                        }
                      >

                        <td>

                          <strong>
                            {
                              document.documentType
                            }
                          </strong>

                        </td>


                        <td className="mono muted-cell">

                          {document.documentNumber ??
                            "N/A"}

                        </td>


                        <td className="muted-cell">

                          {
                            document.filePath
                          }

                        </td>


                        <td className="muted-cell">

                          {new Date(
                            document.uploadedAt
                          ).toLocaleString()}

                        </td>

                      </tr>

                    )
                  )}

                </tbody>

              </table>

            ) : (

              <EmptyState
                title="No documents found"
                description="No documents have been added for this customer."
              />

            )}

          </div>

        </section>

      )}

    </>
  )
}


type DetailProps = {
  label: string
  value: string
}


function Detail({
  label,
  value,
}: DetailProps) {

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


export default CustomerDetailsPage