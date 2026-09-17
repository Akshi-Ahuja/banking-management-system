type StatusBadgeProps = {
  children: string
}

function StatusBadge({ children }: StatusBadgeProps) {

  const tone =
    children === "ACTIVE" ||
    children === "SUCCESS" ||
    children === "DEPOSIT" ||
    children === "TRANSFER_IN"
      ? "success"

      : children === "PENDING" ||
        children === "WITHDRAWAL" ||
        children === "CURRENT"
      ? "warning"

      : children === "FAILED" ||
        children === "INACTIVE" ||
        children === "CLOSED"
      ? "danger"

      : "neutral"

  return (
    <span className={`status-badge ${tone}`}>

      <span className="status-dot" />

      {children.replace("_", " ")}

    </span>
  )
}

export default StatusBadge