import {
  FiAlertTriangle,
  FiArrowRight,
  FiBox,
  FiCheckCircle,
  FiClock,
  FiPackage,
  FiShoppingBag,
  FiTrendingDown,
  FiTrendingUp,
} from "react-icons/fi"
import { formatDate } from "../utils/date"
import { Status } from "../components/ui"

export function DashboardPage({ items, loans, stats, setActiveTab, searchQuery }) {
  const categories = buildCategories(items)
  const lowItems = items.filter((item) => item.status !== "available")
  const pendingLoans = loans.filter((loan) => loan.status === "pending")
  const activeLoans = loans.filter((loan) => loan.status === "approved")
  const recentLoans = loans.slice(0, 4)
  const recentItems = items.slice(0, 5)

  return (
    <div className="space-y-4">
      {searchQuery && (
        <section className="glass-panel flex flex-wrap items-center justify-between gap-3 p-4">
          <p className="text-sm text-cyber-dim">
            Showing dashboard results for <span className="font-medium text-cyber-white">"{searchQuery}"</span>.
          </p>
          <div className="flex gap-2 text-sm">
            <span className="rounded-md border border-cyber-line px-2 py-1 text-cyber-dim">{items.length} items</span>
            <span className="rounded-md border border-cyber-line px-2 py-1 text-cyber-dim">{loans.length} loans</span>
          </div>
        </section>
      )}

      <section className="grid gap-4 xl:grid-cols-[1fr_260px]">
        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
          <MetricCard
            title="Total Stock"
            value={stats.totalStock.toLocaleString("id-ID")}
            change="+12.5%"
            tone="cyan"
            icon={<FiPackage />}
          />
          <MetricCard
            title="Total Products"
            value={items.length.toLocaleString("id-ID")}
            change="+8.2%"
            tone="orange"
            icon={<FiBox />}
          />
          <MetricCard
            title="Low Stock Items"
            value={stats.lowStock}
            change="-4.3%"
            tone="red"
            icon={<FiAlertTriangle />}
            negative
          />
          <MetricCard
            title="Pending Approval"
            value={stats.pending}
            change="+15.7%"
            tone="purple"
            icon={<FiClock />}
          />
        </div>

        <section className="glass-panel p-5">
          <div className="mb-5 flex items-center gap-3">
            <div className="grid h-11 w-11 place-items-center rounded-lg border border-cyber-blue bg-cyber-blue/15 text-cyber-blue">
            <FiCheckCircle />
            </div>
            <div>
              <h2 className="font-semibold">AI Assistant</h2>
              <p className="text-sm text-cyber-dim">Operational summary</p>
            </div>
          </div>
          <p className="text-sm leading-6 text-cyber-dim">
            <span className="text-cyber-amber">{stats.lowStock + stats.pending}</span> items need attention:
            low stock and pending approvals.
          </p>
          <button onClick={() => setActiveTab(stats.pending > 0 ? "approval" : "inventory")} className="mt-5 small-btn">
            Review <FiArrowRight />
          </button>
        </section>
      </section>

      <section className="grid gap-4 xl:grid-cols-[300px_1fr_360px]">
        <AlertsPanel lowItems={lowItems} pendingLoans={pendingLoans} activeLoans={activeLoans} setActiveTab={setActiveTab} />
        <PendingApprovalQueue loans={pendingLoans.slice(0, 5)} setActiveTab={setActiveTab} />
        <ActivityFeed loans={recentLoans} items={items} />
      </section>

      <section>
        <RecentInventory items={recentItems} setActiveTab={setActiveTab} />
      </section>

      <section className="grid gap-4 xl:grid-cols-[1fr_420px]">
        <StockMovement items={items} loans={loans} />
        <CategoryMap categories={categories} totalStock={stats.totalStock} />
      </section>
    </div>
  )
}

function MetricCard({ title, value, change, tone, icon, negative = false }) {
  const toneMap = {
    cyan: ["#20d9ff", "border-cyber-cyan/40 text-cyber-cyan"],
    orange: ["#ff9f1a", "border-cyber-orange/40 text-cyber-orange"],
    red: ["#ff4f61", "border-cyber-danger/40 text-cyber-danger"],
    purple: ["#8a5cff", "border-cyber-purple/40 text-cyber-purple"],
  }
  const [accent, colorClass] = toneMap[tone]

  return (
    <article className={`metric-card ${colorClass}`} style={{ "--card-accent": accent }}>
      <div className="flex items-start justify-between gap-4">
        <div>
          <p className="text-sm text-cyber-dim">{title}</p>
          <p className="mt-3 text-3xl font-semibold text-cyber-white">{value}</p>
        </div>
        <div className="grid h-12 w-12 place-items-center rounded-lg border border-current bg-current/10 text-xl">
          {icon}
        </div>
      </div>
      <div className="mt-5 flex items-center justify-between gap-4">
        <p className={negative ? "flex items-center gap-1 text-sm text-cyber-danger" : "flex items-center gap-1 text-sm text-cyber-green"}>
          {negative ? <FiTrendingDown /> : <FiTrendingUp />} {change}
        </p>
        <div className="h-10 w-28 overflow-hidden rounded-md bg-cyber-black/60">
          <div className="sparkline h-full w-full bg-current/50" />
        </div>
      </div>
    </article>
  )
}

