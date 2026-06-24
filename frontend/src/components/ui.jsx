import { useMemo, useState } from "react"
import { FiCalendar, FiChevronDown, FiChevronLeft, FiChevronRight, FiCheck, FiX } from "react-icons/fi"
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

export function SelectField({ label, value, onChange, options, placeholder = "Select option", required = true }) {
  const [open, setOpen] = useState(false)
  const selected = options.find((option) => option.value === value)

  return (
    <label className="relative block" onBlur={(event) => !event.currentTarget.contains(event.relatedTarget) && setOpen(false)}>
      <span className="mb-2 block text-sm text-cyber-dim">{label}</span>
      <input className="sr-only" tabIndex={-1} required={required} value={value} onChange={() => {}} />
      <button
        type="button"
        className={classNames(
          "flex w-full items-center justify-between gap-3 rounded-lg border border-cyber-line bg-cyber-black/70 px-3 py-2 text-left text-cyber-white outline-none transition",
          open && "border-cyber-green",
        )}
        onClick={() => setOpen((current) => !current)}
      >
        <span className={selected ? "truncate" : "truncate text-cyber-dim"}>{selected?.label || placeholder}</span>
        <FiChevronDown className={classNames("shrink-0 text-cyber-green transition", open && "rotate-180")} />
      </button>

      {open && (
        <div className="absolute z-40 mt-2 max-h-64 w-full overflow-y-auto rounded-lg border border-cyber-line bg-cyber-panel p-1 shadow-[0_18px_42px_rgba(0,0,0,0.45)]">
          {options.map((option) => (
            <button
              key={option.value}
              type="button"
              className={classNames(
                "flex w-full items-center justify-between gap-3 rounded-md px-3 py-2 text-left text-sm transition",
                option.value === value
                  ? "bg-cyber-green/12 text-cyber-green"
                  : "text-cyber-white hover:bg-cyber-panel2",
              )}
              onMouseDown={(event) => event.preventDefault()}
              onClick={() => {
                onChange(option.value)
                setOpen(false)
              }}
            >
              <span className="truncate">{option.label}</span>
              {option.value === value && <FiCheck className="shrink-0" />}
            </button>
          ))}
        </div>
      )}
    </label>
  )
}

