import type { ReactNode } from "react"

type TableShellProps = {
  title: string
  action?: ReactNode
  children: ReactNode
}

function TableShell({
  title,
  action,
  children,
}: TableShellProps) {

  return (
    <section className="panel table-panel">

      <div className="panel-heading">

        <div>

          <h2>
            {title}
          </h2>

          <span className="panel-subtitle">
            Latest activity across CoreBank
          </span>

        </div>

        {action}

      </div>

      <div className="table-wrap">
        {children}
      </div>

    </section>
  )
}

export default TableShell