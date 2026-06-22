export function toIsoLocal(value) {
  return value ? new Date(value).toISOString() : null
}

export function formatDate(value) {
  if (!value) return "-"
  return new Intl.DateTimeFormat("id-ID", {
    dateStyle: "medium",
    timeStyle: "short",
  }).format(new Date(value))
}
