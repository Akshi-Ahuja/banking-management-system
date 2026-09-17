import { ChevronRight } from "lucide-react"
import type { LucideIcon } from "lucide-react"

type MetricCardProps = {
  label: string
  value: string
  detail: string
  icon: LucideIcon
  accent: string
}

function MetricCard({
  label,
  value,
  detail,
  icon: Icon,
  accent,
}: MetricCardProps) {

  return (
    <div className="metric-card">

      <div className={`metric-icon ${accent}`}>
        <Icon size={20} />
      </div>

      <div className="metric-copy">

        <span>
          {label}
        </span>

        <strong>
          {value}
        </strong>

        <small>
          {detail}
        </small>

      </div>

      <ChevronRight
        className="metric-arrow"
        size={17}
      />

    </div>
  )
}

export default MetricCard