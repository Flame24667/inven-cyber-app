import { FiCheckCircle, FiClock, FiInbox, FiXCircle } from "react-icons/fi"
import { formatDate } from "../utils/date"
import { EmptyState, Panel, Status } from "../components/ui"

export function ApprovalPage({ loans, isAdmin, onDecision, searchQuery }) {
  const pendingLoans = loans.filter((loan) => loan.status === "pending")
  const approvedLoans = loans.filter((loan) => loan.status === "approved")
  const closedLoans = loans.filter((loan) => ["rejected", "returned"].includes(loan.status))

  return (
    <section className="space-y-4">
      <div className="grid gap-4 md:grid-cols-3">
        <ApprovalStat icon={<FiClock />} label="Pending" value={pendingLoans.length} tone="text-cyber-amber" />
        <ApprovalStat icon={<FiCheckCircle />} label="Approved Active" value={approvedLoans.length} tone="text-cyber-green" />
        <ApprovalStat icon={<FiInbox />} label="Closed" value={closedLoans.length} tone="text-cyber-dim" />
      </div>

      <Panel title="Loan Approval" icon={<FiCheckCircle />}>
        {loans.length === 0 ? (
          <EmptyState
            icon={<FiInbox />}
            title={searchQuery ? "No matching approval requests" : "No approval requests yet"}
            description={
              searchQuery
                ? "Try another borrower, item, division, or status."
                : "Loan requests will enter this approval center before inventory stock is deducted."
            }
          />
        ) : (
          <div className="table-wrap">
            <table className="data-table">
              <thead>
                <tr>
                  <th>Item</th>
                  <th>Borrower</th>
                  <th>Qty</th>
                  <th>Borrowed</th>
                  <th>Return</th>
                  <th>Status</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                {loans.map((loan) => (
                  <tr key={loan.id}>
                    <td>{loan.item_name}</td>
                    <td>
                      <p className="font-medium">{loan.borrower_name}</p>
                      <p className="text-xs text-cyber-dim">{loan.borrower_division}</p>
                    </td>
                    <td className="font-mono">{loan.quantity}</td>
                    <td>{formatDate(loan.borrowed_at)}</td>
                    <td>{formatDate(loan.expected_return_at)}</td>
                    <td><Status status={loan.status} /></td>
                    <td>
                      {isAdmin && loan.status === "pending" ? (
                        <div className="flex gap-2">
                          <button className="small-btn" onClick={() => onDecision(loan.id, "approved")}><FiCheckCircle /> Approve</button>
                          <button className="small-btn danger" onClick={() => onDecision(loan.id, "rejected")}><FiXCircle /> Reject</button>
                        </div>
                      ) : (
                        <span className="text-cyber-dim">-</span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </Panel>
    </section>
  )
}

function ApprovalStat({ icon, label, value, tone }) {
  return (
    <div className="glass-panel flex items-center justify-between p-4">
      <div>
        <p className="text-sm text-cyber-dim">{label}</p>
        <p className="mt-2 text-3xl font-semibold">{value}</p>
      </div>
      <div className={`grid h-12 w-12 place-items-center rounded-lg border border-cyber-line bg-cyber-panel2 text-xl ${tone}`}>
        {icon}
      </div>
    </div>
  )
}
