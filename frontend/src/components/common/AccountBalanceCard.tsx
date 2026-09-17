import { CreditCard } from "lucide-react"

import StatusBadge from "./StatusBadge"


type AccountBalanceCardProps = {
  accountNumber: string
  customerName: string
  accountType: string
  balance: number
  overdraftLimit: number
  status: string
}


function money(value: number) {
  return `₹${value.toLocaleString("en-IN")}`
}


function AccountBalanceCard({
  accountNumber,
  customerName,
  accountType,
  balance,
  overdraftLimit,
  status,
}: AccountBalanceCardProps) {

  const availableBalance =
    accountType === "CURRENT"
      ? balance + overdraftLimit
      : balance


  const initials =
    customerName
      .split(" ")
      .map((name) => name[0])
      .join("")


  return (
    <section className="balance-card">

      <div className="balance-top">

        <div>
          <span>Account Number</span>
          <strong>{accountNumber}</strong>
        </div>

        <CreditCard size={21} />

      </div>


      <div className="balance-person">

        <div className="avatar small">
          {initials}
        </div>

        <div>
          <strong>{customerName}</strong>
          <span>{accountType} Account</span>
        </div>

      </div>


      <div className="balance-amount">

        <span>Current Balance</span>

        <strong>
          {money(balance)}
        </strong>

      </div>


      {accountType === "CURRENT" && (

        <div className="balance-details">

          <span>Overdraft Limit</span>

          <strong>
            {money(overdraftLimit)}
          </strong>

        </div>

      )}


      <div className="balance-details">

        <span>Available Balance</span>

        <strong>
          {money(availableBalance)}
        </strong>

      </div>


      <div className="balance-details">

        <span>Account Status</span>

        <StatusBadge>
          {status}
        </StatusBadge>

      </div>

    </section>
  )
}

export default AccountBalanceCard