export function DateTimeField({ label, value, onChange, required = true }) {
  const [open, setOpen] = useState(false)
  const parsed = parseDateTimeValue(value)
  const [visibleMonth, setVisibleMonth] = useState(parsed.date || new Date())
  const [timeValue, setTimeValue] = useState(parsed.time || "09:00")
  const days = useMemo(() => buildCalendarDays(visibleMonth), [visibleMonth])
  const monthLabel = new Intl.DateTimeFormat("en", { month: "long", year: "numeric" }).format(visibleMonth)

  function selectDate(date) {
    onChange(`${toDateInputValue(date)}T${timeValue}`)
  }

  function updateTime(nextTime) {
    setTimeValue(nextTime)
    if (parsed.date && isTimeValue(nextTime)) {
      onChange(`${toDateInputValue(parsed.date)}T${nextTime}`)
    }
  }

  return (
    <label className="relative block" onBlur={(event) => !event.currentTarget.contains(event.relatedTarget) && setOpen(false)}>
      <span className="mb-2 block text-sm text-cyber-dim">{label}</span>
      <input className="sr-only" tabIndex={-1} required={required} value={value} onChange={() => {}} />
      <button
        type="button"
        className={classNames(
          "flex w-full items-center justify-between gap-3 rounded-lg border border-cyber-line bg-cyber-black/70 px-3 py-2 text-left text-cyber-white transition",
          open && "border-cyber-green",
        )}
        onClick={() => setOpen((current) => !current)}
      >
        <span className={value ? "" : "text-cyber-dim"}>{value ? formatDateTimeLabel(value) : "Select date and time"}</span>
        <span className="grid h-7 w-7 place-items-center rounded-md border border-cyber-line text-cyber-green">
          <FiCalendar />
        </span>
      </button>

      {open && (
        <div className="absolute z-40 mt-2 w-full min-w-[320px] rounded-lg border border-cyber-line bg-cyber-panel p-3 shadow-[0_18px_42px_rgba(0,0,0,0.45)]">
          <div className="mb-3 flex items-center justify-between">
            <button type="button" className="icon-btn h-8 w-8" onMouseDown={(event) => event.preventDefault()} onClick={() => setVisibleMonth(addMonths(visibleMonth, -1))}>
              <FiChevronLeft />
            </button>
            <p className="text-sm font-medium text-cyber-white">{monthLabel}</p>
            <button type="button" className="icon-btn h-8 w-8" onMouseDown={(event) => event.preventDefault()} onClick={() => setVisibleMonth(addMonths(visibleMonth, 1))}>
              <FiChevronRight />
            </button>
          </div>

          <div className="grid grid-cols-7 gap-1 text-center text-xs text-cyber-dim">
            {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map((day) => (
              <span key={day} className="py-1">{day}</span>
            ))}
          </div>

          <div className="mt-1 grid grid-cols-7 gap-1">
            {days.map((day) => {
              const selected = parsed.date && toDateInputValue(parsed.date) === toDateInputValue(day.date)
              return (
                <button
                  key={day.key}
                  type="button"
                  className={classNames(
                    "rounded-md px-2 py-2 text-sm transition",
                    day.inMonth ? "text-cyber-white hover:bg-cyber-panel2" : "text-cyber-dim/45",
                    selected && "bg-cyber-green text-cyber-black hover:bg-cyber-green",
                  )}
                  onMouseDown={(event) => event.preventDefault()}
                  onClick={() => selectDate(day.date)}
                >
                  {day.date.getDate()}
                </button>
              )
            })}
          </div>

          <div className="mt-3 flex items-center gap-2 border-t border-cyber-line pt-3">
            <span className="text-sm text-cyber-dim">Time</span>
            <input
              className="input py-1.5"
              inputMode="numeric"
              pattern="[0-9]{2}:[0-9]{2}"
              placeholder="09:00"
              value={timeValue}
              onChange={(event) => updateTime(event.target.value)}
            />
            <button
              type="button"
              className="btn-primary py-1.5 text-sm"
              onMouseDown={(event) => event.preventDefault()}
              onClick={() => setOpen(false)}
              disabled={!value}
            >
              Done
            </button>
          </div>
        </div>
      )}
    </label>
  )
}

function parseDateTimeValue(value) {
  if (!value) return { date: null, time: "" }
  const [datePart, timePart = ""] = value.split("T")
  const [year, month, day] = datePart.split("-").map(Number)
  if (!year || !month || !day) return { date: null, time: "" }
  return { date: new Date(year, month - 1, day), time: timePart.slice(0, 5) }
}

function buildCalendarDays(visibleMonth) {
  const year = visibleMonth.getFullYear()
  const month = visibleMonth.getMonth()
  const firstDay = new Date(year, month, 1)
  const start = new Date(year, month, 1 - firstDay.getDay())

  return Array.from({ length: 42 }, (_, index) => {
    const date = new Date(start)
    date.setDate(start.getDate() + index)
    return {
      key: toDateInputValue(date),
      date,
      inMonth: date.getMonth() === month,
    }
  })
}

function addMonths(date, amount) {
  return new Date(date.getFullYear(), date.getMonth() + amount, 1)
}

function toDateInputValue(date) {
  const year = date.getFullYear()
  const month = String(date.getMonth() + 1).padStart(2, "0")
  const day = String(date.getDate()).padStart(2, "0")
  return `${year}-${month}-${day}`
}

function isTimeValue(value) {
  return /^([01]\d|2[0-3]):[0-5]\d$/.test(value)
}

function formatDateTimeLabel(value) {
  const parsed = parseDateTimeValue(value)
  if (!parsed.date) return value
  return `${new Intl.DateTimeFormat("en", { dateStyle: "medium" }).format(parsed.date)} at ${parsed.time || "--:--"}`
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
