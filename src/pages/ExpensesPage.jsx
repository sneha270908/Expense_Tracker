import React, { useState, useMemo } from 'react'
import { useExpenses, CATEGORIES } from '../context/ExpenseContext'
import { Plus, Pencil, Trash2, Search, Filter, X, AlertCircle, Check } from 'lucide-react'
import { format, parseISO } from 'date-fns'
import './ExpensesPage.css'

function fmt(n) {
  return new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 0 }).format(n)
}

const EMPTY_FORM = {
  amount: '',
  category: 'food',
  date: format(new Date(), 'yyyy-MM-dd'),
  note: '',
}

export default function ExpensesPage() {
  const { expenses, loading, addExpense, updateExpense, deleteExpense } = useExpenses()
  const [modal, setModal] = useState(null) // null | 'add' | {id,...expense}
  const [search, setSearch] = useState('')
  const [filterCat, setFilterCat] = useState('all')
  const [deleteConfirm, setDeleteConfirm] = useState(null)
  const [toast, setToast] = useState(null)

  const showToast = (msg, type = 'success') => {
    setToast({ msg, type })
    setTimeout(() => setToast(null), 2500)
  }

  const filtered = useMemo(() => {
    return expenses.filter(e => {
      const matchCat = filterCat === 'all' || e.category === filterCat
      const matchSearch = !search || e.note?.toLowerCase().includes(search.toLowerCase()) ||
        CATEGORIES.find(c => c.id === e.category)?.label.toLowerCase().includes(search.toLowerCase())
      return matchCat && matchSearch
    })
  }, [expenses, search, filterCat])

  const grouped = useMemo(() => {
    const groups = {}
    filtered.forEach(e => {
      const key = format(parseISO(e.date), 'MMMM yyyy')
      if (!groups[key]) groups[key] = []
      groups[key].push(e)
    })
    return Object.entries(groups).sort((a, b) => {
      const da = new Date(a[1][0].date), db = new Date(b[1][0].date)
      return db - da
    })
  }, [filtered])

  const handleDelete = async (id) => {
    await deleteExpense(id)
    setDeleteConfirm(null)
    showToast('Expense deleted')
  }

  const openEdit = (exp) => setModal(exp)

  return (
    <div className="exp-page fade-up">
      {/* Header */}
      <div className="exp-page__header">
        <div>
          <h1 className="exp-page__title">Expenses</h1>
          <p className="exp-page__sub">{expenses.length} total records</p>
        </div>
        <button className="exp-page__add-btn" onClick={() => setModal('add')}>
          <Plus size={16} /> Add Expense
        </button>
      </div>

      {/* Filters */}
      <div className="exp-filters">
        <div className="exp-search">
          <Search size={15} color="var(--text3)" />
          <input
            placeholder="Search expenses..."
            value={search}
            onChange={e => setSearch(e.target.value)}
          />
          {search && <button onClick={() => setSearch('')}><X size={14} /></button>}
        </div>
        <div className="exp-filter-cats">
          <button
            className={`exp-filter-pill ${filterCat === 'all' ? 'active' : ''}`}
            onClick={() => setFilterCat('all')}
          >All</button>
          {CATEGORIES.map(cat => (
            <button
              key={cat.id}
              className={`exp-filter-pill ${filterCat === cat.id ? 'active' : ''}`}
              onClick={() => setFilterCat(cat.id)}
              style={filterCat === cat.id ? { borderColor: cat.color, color: cat.color, background: `${cat.color}18` } : {}}
            >
              {cat.emoji} {cat.label}
            </button>
          ))}
        </div>
      </div>

      {/* List */}
      {expenses.length === 0 ? (
        <div className="exp-empty">
          <div style={{ fontSize: 48 }}>💸</div>
          <h3>No expenses yet</h3>
          <p>Start tracking by adding your first expense</p>
          <button className="exp-empty__btn" onClick={() => setModal('add')}>
            <Plus size={16} /> Add First Expense
          </button>
        </div>
      ) : filtered.length === 0 ? (
        <div className="exp-empty">
          <div style={{ fontSize: 48 }}>🔍</div>
          <h3>No results found</h3>
          <p>Try different search terms or filters</p>
        </div>
      ) : (
        <div className="exp-groups">
          {grouped.map(([month, items]) => {
            const monthTotal = items.reduce((s, e) => s + Number(e.amount), 0)
            return (
              <div key={month} className="exp-group">
                <div className="exp-group__header">
                  <span className="exp-group__month">{month}</span>
                  <span className="exp-group__total">{fmt(monthTotal)}</span>
                </div>
                <div className="exp-list">
                  {items.map(exp => {
                    const cat = CATEGORIES.find(c => c.id === exp.category)
                    return (
                      <div key={exp.id} className="exp-item">
                        <div className="exp-item__icon" style={{ background: `${cat?.color}22`, color: cat?.color }}>
                          {cat?.emoji}
                        </div>
                        <div className="exp-item__info">
                          <div className="exp-item__note">{exp.note || cat?.label}</div>
                          <div className="exp-item__meta">
                            <span className="exp-item__cat-badge" style={{ color: cat?.color, background: `${cat?.color}18` }}>
                              {cat?.label}
                            </span>
                            <span>·</span>
                            <span>{format(parseISO(exp.date), 'MMM d')}</span>
                          </div>
                        </div>
                        <div className="exp-item__right">
                          <div className="exp-item__amount">{fmt(exp.amount)}</div>
                          <div className="exp-item__actions">
                            <button className="exp-item__btn exp-item__btn--edit" onClick={() => openEdit(exp)}>
                              <Pencil size={14} />
                            </button>
                            <button className="exp-item__btn exp-item__btn--del" onClick={() => setDeleteConfirm(exp.id)}>
                              <Trash2 size={14} />
                            </button>
                          </div>
                        </div>
                      </div>
                    )
                  })}
                </div>
              </div>
            )
          })}
        </div>
      )}

      {/* Modal */}
      {modal && (
        <ExpenseModal
          initial={modal === 'add' ? EMPTY_FORM : modal}
          isEdit={modal !== 'add'}
          onClose={() => setModal(null)}
          onSave={async (data) => {
            if (modal === 'add') {
              await addExpense(data)
              showToast('Expense added!')
            } else {
              await updateExpense(modal.id, data)
              showToast('Expense updated!')
            }
            setModal(null)
          }}
          loading={loading}
        />
      )}

      {/* Delete confirm */}
      {deleteConfirm && (
        <div className="overlay" onClick={() => setDeleteConfirm(null)}>
          <div className="confirm-modal" onClick={e => e.stopPropagation()}>
            <div className="confirm-modal__icon"><Trash2 size={22} color="var(--red)" /></div>
            <h3>Delete expense?</h3>
            <p>This action cannot be undone.</p>
            <div className="confirm-modal__btns">
              <button className="confirm-modal__cancel" onClick={() => setDeleteConfirm(null)}>Cancel</button>
              <button className="confirm-modal__delete" onClick={() => handleDelete(deleteConfirm)} disabled={loading}>
                {loading ? 'Deleting...' : 'Delete'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Toast */}
      {toast && (
        <div className={`toast toast--${toast.type}`}>
          <Check size={15} /> {toast.msg}
        </div>
      )}
    </div>
  )
}

function ExpenseModal({ initial, isEdit, onClose, onSave, loading }) {
  const [form, setForm] = useState(initial)
  const [errors, setErrors] = useState({})

  const validate = () => {
    const errs = {}
    if (!form.amount || isNaN(Number(form.amount)) || Number(form.amount) <= 0)
      errs.amount = 'Enter a valid amount'
    if (!form.date) errs.date = 'Date is required'
    return errs
  }

  const handleSubmit = async () => {
    const errs = validate()
    if (Object.keys(errs).length) { setErrors(errs); return }
    await onSave({ ...form, amount: Number(form.amount) })
  }

  return (
    <div className="overlay" onClick={onClose}>
      <div className="modal fade-up" onClick={e => e.stopPropagation()}>
        <div className="modal__header">
          <h2 className="modal__title">{isEdit ? 'Edit Expense' : 'Add Expense'}</h2>
          <button className="modal__close" onClick={onClose}><X size={18} /></button>
        </div>

        <div className="modal__body">
          {/* Amount */}
          <div className="field">
            <label className="field__label">Amount (₹)</label>
            <input
              className={`field__input ${errors.amount ? 'field__input--err' : ''}`}
              type="number"
              placeholder="0"
              value={form.amount}
              onChange={e => { setForm(p => ({ ...p, amount: e.target.value })); setErrors(p => ({...p, amount:''})) }}
              autoFocus
            />
            {errors.amount && <span className="field__err"><AlertCircle size={12} />{errors.amount}</span>}
          </div>

          {/* Category */}
          <div className="field">
            <label className="field__label">Category</label>
            <div className="cat-grid">
              {CATEGORIES.map(cat => (
                <button
                  key={cat.id}
                  type="button"
                  className={`cat-btn ${form.category === cat.id ? 'cat-btn--active' : ''}`}
                  style={form.category === cat.id ? { borderColor: cat.color, background: `${cat.color}18` } : {}}
                  onClick={() => setForm(p => ({ ...p, category: cat.id }))}
                >
                  <span>{cat.emoji}</span>
                  <span>{cat.label.split(' ')[0]}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Date */}
          <div className="field">
            <label className="field__label">Date</label>
            <input
              className={`field__input ${errors.date ? 'field__input--err' : ''}`}
              type="date"
              value={form.date}
              max={format(new Date(), 'yyyy-MM-dd')}
              onChange={e => { setForm(p => ({ ...p, date: e.target.value })); setErrors(p => ({...p, date:''})) }}
            />
            {errors.date && <span className="field__err"><AlertCircle size={12} />{errors.date}</span>}
          </div>

          {/* Note */}
          <div className="field">
            <label className="field__label">Note <span style={{color:'var(--text3)',fontSize:11}}>(optional)</span></label>
            <input
              className="field__input"
              type="text"
              placeholder="e.g. Lunch at Cafe Coffee Day"
              value={form.note}
              onChange={e => setForm(p => ({ ...p, note: e.target.value }))}
            />
          </div>
        </div>

        <div className="modal__footer">
          <button className="modal__cancel" onClick={onClose}>Cancel</button>
          <button className="modal__save" onClick={handleSubmit} disabled={loading}>
            {loading ? <span className="spinner" /> : isEdit ? 'Update' : 'Add Expense'}
          </button>
        </div>
      </div>
    </div>
  )
}
