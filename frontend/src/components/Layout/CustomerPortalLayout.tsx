import {
  CircleDollarSign,
  Home,
} from "lucide-react"

import {
  NavLink,
  Outlet,
} from "react-router"


function CustomerPortalLayout() {

  return (
    <div className="min-h-screen bg-[#f5f7fb]">

      <header className="bg-[#13243c] text-white">

        <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">

          <NavLink
            to="/portal"
            className="flex items-center gap-3"
          >

            <div className="brand-mark">
              <CircleDollarSign size={21} />
            </div>

            <div>
              <strong className="block text-sm">
                CoreBank
              </strong>

              <span className="text-xs text-slate-400">
                Customer Banking Portal
              </span>
            </div>

          </NavLink>


          <NavLink
            to="/portal"
            className="flex items-center gap-2 text-sm text-slate-300 hover:text-white"
          >
            <Home size={17} />
            Home
          </NavLink>

        </div>

      </header>


      <main className="content-container">

        <Outlet />

      </main>

    </div>
  )
}

export default CustomerPortalLayout