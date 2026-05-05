import React, { createContext, useContext, useState, useEffect, useCallback } from 'react'
import { useAuth } from './AuthContext'

const ExpenseContext = createContext(null)

export const CATEGORIES = [
  { id: 'food',          label: 'Food & Dining',   emoji: '🍜', color: '#f97316' },
  { id: 'transport',     label: 'Transport',        emoji: '🚗', color: '#4ba3f5' },
  { id: 'shopping',      label: 'Shopping',         emoji: '🛍️', color: '#ec4899' },
  { id: 'entertainment', label: 'Entertainment',    emoji: '🎮', color: '#a594ff' },
  { id: 'health',        label: 'Health',           emoji: '💊', color: '#22d3a0' },
  { id: 'utilities',     label: 'Utilities',        emoji: '⚡', color: '#f5c542' },
  { id: 'education',     label: 'Education',        emoji: '📚', color: '#7c6dfa' },
  { id: 'travel',        label: 'Travel',           emoji: '✈️', color: '#06b6d4' },
  { id: 'other',         label: 'Other',            emoji: '📦', color: '#94a3b8' },
]

export function ExpenseProvider({ children }) {
  const { user } = useAuth()
  const [expenses, setExpenses] = useState([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)

  const storageKey = user ? `et_expenses_${user.id}` : null

  useEffect(() => {
    if (!storageKey) { setExpenses([]); return }
    setLoading(true)
    setTimeout(() => {
      try {
        const stored = JSON.parse(localStorage.getItem(storageKey) || '[]')
        setExpenses(stored)
      } catch {
        setError('Failed to load expenses')
      } finally {
        setLoading(false)
      }
    }, 400)
  }, [storageKey])

  const save = (data) => {
    localStorage.setItem(storageKey, JSON.stringify(data))
  }

  const addExpense = useCallback(async (expense) => {
    setLoading(true)
    await new Promise(r => setTimeout(r, 500))
    const newExpense = {
      id: Date.now().toString(),
      ...expense,
      createdAt: new Date().toISOString(),
    }
    setExpenses(prev => {
      const updated = [newExpense, ...prev]
      save(updated)
      return updated
    })
    setLoading(false)
    return newExpense
  }, [storageKey])

  const updateExpense = useCallback(async (id, updates) => {
    setLoading(true)
    await new Promise(r => setTimeout(r, 500))
    setExpenses(prev => {
      const updated = prev.map(e => e.id === id ? { ...e, ...updates, updatedAt: new Date().toISOString() } : e)
      save(updated)
      return updated
    })
    setLoading(false)
  }, [storageKey])

  const deleteExpense = useCallback(async (id) => {
    setLoading(true)
    await new Promise(r => setTimeout(r, 400))
    setExpenses(prev => {
      const updated = prev.filter(e => e.id !== id)
      save(updated)
      return updated
    })
    setLoading(false)
  }, [storageKey])

  // Computed stats
  const totalSpent = expenses.reduce((s, e) => s + Number(e.amount), 0)

  const byCategory = CATEGORIES.map(cat => ({
    ...cat,
    total: expenses.filter(e => e.category === cat.id).reduce((s, e) => s + Number(e.amount), 0),
    count: expenses.filter(e => e.category === cat.id).length,
  })).filter(c => c.total > 0).sort((a, b) => b.total - a.total)

  const thisMonth = expenses.filter(e => {
    const d = new Date(e.date)
    const now = new Date()
    return d.getMonth() === now.getMonth() && d.getFullYear() === now.getFullYear()
  })

  const thisMonthTotal = thisMonth.reduce((s, e) => s + Number(e.amount), 0)

  return (
    <ExpenseContext.Provider value={{
      expenses, loading, error,
      addExpense, updateExpense, deleteExpense,
      totalSpent, byCategory, thisMonthTotal, thisMonth,
      categories: CATEGORIES,
    }}>
      {children}
    </ExpenseContext.Provider>
  )
}

export const useExpenses = () => useContext(ExpenseContext)
