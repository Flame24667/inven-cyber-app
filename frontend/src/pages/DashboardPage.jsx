import {
  FiAlertTriangle,
  FiArchive,
  FiBox,
  FiCheckCircle,
  FiClock,
  FiPackage,
  FiShoppingBag,
  FiUploadCloud,
} from "react-icons/fi"
import { Status } from "../components/ui"
import { formatDate } from "../utils/date"

export function DashboardPage({ items, loans, setActiveTab, searchQuery }) {
  const visibleStock = items.reduce((sum, item) => sum + item.quantity, 0)
  const lowItems = items.filter((item) => item.status !== "available")
  const pendingLoans = loans.filter((loan) => loan.status === "pending")
  const activeLoans = loans.filter((loan) => loan.status === "approved")
  const recentItems = items.slice(0, 6)

  return (
    <div className="space-y-4">
      {searchQuery && (
        <section className="glass-panel flex flex-wrap items-center justify-between gap-3 p-4">
          <p className="text-sm text-cyber-dim">
            Showing results for <span className="font-medium text-cyber-white">"{searchQuery}"</span>.
          </p>
          <div className="flex gap-2 text-sm">
            <span className="rounded-md border border-cyber-line px-2 py-1 text-cyber-dim">{items.length} items</span>
            <span className="rounded-md border border-cyber-line px-2 py-1 text-cyber-dim">{loans.length} loans</span>
          </div>
        </section>
      )}

      <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-5">
        <MetricCard title="Total Items" value={items.length} detail="Registered assets" tone="cyan" icon={<FiBox />} />
        <MetricCard title="Total Stock" value={visibleStock} detail="Current quantity" tone="green" icon={<FiPackage />} />
        <MetricCard title="Low Stock" value={lowItems.length} detail="Needs attention" tone="amber" icon={<FiAlertTriangle />} />
        <MetricCard title="Pending Approval" value={pendingLoans.length} detail="Waiting for decision" tone="purple" icon={<FiClock />} />
        <MetricCard title="Active Loans" value={activeLoans.length} detail="Return tracking" tone="blue" icon={<FiUploadCloud />} />
      </section>

      <section className="grid gap-4 xl:grid-cols-[300px_1fr_360px]">
        <AlertsPanel lowItems={lowItems} pendingLoans={pendingLoans} activeLoans={activeLoans} setActiveTab={setActiveTab} />
        <PendingApprovalQueue loans={pendingLoans.slice(0, 5)} setActiveTab={setActiveTab} />
        <ActiveLoanList loans={activeLoans.slice(0, 5)} setActiveTab={setActiveTab} />
      </section>

      <section className="grid gap-4 xl:grid-cols-[360px_1fr]">
        <LowStockList items={lowItems.slice(0, 5)} setActiveTab={setActiveTab} />
        <RecentInventory items={recentItems} setActiveTab={setActiveTab} />
      </section>
    </div>
  )
}

function MetricCard({ title, value, detail, tone, icon }) {
  const toneMap = {
    cyan: ["#20d9ff", "border-cyber-cyan/40 text-cyber-cyan"],
    green: ["#28f5b5", "border-cyber-green/40 text-cyber-green"],
    amber: ["#f7c948", "border-cyber-amber/40 text-cyber-amber"],
    purple: ["#8a5cff", "border-cyber-purple/40 text-cyber-purple"],
    blue: ["#4f8cff", "border-cyber-blue/40 text-cyber-blue"],
  }
  const [accent, colorClass] = toneMap[tone]

  return (
    <article className={`metric-card ${colorClass}`} style={{ "--card-accent": accent }}>
      <div className="flex items-start justify-between gap-3">
        <div>
          <p className="text-sm text-cyber-dim">{title}</p>
          <p className="mt-3 text-3xl font-semibold text-cyber-white">{Number(value).toLocaleString("id-ID")}</p>
          <p className="mt-2 text-sm text-cyber-dim">{detail}</p>
        </div>
        <div className="grid h-11 w-11 place-items-center rounded-lg border border-current bg-current/10 text-xl">
          {icon}
        </div>
      </div>
    </article>
  )
}

function AlertsPanel({ lowItems, pendingLoans, activeLoans, setActiveTab }) {
  const alerts = [
    {
      label: "Low stock",
      value: lowItems.length,
      detail: "Review reorder needs",
      tone: "text-cyber-amber border-cyber-amber/30 bg-cyber-amber/10",
      target: "inventory",
    },
    {
      label: "Pending approval",
      value: pendingLoans.length,
      detail: "Admin decision needed",
      tone: "text-cyber-purple border-cyber-purple/30 bg-cyber-purple/10",
      target: "approval",
    },
    {
      label: "Active loans",
      value: activeLoans.length,
      detail: "Monitor return dates",
      tone: "text-cyber-cyan border-cyber-cyan/30 bg-cyber-cyan/10",
      target: "loans",
    },
  ]

  return (
    <section className="glass-panel p-5">
      <div className="mb-5 flex items-center gap-2">
        <FiAlertTriangle className="text-cyber-amber" />
        <h2 className="text-lg font-semibold">Operational Alerts</h2>
      </div>
      <div className="space-y-3">
        {alerts.map((alert) => (
          <button key={alert.label} onClick={() => setActiveTab(alert.target)} className={`flex w-full items-center justify-between rounded-lg border p-3 text-left ${alert.tone}`}>
            <span>
              <span className="block font-medium text-cyber-white">{alert.label}</span>
              <span className="text-sm text-cyber-dim">{alert.detail}</span>
            </span>
            <span className="rounded-md bg-cyber-black/50 px-2 py-1 font-mono text-sm">{alert.value}</span>
          </button>
        ))}
      </div>
    </section>
  )
}

