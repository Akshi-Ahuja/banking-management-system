import { Search } from "lucide-react"

type EmptyStateProps = {
  title: string
  description: string
}

function EmptyState({
  title,
  description,
}: EmptyStateProps) {

  return (
    <div className="empty-state">

      <div className="empty-icon">
        <Search size={20} />
      </div>

      <h3>{title}</h3>

      <p>{description}</p>

    </div>
  )
}

export default EmptyState