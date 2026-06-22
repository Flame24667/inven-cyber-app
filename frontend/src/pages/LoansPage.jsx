import { FiClock, FiInbox, FiUploadCloud } from "react-icons/fi"
import { formatDate } from "../utils/date"
import { EmptyState, Field, Panel, Status, Textarea } from "../components/ui"

export function LoansPage({ items, loans, isAdmin, loanForm, setLoanForm, onCreateLoan, onReturn, loading, searchQuery }) {
  return (
    <section className="grid gap-6 lg:grid-cols-[380px_1fr]">
      <Panel title="Request Loan" icon={<FiUploadCloud />}>
        <form onSubmit={onCreateLoan} className="grid gap-4">
          <label>
            <span className="mb-2 block text-sm text-cyber-dim">Item</span>
            <select className="input" required value={loanForm.item_id} onChange={(event) => setLoanForm({ ...loanForm, item_id: event.target.value })}>
              <option value="">Select item</option>
              {items.map((item) => (
                <option key={item.id} value={item.id}>{item.name} / stock {item.quantity}</option>
              ))}
            </select>
          </label>
          <Field label="Borrower Name" value={loanForm.borrower_name} onChange={(value) => setLoanForm({ ...loanForm, borrower_name: value })} />
          <Field label="Borrower Division" value={loanForm.borrower_division} onChange={(value) => setLoanForm({ ...loanForm, borrower_division: value })} />
          <Field label="Quantity" type="number" value={loanForm.quantity} onChange={(value) => setLoanForm({ ...loanForm, quantity: value })} />
          <Field label="Borrow Date" type="datetime-local" value={loanForm.borrowed_at} onChange={(value) => setLoanForm({ ...loanForm, borrowed_at: value })} />
          <Field label="Expected Return" type="datetime-local" value={loanForm.expected_return_at} onChange={(value) => setLoanForm({ ...loanForm, expected_return_at: value })} />
          <Textarea label="Notes" value={loanForm.notes} onChange={(value) => setLoanForm({ ...loanForm, notes: value })} />
          <button className="btn-primary" disabled={loading}>Submit Request</button>
        </form>
      </Panel>

      <LoanTable loans={loans} isAdmin={isAdmin} onReturn={onReturn} searchQuery={searchQuery} />
    </section>
  )
}

function LoanTable({ loans, isAdmin, onReturn, searchQuery }) {
  return (
    <Panel title="Loan History" icon={<FiClock />}>
      {loans.length === 0 ? (
        <EmptyState
          icon={<FiInbox />}
          title={searchQuery ? "No matching loan requests" : "No loan requests yet"}
          description={
            searchQuery
              ? "Try another item, borrower, division, status, or note."
              : "Submitted loan requests will appear here with approval status and return tracking."
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
                <th>Expected Return</th>
                <th>Returned</th>
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
                  <td>{formatDate(loan.returned_at)}</td>
                  <td><Status status={loan.status} /></td>
                  <td>
                    {isAdmin && loan.status === "approved" ? (
                      <button className="small-btn" onClick={() => onReturn(loan.id)}>Return</button>
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
  )
}