function StockMovement({ items, loans }) {
  const stockIn = items.reduce((sum, item) => sum + item.quantity, 0)
  const stockOut = loans.filter((loan) => loan.status === "approved").reduce((sum, loan) => sum + loan.quantity, 0)
  const returns = loans.filter((loan) => loan.status === "returned").reduce((sum, loan) => sum + loan.quantity, 0)

  return (
    <section className="glass-panel min-h-[260px] p-5">
      <div className="mb-5 flex items-center justify-between">
        <h2 className="text-lg font-semibold">Stock Movement</h2>
        <span className="rounded-lg border border-cyber-line px-3 py-1 text-sm text-cyber-dim">This Month</span>
      </div>
      <div className="relative h-48 overflow-hidden rounded-lg border border-cyber-line bg-cyber-black/60 p-5">
        <FlowLabel className="left-5 top-8" label="Opening Stock" value={stockIn + stockOut} tone="text-cyber-cyan" />
        <FlowLabel className="left-5 top-24" label="Stock In" value={stockIn} tone="text-cyber-green" />
        <FlowLabel className="left-5 bottom-8" label="Returns" value={returns} tone="text-cyber-purple" />
        <FlowLabel className="right-5 top-12 text-right" label="Approved Loans" value={stockOut} tone="text-cyber-orange" />
        <FlowLabel className="right-5 bottom-16 text-right" label="Stock Out" value={stockOut} tone="text-cyber-danger" />

        <div className="sankey-band left-[28%] top-14 w-[48%] bg-cyber-cyan/25" />
        <div className="sankey-band left-[28%] top-24 w-[48%] bg-cyber-green/20" />
        <div className="sankey-band left-[28%] bottom-14 w-[48%] bg-cyber-purple/20" />
        <div className="absolute left-1/2 top-6 h-[calc(100%-3rem)] border-l border-dashed border-cyber-dim/40" />
      </div>
    </section>
  )
}

function FlowLabel({ className, label, value, tone }) {
  return (
    <div className={`absolute z-10 ${className}`}>
      <p className={`text-sm font-medium ${tone}`}>{label}</p>
      <p className="mt-1 font-semibold text-cyber-white">{value.toLocaleString("id-ID")}</p>
    </div>
  )
}

function CategoryMap({ categories, totalStock }) {
  return (
    <section className="glass-panel min-h-[260px] p-5">
      <div className="mb-5 flex items-center justify-between">
        <h2 className="text-lg font-semibold">Top Categories</h2>
        <span className="rounded-lg border border-cyber-line px-3 py-1 text-sm text-cyber-dim">By Stock</span>
      </div>
      <div className="relative grid h-48 place-items-center">
        <div className="grid h-28 w-28 place-items-center rounded-full border border-cyber-cyan bg-cyber-cyan/10">
          <div className="text-center">
            <p className="text-2xl font-semibold">{totalStock.toLocaleString("id-ID")}</p>
            <p className="text-xs text-cyber-dim">Total Stock</p>
          </div>
        </div>
        {categories.map((category, index) => (
          <div key={category.name} className={`category-bubble category-bubble-${index}`}>
            <p className="text-xs text-cyber-dim">{category.name}</p>
            <p className="font-semibold">{category.total}</p>
          </div>
        ))}
      </div>
    </section>
  )
}

