import { MoreHorizontal } from "lucide-react"

import { transactions } from "../../data/mockData"
import StatusBadge from "./StatusBadge"


type TransactionTableProps = {
  compact?: boolean
}


function money(value: number) {
  return `₹${value.toLocaleString("en-IN")}`
}


function TransactionTable({
  compact = false,
}: TransactionTableProps) {

  return (
    <table>

      <thead>

        <tr>
          <th>Transaction ID</th>
          <th>Account number</th>
          <th>Type</th>
          <th>Amount</th>
          <th>Date & time</th>
          <th>Status</th>
          <th />
        </tr>

      </thead>


      <tbody>

        {transactions
          .slice(0, compact ? 4 : transactions.length)
          .map((tx) => {

            const outgoing =
              tx.type.includes("OUT") ||
              tx.type === "WITHDRAWAL"

            return (
              <tr key={tx.id}>

                <td>
                  <strong className="mono">
                    {tx.id}
                  </strong>
                </td>

                <td className="mono muted-cell">
                  {tx.account}
                </td>

                <td>
                  <StatusBadge>
                    {tx.type}
                  </StatusBadge>
                </td>

                <td className="amount">

                  {outgoing ? "-" : "+"}

                  {money(tx.amount)}

                </td>

                <td className="muted-cell">
                  {tx.date}
                </td>

                <td>
                  <StatusBadge>
                    {tx.status}
                  </StatusBadge>
                </td>

                <td>

                  <button
                    className="icon-btn"
                    aria-label="More transaction options"
                  >
                    <MoreHorizontal size={17} />
                  </button>

                </td>

              </tr>
            )
          })}

      </tbody>

    </table>
  )
}

export default TransactionTable