import { useState } from "react"
import {
  ArrowLeftRight,
  Bell,
  ChevronDown,
  ChevronRight,
  CircleDollarSign,
  FileText,
  LayoutDashboard,
  Menu,
  MoreHorizontal,
  Search,
  Settings,
  Users,
  WalletCards,
  X,
} from "lucide-react"

import { NavLink, Outlet, useLocation } from "react-router"

function AppLayout() {
  const [mobileOpen, setMobileOpen] = useState(false)

  const location = useLocation()

  const getPageTitle = () => {
    const path = location.pathname

    if (path === "/") return "Dashboard"

    if (path.startsWith("/customers")) return "Customers"

    if (path.startsWith("/accounts")) return "Accounts"

    if (path.startsWith("/transactions")) return "Transactions"

    if (path.startsWith("/statements")) return "Account Statements"

    return "CoreBank"
  }

  return (
    <div className="app-shell">

      {/* SIDEBAR */}
      <aside className={`sidebar ${mobileOpen ? "open" : ""}`}>

        {/* BRAND */}
        <div className="brand">
          <div className="brand-mark">
            <CircleDollarSign size={20} />
          </div>

          <div>
            <strong>CoreBank</strong>
            <span>Management System</span>
          </div>

          <button
            className="mobile-close"
            onClick={() => setMobileOpen(false)}
          >
            <X size={19} />
          </button>
        </div>


        <div className="nav-label">
          Workspace
        </div>


        {/* NAVIGATION */}
        <nav>

          <NavLink
            to="/"
            end
            className={({ isActive }) =>
              isActive ? "nav-item active" : "nav-item"
            }
            onClick={() => setMobileOpen(false)}
          >
            <LayoutDashboard size={18} />
            Dashboard
          </NavLink>


          <NavLink
            to="/customers"
            className={({ isActive }) =>
              isActive ? "nav-item active" : "nav-item"
            }
            onClick={() => setMobileOpen(false)}
          >
            <Users size={18} />
            Customers
          </NavLink>


          <NavLink
            to="/accounts"
            className={({ isActive }) =>
              isActive ? "nav-item active" : "nav-item"
            }
            onClick={() => setMobileOpen(false)}
          >
            <WalletCards size={18} />
            Accounts
          </NavLink>


          {/* TRANSACTIONS */}
          <div className="nav-group">

            <span className="nav-item group-label">
              <ArrowLeftRight size={18} />
              Transactions
              <ChevronDown size={15} />
            </span>


            <NavLink
              to="/transactions/deposit"
              className="sub-nav"
              onClick={() => setMobileOpen(false)}
            >
              Deposit
            </NavLink>


            <NavLink
              to="/transactions/withdraw"
              className="sub-nav"
              onClick={() => setMobileOpen(false)}
            >
              Withdraw
            </NavLink>


            <NavLink
              to="/transactions/transfer"
              className="sub-nav"
              onClick={() => setMobileOpen(false)}
            >
              Transfer
            </NavLink>


            <NavLink
              to="/transactions/history"
              className="sub-nav"
              onClick={() => setMobileOpen(false)}
            >
              Transaction history
            </NavLink>

          </div>


          <NavLink
            to="/statements"
            className={({ isActive }) =>
              isActive ? "nav-item active" : "nav-item"
            }
            onClick={() => setMobileOpen(false)}
          >
            <FileText size={18} />
            Account statements
          </NavLink>

        </nav>


        {/* SIDEBAR FOOTER */}
        <div className="sidebar-footer">

          <button className="nav-item">
            <Settings size={18} />
            Settings
          </button>


          <div className="admin-mini">

            <div className="avatar small">
              BA
            </div>

            <div>
              <strong>Bank Admin</strong>
              <span>Administrator</span>
            </div>

            <MoreHorizontal size={17} />

          </div>

        </div>

      </aside>


      {/* MAIN CONTENT */}
      <main className="main-content">

        {/* HEADER */}
        <header className="top-header">

          <button
            className="mobile-menu"
            onClick={() => setMobileOpen(true)}
          >
            <Menu size={21} />
          </button>


          <div className="breadcrumbs">

            <span>CoreBank</span>

            <ChevronRight size={14} />

            <strong>
              {getPageTitle()}
            </strong>

          </div>


          <div className="header-actions">

            <div className="global-search">

              <Search size={16} />

              <span>
                Search anything
              </span>

              <kbd>
                Ctrl K
              </kbd>

            </div>


            <button className="notification-btn">

              <Bell size={19} />

              <i />

            </button>


            <div className="header-avatar">
              BA
            </div>

          </div>

        </header>


        {/* PAGE CONTENT */}
        <div className="content-container">
          <Outlet />
        </div>

      </main>

    </div>
  )
}

export default AppLayout