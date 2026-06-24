import { FiBell, FiMenu, FiRefreshCw, FiSearch, FiSun } from "react-icons/fi"

export function Topbar({ user, loading, onRefresh, onLogout, activeTitle, searchQuery, setSearchQuery, resultCount }) {
  return (
    <header className="glass-panel sticky top-4 z-20 mb-6 px-4 py-3">
      <div className="flex flex-col gap-4 xl:flex-row xl:items-center xl:justify-between">
        <div className="flex items-center justify-between gap-4">
          <div>
            <p className="text-sm text-cyber-dim">Good morning, {user.name}</p>
            <h1 className="mt-1 text-2xl font-semibold sm:text-3xl">{activeTitle}</h1>
          </div>
          <button className="icon-btn lg:hidden" title="Menu">
            <FiMenu />
          </button>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <label className="relative min-w-[240px] flex-1 xl:w-80 xl:flex-none">
            <FiSearch className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-cyber-dim" />
            <input
              className="input pl-10"
              placeholder="Search item, Asset ID, borrower..."
              value={searchQuery}
              onChange={(event) => setSearchQuery(event.target.value)}
            />
            {searchQuery && (
              <span className="absolute right-3 top-1/2 -translate-y-1/2 rounded-md bg-cyber-panel2 px-2 py-0.5 text-xs text-cyber-dim">
                {resultCount}
              </span>
            )}
          </label>
          <button className="icon-btn" onClick={onRefresh} title="Refresh data">
            <FiRefreshCw className={loading ? "animate-spin" : ""} />
          </button>
          <button className="icon-btn" title="Notifications">
            <FiBell />
          </button>
          <button className="icon-btn" title="Theme">
            <FiSun />
          </button>
          <button onClick={onLogout} className="flex items-center gap-3 rounded-lg border border-cyber-line bg-cyber-panel2/60 px-3 py-2 transition hover:border-cyber-green">
            <div className="grid h-9 w-9 place-items-center rounded-lg bg-cyber-green/15 text-cyber-green">
              {user.name.slice(0, 1).toUpperCase()}
            </div>
            <div className="text-left">
              <p className="text-sm font-medium">{user.name}</p>
              <p className="text-xs text-cyber-dim">{user.role}</p>
            </div>
          </button>
        </div>
      </div>
    </header>
  )
}
