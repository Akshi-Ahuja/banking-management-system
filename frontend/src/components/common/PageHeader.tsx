import type { ReactNode } from "react"

type PageHeaderProps = {
  eyebrow: string
  title: string
  description: string
  action?: ReactNode
}

function PageHeader({
  eyebrow,
  title,
  description,
  action,
}: PageHeaderProps) {

  return (
    <div className="page-header">

      <div>

        <div className="eyebrow">
          {eyebrow}
        </div>

        <h1>
          {title}
        </h1>

        <p>
          {description}
        </p>

      </div>

      {action}

    </div>
  )
}

export default PageHeader