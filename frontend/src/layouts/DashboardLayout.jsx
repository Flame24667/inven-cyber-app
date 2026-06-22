import { Sidebar } from "./Sidebar"
import { Topbar } from "./Topbar"

const titles = {
  dashboard: "Dashboard Overview",
  inventory: "Inventory Control",
  loans: "Asset Loans",
  approval: "Approval Center",
}

export function DashboardLayout({
  user,
  loading,
  stats,
  activeTab,
  setActiveTab,
  onRefresh,
  onLogout,
  message,
  searchQuery,
  setSearchQuery,
  resultCount,
  children,
}) {
  return (
    <main className="enterprise-shell">
      <div className="mx-auto flex min-h-screen max-w-[1720px] gap-4 p-4">
        <Sidebar activeTab={activeTab} setActiveTab={setActiveTab} onRefresh={onRefresh} onLogout={onLogout} stats={stats} />
        <section className="min-w-0 flex-1">
          <Topbar
            user={user}
            loading={loading}
            activeTitle={titles[activeTab] || "Dashboard"}
            onRefresh={onRefresh}
            onLogout={onLogout}
            searchQuery={searchQuery}
            setSearchQuery={setSearchQuery}
            resultCount={resultCount}
          />

          <div className="mb-4 flex gap-2 overflow-x-auto lg:hidden">
            {Object.entries(titles).map(([id, label]) => (
              <button
                key={id}
                onClick={() => setActiveTab(id)}
                className={activeTab === id ? "small-btn" : "small-btn border-cyber-line text-cyber-dim"}
              >
                {label}
              </button>
            ))}
          </div>

          {message && (
            <p className="mb-5 rounded-lg border border-cyber-line bg-cyber-panel px-4 py-3 text-sm text-cyber-green">
              {message}
            </p>
          )}

          {children}
        </section>
      </div>
    </main>
  )
}