function AlertsPanel({ lowItems, pendingLoans, activeLoans, setActiveTab }) {
  const alerts = [
    {
      label: "Low stock",
      value: lowItems.length,
      detail: "Reorder recommended",
      tone: "text-cyber-amber border-cyber-amber/30 bg-cyber-amber/10",
      target: "inventory",
    },
    {
      label: "Pending approval",
      value: pendingLoans.length,
      detail: "Waiting for admin decision",
      tone: "text-cyber-purple border-cyber-purple/30 bg-cyber-purple/10",
      target: "approval",
    },
    {
      label: "Active loans",
      value: activeLoans.length,
      detail: "Return tracking needed",
      tone: "text-cyber-cyan border-cyber-cyan/30 bg-cyber-cyan/10",
      target: "loans",
    },
  ]

  return (
    <section className="glass-panel p-5">
      <div className="mb-5 flex items-center justify-between">
        <h2 className="text-lg font-semibold">Alerts</h2>
        <button onClick={() => setActiveTab("approval")} className="text-sm text-cyber-dim hover:text-cyber-green">View all</button>
      </div>
      <div className="space-y-3">
        {alerts.map((alert) => (
          <button key={alert.label} onClick={() => setActiveTab(alert.target)} className={`flex w-full items-center justify-between rounded-lg border p-3 text-left ${alert.tone}`}>
            <span>
              <span className="block font-medium text-cyber-white">{alert.label}: <span className="text-current">{alert.value}</span></span>
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
      <div className="mb-4 flex items-center justify-between">
        <h2 className="text-lg font-semibold">Pending Approval</h2>
        <button onClick={() => setActiveTab("approval")} className="small-btn">Open queue</button>
      </div>
      {loans.length === 0 ? (
        <div className="grid min-h-48 place-items-center rounded-lg border border-dashed border-cyber-line bg-cyber-black/40 p-6 text-center">
          <div>
            <FiCheckCircle className="mx-auto mb-3 text-2xl text-cyber-green" />
            <p className="font-medium">No pending requests</p>
            <p className="mt-2 text-sm text-cyber-dim">Loan requests that need approval will appear here.</p>
          </div>
        </div>
      ) : (
        <div className="space-y-3">
          {loans.map((loan) => (
            <button
              key={loan.id}
              onClick={() => setActiveTab("approval")}
              className="flex w-full items-center justify-between gap-4 rounded-lg border border-cyber-line bg-cyber-black/45 p-3 text-left transition hover:border-cyber-amber"
            >
              <span className="min-w-0">
                <span className="block truncate font-medium">{loan.item_name}</span>
                <span className="mt-1 block text-sm text-cyber-dim">{loan.borrower_name} / {loan.borrower_division}</span>
              </span>
              <span className="shrink-0 rounded-md border border-cyber-amber/40 px-2 py-1 font-mono text-sm text-cyber-amber">
                {loan.quantity}
              </span>
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
      <div className="mb-4 flex items-center justify-between">
        <h2 className="text-lg font-semibold">Recent Inventory</h2>
        <button onClick={() => setActiveTab("inventory")} className="small-btn">View all</button>
      </div>
      <div className="table-wrap">
        <table className="data-table">
          <thead>
            <tr>
              <th>Product</th>
              <th>SKU</th>
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
                <td className="font-mono text-cyber-green">{item.sku}</td>
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

function ActivityFeed({ loans, items }) {
  const fallback = items.slice(0, 3).map((item) => ({
    id: item.id,
    title: item.name,
    detail: `Stock available: ${item.quantity}`,
    time: formatDate(item.updated_at),
    tone: "bg-cyber-cyan",
  }))
  const activities = loans.length > 0
    ? loans.map((loan) => ({
        id: loan.id,
        title: loan.borrower_name,
        detail: `${loan.status} / ${loan.item_name}`,
        time: formatDate(loan.updated_at),
        tone: loan.status === "approved" ? "bg-cyber-green" : loan.status === "pending" ? "bg-cyber-amber" : "bg-cyber-danger",
      }))
    : fallback

  return (
    <section className="glass-panel p-5">
      <div className="mb-4 flex items-center justify-between">
        <h2 className="text-lg font-semibold">Activity Feed</h2>
        <span className="text-sm text-cyber-dim">Live</span>
      </div>
      <div className="space-y-4">
        {activities.map((activity) => (
          <div key={activity.id} className="relative flex gap-3 border-b border-cyber-line pb-4 last:border-0 last:pb-0">
            <span className={`mt-2 h-3 w-3 shrink-0 rounded-full ${activity.tone}`} />
            <div className="min-w-0 flex-1">
              <div className="flex items-center justify-between gap-3">
                <p className="truncate font-medium">{activity.title}</p>
                <p className="shrink-0 text-xs text-cyber-dim">{activity.time}</p>
              </div>
              <p className="mt-1 text-sm text-cyber-dim">{activity.detail}</p>
            </div>
          </div>
        ))}
      </div>
    </section>
  )
}

function buildCategories(items) {
  const map = new Map()
  items.forEach((item) => {
    map.set(item.category, (map.get(item.category) || 0) + item.quantity)
  })
  return [...map.entries()]
    .sort((a, b) => b[1] - a[1])
    .slice(0, 4)
    .map(([name, total]) => ({ name, total }))
}
