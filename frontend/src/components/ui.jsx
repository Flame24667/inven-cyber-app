import { FiX } from "react-icons/fi"
import { classNames } from "../utils/classNames"

export function Field({ label, value, onChange, type = "text", required = true, ...inputProps }) {
  return (
    <label className="block">
      <span className="mb-2 block text-sm text-cyber-dim">{label}</span>
      <input className="input" required={required} type={type} value={value} onChange={(event) => onChange(event.target.value)} {...inputProps} />
    </label>
  )
}

export function Textarea({ label, value, onChange }) {
  return (
    <label className="block">
      <span className="mb-2 block text-sm text-cyber-dim">{label}</span>
      <textarea className="input min-h-24 resize-y" value={value} onChange={(event) => onChange(event.target.value)} />
    </label>
  )
}

export function Stat({ icon, label, value, danger = false }) {
  return (
    <div className="border border-cyber-line bg-cyber-panel p-4">
      <div className="mb-3 flex items-center justify-between text-cyber-dim">
        <span>{label}</span>
        <span className={danger ? "text-cyber-danger" : "text-cyber-green"}>{icon}</span>
      </div>
      <p className="text-3xl font-semibold">{value}</p>
    </div>
  )
}

export function Tab({ active, onClick, children }) {
  return (
    <button
      onClick={onClick}
      className={classNames(
        "border-b-2 px-4 py-3 text-sm font-medium",
        active ? "border-cyber-green text-cyber-green" : "border-transparent text-cyber-dim hover:text-cyber-white",
      )}
    >
      {children}
    </button>
  )
}

export function Panel({ title, icon, children, wide = false }) {
  return (
    <div className={classNames("glass-panel p-5", wide && "lg:col-span-2")}>
      <div className="mb-4 flex items-center gap-2 border-b border-cyber-line pb-3">
        <span className="text-cyber-green">{icon}</span>
        <h2 className="text-base font-semibold">{title}</h2>
      </div>
      {children}
    </div>
  )
}

export function Status({ status }) {
  const styles = {
    available: "border-cyber-green text-cyber-green",
    low_stock: "border-cyber-amber text-cyber-amber",
    out_of_stock: "border-cyber-danger text-cyber-danger",
    pending: "border-cyber-amber text-cyber-amber",
    approved: "border-cyber-green text-cyber-green",
    rejected: "border-cyber-danger text-cyber-danger",
    returned: "border-cyber-dim text-cyber-dim",
  }

  return (
    <span className={classNames("inline-flex border px-2 py-1 text-xs", styles[status])}>
      {status.replaceAll("_", " ")}
    </span>
  )
}

export function Modal({ title, children, onClose }) {
  return (
    <div className="fixed inset-0 z-50 grid place-items-center bg-cyber-black/80 px-4 backdrop-blur-sm">
      <section className="glass-panel max-h-[86vh] w-full max-w-3xl overflow-y-auto">
        <div className="sticky top-0 flex items-center justify-between border-b border-cyber-line bg-cyber-panel px-4 py-3">
          <h2 className="font-semibold text-cyber-white">{title}</h2>
          <button className="icon-btn h-9 w-9" onClick={onClose} title="Close">
            <FiX />
          </button>
        </div>
        <div className="p-4">{children}</div>
      </section>
    </div>
  )
}

export function EmptyState({ icon, title, description, action }) {
  return (
    <div className="grid min-h-48 place-items-center rounded-lg border border-dashed border-cyber-line bg-cyber-black/40 p-8 text-center">
      <div>
        <div className="mx-auto mb-4 grid h-12 w-12 place-items-center rounded-lg border border-cyber-line bg-cyber-panel2 text-cyber-green">
          {icon}
        </div>
        <h3 className="font-semibold text-cyber-white">{title}</h3>
        <p className="mt-2 max-w-md text-sm leading-6 text-cyber-dim">{description}</p>
        {action && <div className="mt-5">{action}</div>}
      </div>
    </div>
  )
}
