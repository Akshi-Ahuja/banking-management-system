import { Route, Routes } from "react-router"

import AppLayout from "../src/components/Layout/AppLayout"

import Dashboard from "./pages/Dashboard"
import CustomersPage from "./pages/customers/CustomersPage"
import AccountsPage from "./pages/accounts/AccountsPage"

import DepositPage from "./pages/transactions/DepositPage"
import WithdrawPage from "./pages/transactions/WithdrawPage"
import TransferPage from "./pages/transactions/TransferPage"
import TransactionHistoryPage from "./pages/transactions/TransactionHistoryPage"

import StatementsPage from "./pages/statements/StatementsPage"

import AddCustomerPage from "./pages/customers/AddCustomerPage"
import CustomerDetailsPage from "./pages/customers/CustomerDetailsPage"
import EditCustomerPage from "./pages/customers/EditCustomerPage"

import CreateAccountPage from "./pages/accounts/CreateAccountPage"
import AccountDetailsPage from "./pages/accounts/AccountDetailsPage"
import EditAccountPage from "./pages/accounts/EditAccountPage"

import CustomerPortalLayout from "./components/Layout/CustomerPortalLayout"

import CustomerPortalPage from "./pages/portal/CustomerPortalPage"
import MyAccountPage from "./pages/portal/MyAccountPage"


function App() {

  return (

    <Routes>

      <Route
  path="/portal"
  element={<CustomerPortalLayout />}
>

  <Route
    index
    element={<CustomerPortalPage />}
  />

  <Route
    path="my-account/:accountNumber"
    element={<MyAccountPage />}
  />


  <Route
    path="create-profile"
    element={<AddCustomerPage />}
  />


  <Route
    path="open-account"
    element={<CreateAccountPage />}
  />


  <Route
    path="deposit"
    element={<DepositPage />}
  />


  <Route
    path="withdraw"
    element={<WithdrawPage />}
  />


  <Route
    path="transfer"
    element={<TransferPage />}
  />


  <Route
    path="history"
    element={<TransactionHistoryPage />}
  />


  <Route
    path="statements"
    element={<StatementsPage />}
  />

</Route>

      <Route element={<AppLayout />}>

        <Route
          path="/"
          element={<Dashboard />}
        />

        <Route
          path="/customers"
          element={<CustomersPage />}
        />

        <Route
          path="/customers/new"
          element={<AddCustomerPage />}
        />

        <Route
          path="/customers/:customerId"
          element={<CustomerDetailsPage />}
        />

        <Route
          path="/customers/:customerId/edit"
          element={<EditCustomerPage />}
        />

        <Route
          path="/accounts"
          element={<AccountsPage />}
        />

        <Route
          path="/accounts/new"
          element={<CreateAccountPage />}
        />

        <Route
          path="/accounts/:accountNumber"
          element={<AccountDetailsPage />}
        />

        <Route
          path="/accounts/:accountNumber/edit"
          element={<EditAccountPage />}
        />

        <Route
          path="/transactions/deposit"
          element={<DepositPage />}
        />

        <Route
          path="/transactions/withdraw"
          element={<WithdrawPage />}
        />

        <Route
          path="/transactions/transfer"
          element={<TransferPage />}
        />

        <Route
          path="/transactions/history"
          element={<TransactionHistoryPage />}
        />

        <Route
          path="/statements"
          element={<StatementsPage />}
        />

      </Route>

    </Routes>

  )
}

export default App