import { useState } from "react"
import { FiArchive, FiBox, FiPlus } from "react-icons/fi"
import { api } from "../services/api"
import { formatDate } from "../utils/date"
import { EmptyState, Field, Modal, Panel, Status, Textarea } from "../components/ui"

export function InventoryPage({ items, isAdmin, itemForm, setItemForm, onCreateItem, onUpdateItem, onDeleteItem, loading, searchQuery }) {
  const [detail, setDetail] = useState(null)
  const [detailError, setDetailError] = useState("")
  const [actionError, setActionError] = useState("")
  const [isEditingNotes, setIsEditingNotes] = useState(false)
  const [notesDraft, setNotesDraft] = useState("")

  async function openDetail(itemId) {
    setDetailError("")
    setActionError("")
    setIsEditingNotes(false)
    try {
      const fetched = await api.itemDetail(itemId)
      setDetail(fetched)
      setNotesDraft(fetched.notes || "")
    } catch (error) {
      setDetailError(error.message)
    }
  }

  async function changeQuantity(delta) {
    if (!detail) return
    const nextQty = detail.quantity + delta
    if (nextQty < 0) return

    setDetailError("")
    setActionError("")

    try {
      await onUpdateItem(detail.id, { quantity: nextQty })
      const updated = await api.itemDetail(detail.id)
      setDetail(updated)
      setNotesDraft(updated.notes || "")
    } catch (error) {
      setActionError(error.message)
    }
  }

  async function saveNotes() {
    if (!detail) return

    setDetailError("")
    setActionError("")

    try {
      await onUpdateItem(detail.id, { notes: notesDraft })
      const updated = await api.itemDetail(detail.id)
      setDetail(updated)
      setNotesDraft(updated.notes || "")
      setIsEditingNotes(false)
    } catch (error) {
      setActionError(error.message)
    }
  }

  function cancelNotesEdit() {
    setIsEditingNotes(false)
    setNotesDraft(detail?.notes || "")
  }

  async function removeItem(itemId) {
    setDetailError("")
    setActionError("")

    if (!window.confirm("Are you sure you want to remove this item?")) {
      return
    }

    try {
      await onDeleteItem(itemId)
    } catch (error) {
      setActionError(error.message)
    }
  }

  return (
    <section className="grid gap-6 lg:grid-cols-[380px_1fr]">
      {isAdmin && (
        <Panel title="Add Item" icon={<FiPlus />}>
          <form onSubmit={onCreateItem} className="grid gap-4">
            <Field label="Asset ID" value={itemForm.asset_id} onChange={(value) => setItemForm({ ...itemForm, asset_id: value })} />
            <Field label="Item Name" value={itemForm.name} onChange={(value) => setItemForm({ ...itemForm, name: value })} />
            <Field label="Category" value={itemForm.category} onChange={(value) => setItemForm({ ...itemForm, category: value })} />
            <Field label="Location" value={itemForm.location} onChange={(value) => setItemForm({ ...itemForm, location: value })} />
            <Field label="Quantity" type="number" value={itemForm.quantity} onChange={(value) => setItemForm({ ...itemForm, quantity: value })} />
            <Textarea label="Notes" value={itemForm.notes} onChange={(value) => setItemForm({ ...itemForm, notes: value })} />
            <p className="rounded-lg border border-cyber-line bg-cyber-black/40 px-3 py-2 text-xs leading-5 text-cyber-dim">
              Inbound time is recorded automatically by the backend. Outbound time is recorded when a loan is approved.
            </p>
            <button className="btn-primary" disabled={loading}>Save Item</button>
          </form>
        </Panel>
      )}

      <Panel title="Item Directory" icon={<FiArchive />} wide={!isAdmin}>
        <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
          <p className="text-sm text-cyber-dim">
            {items.length} registered items, {items.filter((item) => item.status !== "available").length} need attention.
          </p>
          <span className="rounded-lg border border-cyber-line px-3 py-1 text-sm text-cyber-dim">Main Warehouse</span>
        </div>
        {detailError && <p className="mb-4 border border-cyber-danger px-3 py-2 text-sm text-cyber-danger">{detailError}</p>}
        {actionError && <p className="mb-4 border border-cyber-danger px-3 py-2 text-sm text-cyber-danger">{actionError}</p>}
        {items.length === 0 ? (
          <EmptyState
            icon={<FiBox />}
            title={searchQuery ? "No matching items" : "No items yet"}
            description={
              searchQuery
                ? "Try another item name, Asset ID, category, location, or status."
                : "Add the first asset record so dashboard metrics, loan requests, and approvals have inventory data."
            }
          />
        ) : (
          <div className="table-wrap">
            <table className="data-table">
              <thead>
                <tr>
                  <th>Asset ID</th>
                  <th>Item</th>
                  <th>Location</th>
                  <th>Qty</th>
                  <th>Inbound</th>
                  <th>Outbound</th>
                  <th>Status</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                {items.map((item) => (
                  <tr key={item.id}>
                    <td className="font-mono text-cyber-green">{item.asset_id}</td>
                    <td>
                      <p className="font-medium">{item.name}</p>
                      <p className="text-xs text-cyber-dim">{item.category}</p>
                    </td>
                    <td>{item.location}</td>
                    <td className="font-mono">{item.quantity}</td>
                    <td>{formatDate(item.incoming_at)}</td>
                    <td>{formatDate(item.outgoing_at)}</td>
                    <td><Status status={item.status} /></td>
                    <td>
                      <div className="flex flex-wrap items-center gap-2">
                        <button className="small-btn" onClick={() => openDetail(item.id)}>Detail</button>
                        {isAdmin && (
                          <button className="small-btn danger" onClick={() => removeItem(item.id)} disabled={loading}>
                            Remove
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </Panel>

      {detail && (
        <ItemDetailModal
          item={detail}
          onClose={() => setDetail(null)}
          onChangeQuantity={changeQuantity}
          isAdmin={isAdmin}
          isEditingNotes={isEditingNotes}
          notesDraft={notesDraft}
          setNotesDraft={setNotesDraft}
          onStartNotesEdit={() => setIsEditingNotes(true)}
          onCancelNotesEdit={cancelNotesEdit}
          onSaveNotes={saveNotes}
          loading={loading}
        />
      )}
    </section>
  )
}

function ItemDetailModal({ item, onClose, onChangeQuantity, isAdmin, isEditingNotes, notesDraft, setNotesDraft, onStartNotesEdit, onCancelNotesEdit, onSaveNotes, loading }) {
  return (
    <Modal title={`Item Detail / ${item.name}`} onClose={onClose}>
      <div className="grid gap-4 md:grid-cols-3">
        <Detail label="Asset ID" value={item.asset_id} mono />
        <Detail label="Category" value={item.category} />
        <Detail label="Location" value={item.location} />
        <div className="border border-cyber-line bg-cyber-black p-3">
          <div className="flex items-center justify-between gap-4">
            <div>
              <p className="mb-2 text-sm text-cyber-dim">Quantity</p>
              <p>{item.quantity}</p>
            </div>
            <div className="flex items-center gap-2">
              <button type="button" className="small-btn" onClick={() => onChangeQuantity(-1)} disabled={loading || item.quantity <= 0}>
                -
              </button>
              <button type="button" className="small-btn" onClick={() => onChangeQuantity(1)} disabled={loading}>
                +
              </button>
            </div>
          </div>
        </div>
        <Detail label="Inbound Date" value={formatDate(item.incoming_at)} />
        <Detail label="Outbound Date" value={formatDate(item.outgoing_at)} />
      </div>

      <div className="mt-4 border border-cyber-line bg-cyber-black p-3">
        <p className="mb-2 text-sm text-cyber-dim">Status</p>
        <Status status={item.status} />
      </div>

      <div className="mt-4 border border-cyber-line bg-cyber-black p-3 space-y-3">
        <div className="flex items-start justify-between gap-4">
          <p className="mb-2 text-sm text-cyber-dim">Notes</p>
          <div className="flex items-center gap-2">
            {!isEditingNotes ? (
              <button type="button" className="small-btn" onClick={onStartNotesEdit} disabled={loading}>
                Edit
              </button>
            ) : (
              <>
                <button type="button" className="small-btn" onClick={onCancelNotesEdit} disabled={loading}>
                  Cancel
                </button>
                <button type="button" className="small-btn" onClick={onSaveNotes} disabled={loading}>
                  Save
                </button>
              </>
            )}
          </div>
        </div>

        {!isEditingNotes ? (
          <p className="text-sm text-cyber-white whitespace-pre-wrap">{item.notes || "-"}</p>
        ) : (
          <textarea
            className="input min-h-24 w-full"
            value={notesDraft}
            onChange={(event) => setNotesDraft(event.target.value)}
          />
        )}
      </div>

      <div className="mt-5">
        <h3 className="mb-3 font-semibold">Loan History</h3>
        <div className="table-wrap">
          <table className="data-table">
            <thead>
              <tr>
                <th>Borrower</th>
                <th>Qty</th>
                <th>Borrowed</th>
                <th>Return</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {item.loan_history.length === 0 && (
                <tr>
                  <td colSpan="5" className="text-cyber-dim">No loan history yet.</td>
                </tr>
              )}
              {item.loan_history.map((loan) => (
                <tr key={loan.id}>
                  <td>
                    <p className="font-medium">{loan.borrower_name}</p>
                    <p className="text-xs text-cyber-dim">{loan.borrower_division}</p>
                  </td>
                  <td>{loan.quantity}</td>
                  <td>{formatDate(loan.borrowed_at)}</td>
                  <td>{formatDate(loan.returned_at || loan.expected_return_at)}</td>
                  <td><Status status={loan.status} /></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </Modal>
  )
}

function Detail({ label, value, mono = false }) {
  return (
    <div className="border border-cyber-line bg-cyber-black p-3">
      <p className="mb-2 text-sm text-cyber-dim">{label}</p>
      <p className={mono ? "font-mono text-cyber-green" : "text-cyber-white"}>{value || "-"}</p>
    </div>
  )
}
