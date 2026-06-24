import { useEffect, useMemo, useState } from "react"
import { AppShell } from "./components/AppShell"
import { AuthPage } from "./components/AuthPage"
import { ApprovalPage } from "./pages/ApprovalPage"
import { DashboardPage } from "./pages/DashboardPage"
import { InventoryPage } from "./pages/InventoryPage"
import { LoansPage } from "./pages/LoansPage"
import { api } from "./services/api"
import { toIsoLocal } from "./utils/date"

const emptyItem = {
  asset_id: "",
  name: "",
  category: "",
  location: "",
  quantity: 1,
  notes: "",
}

const emptyLoan = {
  item_id: "",
  borrower_name: "",
  borrower_division: "",
  quantity: 1,
  expected_return_at: "",
  notes: "",
}

function App() {
  const [user, setUser] = useState(null)
  const [authMode, setAuthMode] = useState("login")
  const [authForm, setAuthForm] = useState({ name: "", email: "", password: "", role: "staff" })
  const [items, setItems] = useState([])
  const [loans, setLoans] = useState([])
  const [itemForm, setItemForm] = useState(emptyItem)
  const [loanForm, setLoanForm] = useState(emptyLoan)
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState("")
  const [activeTab, setActiveTab] = useState("dashboard")
  const [searchQuery, setSearchQuery] = useState("")

  const isAdmin = user?.role === "admin"

  const stats = useMemo(() => {
    const totalStock = items.reduce((sum, item) => sum + item.quantity, 0)
    const pending = loans.filter((loan) => loan.status === "pending").length
    const active = loans.filter((loan) => loan.status === "approved").length
    const lowStock = items.filter((item) => item.status !== "available").length
    return { totalStock, pending, active, lowStock }
  }, [items, loans])

  const filteredItems = useMemo(() => {
    const query = searchQuery.trim().toLowerCase()
    if (!query) return items

    return items.filter((item) =>
      [item.asset_id, item.name, item.category, item.location, item.status]
        .filter(Boolean)
        .some((value) => String(value).toLowerCase().includes(query)),
    )
  }, [items, searchQuery])

  const filteredLoans = useMemo(() => {
    const query = searchQuery.trim().toLowerCase()
    if (!query) return loans

    return loans.filter((loan) =>
      [
        loan.item_name,
        loan.borrower_name,
        loan.borrower_division,
        loan.status,
        loan.notes,
        loan.approval_notes,
      ]
        .filter(Boolean)
        .some((value) => String(value).toLowerCase().includes(query)),
    )
  }, [loans, searchQuery])

  async function loadData() {
    if (!localStorage.getItem("cyber_inventory_token")) return

    setLoading(true)
    try {
      const [itemData, loanData] = await Promise.all([api.items(), api.loans()])
      setItems(itemData)
      setLoans(loanData)
    } catch (error) {
      setMessage(error.message)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    const token = localStorage.getItem("cyber_inventory_token")
    if (!token) return

    api
      .me()
      .then((data) => {
        setUser(data)
        loadData()
      })
      .catch(() => {
        localStorage.removeItem("cyber_inventory_token")
      })
  }, [])

  async function handleAuth(event) {
    event.preventDefault()
    setLoading(true)
    setMessage("")

    try {
      const payload =
        authMode === "login"
          ? { email: authForm.email, password: authForm.password }
          : authForm
      const response = authMode === "login" ? await api.login(payload) : await api.register(payload)
      localStorage.setItem("cyber_inventory_token", response.token)
      setUser(response.user)
      await loadData()
    } catch (error) {
      setMessage(error.message)
    } finally {
      setLoading(false)
    }
  }

  async function handleCreateItem(event) {
    event.preventDefault()
    setLoading(true)
    setMessage("")

    try {
      await api.createItem({
        ...itemForm,
        quantity: Number(itemForm.quantity),
      })
      setItemForm(emptyItem)
      await loadData()
      setMessage("Item has been added successfully.")
    } catch (error) {
      setMessage(error.message)
    } finally {
      setLoading(false)
    }
  }

  async function handleUpdateItem(id, payload) {
    setLoading(true)
    setMessage("")

    try {
      const updated = await api.updateItem(id, payload)
      await loadData()
      return updated
    } catch (error) {
      setMessage(error.message)
      throw error
    } finally {
      setLoading(false)
    }
  }

  async function handleDeleteItem(id) {
    setLoading(true)
    setMessage("")

    try {
      await api.deleteItem(id)
      await loadData()
      setMessage("Item has been removed successfully.")
    } catch (error) {
      setMessage(error.message)
      throw error
    } finally {
      setLoading(false)
    }
  }

  async function handleCreateLoan(event) {
    event.preventDefault()
    setLoading(true)
    setMessage("")

    try {
      await api.createLoan({
        ...loanForm,
        quantity: Number(loanForm.quantity),
        expected_return_at: toIsoLocal(loanForm.expected_return_at),
      })
      setLoanForm(emptyLoan)
      await loadData()
      setMessage("Loan request has been submitted for approval.")
    } catch (error) {
      setMessage(error.message)
    } finally {
      setLoading(false)
    }
  }

  async function decideLoan(id, status) {
    setLoading(true)
    setMessage("")

    try {
      await api.decideLoan(id, {
        status,
        approval_notes: status === "approved" ? "Approved" : "Rejected",
      })
      await loadData()
    } catch (error) {
      setMessage(error.message)
    } finally {
      setLoading(false)
    }
  }

  async function returnLoan(id) {
    setLoading(true)
    setMessage("")

    try {
      await api.returnLoan(id, {
        return_notes: "Item has been returned",
      })
      await loadData()
    } catch (error) {
      setMessage(error.message)
    } finally {
      setLoading(false)
    }
  }

  function logout() {
    localStorage.removeItem("cyber_inventory_token")
    setUser(null)
    setItems([])
    setLoans([])
  }

  if (!user) {
    return (
      <AuthPage
        authMode={authMode}
        authForm={authForm}
        setAuthForm={setAuthForm}
        onSubmit={handleAuth}
        onToggleMode={() => setAuthMode(authMode === "login" ? "register" : "login")}
        loading={loading}
        message={message}
      />
    )
  }

  return (
    <AppShell
      user={user}
      loading={loading}
      stats={stats}
      activeTab={activeTab}
      setActiveTab={setActiveTab}
      onRefresh={loadData}
      onLogout={logout}
      message={message}
      searchQuery={searchQuery}
      setSearchQuery={setSearchQuery}
      resultCount={filteredItems.length + filteredLoans.length}
    >
      {activeTab === "dashboard" && (
        <DashboardPage
          items={filteredItems}
          loans={filteredLoans}
          setActiveTab={setActiveTab}
          searchQuery={searchQuery}
        />
      )}

      {activeTab === "inventory" && (
        <InventoryPage
          items={filteredItems}
          isAdmin={isAdmin}
          itemForm={itemForm}
          setItemForm={setItemForm}
          onCreateItem={handleCreateItem}
          onUpdateItem={handleUpdateItem}
          onDeleteItem={handleDeleteItem}
          loading={loading}
          searchQuery={searchQuery}
        />
      )}

      {activeTab === "loans" && (
        <LoansPage
          items={items}
          loans={filteredLoans}
          isAdmin={isAdmin}
          loanForm={loanForm}
          setLoanForm={setLoanForm}
          onCreateLoan={handleCreateLoan}
          onReturn={returnLoan}
          loading={loading}
          searchQuery={searchQuery}
        />
      )}

      {activeTab === "approval" && (
        <ApprovalPage loans={filteredLoans} isAdmin={isAdmin} onDecision={decideLoan} searchQuery={searchQuery} />
      )}
    </AppShell>
  )
}

export default App
