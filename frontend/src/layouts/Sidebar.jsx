import {
  FiAlertTriangle,
  FiArchive,
  FiBarChart2,
  FiBox,
  FiCheckSquare,
  FiGrid,
  FiLogOut,
  FiRefreshCw,
  FiSettings,
  FiShield,
  FiUploadCloud,
} from "react-icons/fi"
import { classNames } from "../utils/classNames"

const navigation = [
  { id: "dashboard", label: "Dashboard", icon: FiGrid },
  { id: "inventory", label: "Inventory", icon: FiBox },
  { id: "loans", label: "Loans", icon: FiUploadCloud },
  { id: "approval", label: "Approval", icon: FiCheckSquare },
]

export function Sidebar({ activeTab, setActiveTab, onRefresh, onLogout, stats }) {
  return (
    <aside className="glass-panel sticky top-4 hidden h-[calc(100vh-2rem)] w-64 shrink-0 flex-col overflow-hidden p-4 lg:flex">
      <div className="mb-8 flex items-center gap-3 px-2">
        <div className="grid h-11 w-11 place-items-center rounded-lg border border-cyber-cyan bg-cyber-cyan/10 text-cyber-cyan">
          <FiShield />
        </div>
        <div>
          <p className="text-xl font-semibold">INVEN</p>
          <p className="text-xs text-cyber-dim">Cyber Asset Suite</p>
        </div>
      </div>

      <nav className="space-y-2">
        {navigation.map((item) => {
          const Icon = item.icon
          const active = activeTab === item.id
          return (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              className={classNames(
                "flex w-full items-center justify-between rounded-lg border px-3 py-3 text-left transition",
                active
                  ? "border-cyber-cyan bg-cyber-cyan/10 text-cyber-white"
                  : "border-transparent text-cyber-dim hover:border-cyber-line hover:bg-cyber-panel2/60 hover:text-cyber-white",
              )}
            >
              <span className="flex items-center gap-3">
                <Icon className={active ? "text-cyber-cyan" : "text-cyber-dim"} />
                {item.label}
              </span>
              {active && <span className="h-2 w-2 rounded-full bg-cyber-cyan" />}
            </button>
          )
        })}
      </nav>

      <div className="mt-8 space-y-2 border-t border-cyber-line pt-4">
        <SidebarMeta icon={<FiArchive />} label="Total Stock" value={stats.totalStock} />
        <SidebarMeta icon={<FiAlertTriangle />} label="Need Attention" value={stats.lowStock + stats.pending} />
        <SidebarMeta icon={<FiBarChart2 />} label="Active Loans" value={stats.active} />
      </div>

      <div className="mt-auto space-y-2">
        <button className="flex w-full items-center gap-3 rounded-lg px-3 py-3 text-cyber-dim transition hover:bg-cyber-panel2 hover:text-cyber-white">
          <FiSettings /> Settings
        </button>
        <button onClick={onRefresh} className="flex w-full items-center gap-3 rounded-lg px-3 py-3 text-cyber-dim transition hover:bg-cyber-panel2 hover:text-cyber-white">
          <FiRefreshCw /> Refresh
        </button>
        <button onClick={onLogout} className="flex w-full items-center gap-3 rounded-lg px-3 py-3 text-cyber-dim transition hover:bg-cyber-panel2 hover:text-cyber-danger">
          <FiLogOut /> Logout
        </button>
      </div>

      <div className="mt-4 rounded-lg border border-cyber-line bg-cyber-black/70 p-4">
        <p className="text-sm text-cyber-dim">Warehouse</p>
        <p className="mt-1 font-medium">Main Warehouse</p>
        <div className="mt-4 grid aspect-square place-items-center rounded-lg border border-cyber-cyan/30 bg-cyber-cyan/5">
          <div className="h-16 w-16 rotate-45 rounded-lg border border-cyber-cyan bg-cyber-cyan/10" />
        </div>
      </div>
    </aside>
  )
}

function SidebarMeta({ icon, label, value }) {
  return (
    <div className="flex items-center justify-between rounded-lg border border-cyber-line bg-cyber-black/50 px-3 py-2">
      <span className="flex items-center gap-2 text-sm text-cyber-dim">{icon}{label}</span>
      <span className="font-mono text-cyber-green">{value}</span>
    </div>
  )
}