function PendingApprovalQueue({ loans, setActiveTab }) {
  return (
    <section className="glass-panel p-5">
      <PanelHeader icon={<FiClock />} title="Pending Approval" action="Open queue" onClick={() => setActiveTab("approval")} />
      {loans.length === 0 ? (
        <CompactEmpty icon={<FiCheckCircle />} title="No pending requests" detail="Loan requests that need approval will appear here." />
      ) : (
        <div className="space-y-3">
          {loans.map((loan) => (
            <button key={loan.id} onClick={() => setActiveTab("approval")} className="flex w-full items-center justify-between gap-4 rounded-lg border border-cyber-line bg-cyber-black/45 p-3 text-left transition hover:border-cyber-amber">
              <span className="min-w-0">
                <span className="block truncate font-medium">{loan.item_name}</span>
                <span className="mt-1 block text-sm text-cyber-dim">{loan.borrower_name} / {loan.borrower_division}</span>
              </span>
              <span className="shrink-0 rounded-md border border-cyber-amber/40 px-2 py-1 font-mono text-sm text-cyber-amber">{loan.quantity}</span>
            </button>
          ))}
        </div>
      )}
    </section>
  )
}

function ActiveLoanList({ loans, setActiveTab }) {
  return (
    <section className="glass-panel p-5">
      <PanelHeader icon={<FiUploadCloud />} title="Active Loans" action="View loans" onClick={() => setActiveTab("loans")} />
      {loans.length === 0 ? (
        <CompactEmpty icon={<FiArchive />} title="No active loans" detail="Approved loans waiting for return will appear here." />
      ) : (
        <div className="space-y-3">
          {loans.map((loan) => (
            <button key={loan.id} onClick={() => setActiveTab("loans")} className="w-full rounded-lg border border-cyber-line bg-cyber-black/45 p-3 text-left transition hover:border-cyber-cyan">
              <div className="flex items-center justify-between gap-3">
                <p className="truncate font-medium">{loan.item_name}</p>
                <span className="font-mono text-sm text-cyber-cyan">{loan.quantity}</span>
              </div>
              <p className="mt-1 text-sm text-cyber-dim">{loan.borrower_name}</p>
              <p className="mt-2 text-xs text-cyber-dim">Expected return: {formatDate(loan.expected_return_at)}</p>
            </button>
          ))}
        </div>
      )}
    </section>
  )
}

function LowStockList({ items, setActiveTab }) {
  return (
    <section className="glass-panel p-5">
      <PanelHeader icon={<FiAlertTriangle />} title="Low Stock" action="View items" onClick={() => setActiveTab("inventory")} />
      {items.length === 0 ? (
        <CompactEmpty icon={<FiCheckCircle />} title="Stock looks stable" detail="Items below the stock threshold will appear here." />
      ) : (
        <div className="space-y-3">
          {items.map((item) => (
            <button key={item.id} onClick={() => setActiveTab("inventory")} className="flex w-full items-center justify-between gap-3 rounded-lg border border-cyber-line bg-cyber-black/45 p-3 text-left transition hover:border-cyber-amber">
              <span className="min-w-0">
                <span className="block truncate font-medium">{item.name}</span>
                <span className="mt-1 block font-mono text-xs text-cyber-dim">{item.asset_id}</span>
              </span>
              <span className="font-mono text-cyber-amber">{item.quantity}</span>
            </button>
          ))}
        </div>
      )}
    </section>
  )
}

function RecentInventory({ items, setActiveTab }) {
  return (
    <section className="glass-panel p-5">
      <PanelHeader icon={<FiShoppingBag />} title="Recent Inventory" action="View all" onClick={() => setActiveTab("inventory")} />
      <div className="table-wrap">
        <table className="data-table">
          <thead>
            <tr>
              <th>Product</th>
              <th>Asset ID</th>
              <th>Category</th>
              <th>Status</th>
              <th>Qty</th>
              <th>Updated At</th>
            </tr>
          </thead>
          <tbody>
            {items.map((item) => (
              <tr key={item.id}>
                <td>
                  <div className="flex items-center gap-3">
                    <div className="grid h-10 w-10 place-items-center rounded-lg border border-cyber-line bg-cyber-panel2 text-cyber-cyan">
                      <FiShoppingBag />
                    </div>
                    <span className="font-medium">{item.name}</span>
                  </div>
                </td>
                <td className="font-mono text-cyber-green">{item.asset_id}</td>
                <td>{item.category}</td>
                <td><Status status={item.status} /></td>
                <td className="font-mono">{item.quantity}</td>
                <td>{formatDate(item.updated_at)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  )
}

function PanelHeader({ icon, title, action, onClick }) {
  return (
    <div className="mb-4 flex items-center justify-between gap-3">
      <div className="flex items-center gap-2">
        <span className="text-cyber-green">{icon}</span>
        <h2 className="text-lg font-semibold">{title}</h2>
      </div>
      <button onClick={onClick} className="small-btn">{action}</button>
    </div>
  )
}

function CompactEmpty({ icon, title, detail }) {
  return (
    <div className="grid min-h-40 place-items-center rounded-lg border border-dashed border-cyber-line bg-cyber-black/40 p-6 text-center">
      <div>
        <div className="mx-auto mb-3 text-2xl text-cyber-green">{icon}</div>
        <p className="font-medium">{title}</p>
        <p className="mt-2 max-w-xs text-sm text-cyber-dim">{detail}</p>
      </div>
    </div>
  )
}
