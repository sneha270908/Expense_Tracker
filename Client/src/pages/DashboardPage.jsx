import React, { useMemo } from 'react'
import { useExpenses, CATEGORIES } from '../context/ExpenseContext'
import { useAuth } from '../context/AuthContext'
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer, BarChart, Bar, XAxis, YAxis, CartesianGrid } from 'recharts'
import { TrendingUp, TrendingDown, Wallet, Calendar, Plus } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import { format, subDays, parseISO } from 'date-fns'
import './DashboardPage.css'

function fmt(n) {
  return new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 0 }).format(n)
}

export default function DashboardPage() {
  const { expenses, totalSpent, byCategory, thisMonthTotal, loading } = useExpenses()
  const { user } = useAuth()
  const navigate = useNavigate()

  // Last 7 days bar chart data
  const last7 = useMemo(() => {
    return Array.from({ length: 7 }, (_, i) => {
      const d = subDays(new Date(), 6 - i)
      const key = format(d, 'yyyy-MM-dd')
      const total = expenses
        .filter(e => e.date === key)
        .reduce((s, e) => s + Number(e.amount), 0)
      return { day: format(d, 'EEE'), total }
    })
  }, [expenses])

  const recentExpenses = expenses.slice(0, 5)

  const COLORS = byCategory.map(c => c.color)

  return (
    <div className="dash fade-up">
      {/* Header */}
      <div className="dash__header">
        <div>
          <h1 className="dash__title">Good {getGreeting()}, {user?.name?.split(' ')[0]} 👋</h1>
          <p className="dash__sub">Here's your spending overview</p>
        </div>
        <button className="dash__add-btn" onClick={() => navigate('/expenses')}>
          <Plus size={16} />
          Add Expense
        </button>
      </div>

      {/* Stat cards */}
      <div className="dash__stats">
        <StatCard
          icon={<Wallet size={20} />}
          label="Total Spent"
          value={fmt(totalSpent)}
          color="var(--accent)"
          bg="var(--accent-glow)"
        />
        <StatCard
          icon={<Calendar size={20} />}
          label="This Month"
          value={fmt(thisMonthTotal)}
          color="var(--green)"
          bg="var(--green-dim)"
        />
        <StatCard
          icon={<TrendingUp size={20} />}
          label="Total Entries"
          value={expenses.length.toString()}
          color="var(--yellow)"
          bg="var(--yellow-dim)"
        />
        <StatCard
          icon={<TrendingDown size={20} />}
          label="Categories Used"
          value={byCategory.length.toString()}
          color="var(--blue)"
          bg="rgba(75,163,245,0.12)"
        />
      </div>

      {/* Charts row */}
      <div className="dash__charts">
        {/* Bar chart */}
        <div className="dash__chart-card">
          <h3 className="dash__section-title">Last 7 Days</h3>
          {expenses.length === 0 ? (
            <EmptyState text="Add expenses to see your trend" />
          ) : (
            <ResponsiveContainer width="100%" height={200}>
              <BarChart data={last7} barSize={28}>
                <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" vertical={false} />
                <XAxis dataKey="day" tick={{ fill: 'var(--text3)', fontSize: 12 }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fill: 'var(--text3)', fontSize: 11 }} axisLine={false} tickLine={false} tickFormatter={v => `₹${v}`} width={55} />
                <Tooltip
                  contentStyle={{ background: 'var(--card2)', border: '1px solid var(--border)', borderRadius: 8, color: 'var(--text)', fontSize: 13 }}
                  formatter={v => [fmt(v), 'Spent']}
                />
                <Bar dataKey="total" fill="var(--accent)" radius={[6, 6, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          )}
        </div>

        {/* Pie chart */}
        <div className="dash__chart-card">
          <h3 className="dash__section-title">By Category</h3>
          {byCategory.length === 0 ? (
            <EmptyState text="No category data yet" />
          ) : (
            <div className="dash__pie-wrap">
              <ResponsiveContainer width="100%" height={180}>
                <PieChart>
                  <Pie
                    data={byCategory}
                    dataKey="total"
                    nameKey="label"
                    cx="50%"
                    cy="50%"
                    innerRadius={50}
                    outerRadius={80}
                    paddingAngle={3}
                  >
                    {byCategory.map((c, i) => (
                      <Cell key={c.id} fill={c.color} />
                    ))}
                  </Pie>
                  <Tooltip
                    contentStyle={{ background: 'var(--card2)', border: '1px solid var(--border)', borderRadius: 8, color: 'var(--text)', fontSize: 13 }}
                    formatter={v => [fmt(v)]}
                  />
                </PieChart>
              </ResponsiveContainer>
              <div className="dash__pie-legend">
                {byCategory.map(c => (
                  <div key={c.id} className="dash__legend-item">
                    <span className="dash__legend-dot" style={{ background: c.color }} />
                    <span className="dash__legend-label">{c.emoji} {c.label}</span>
                    <span className="dash__legend-val">{fmt(c.total)}</span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Recent expenses */}
      <div className="dash__recent">
        <div className="dash__section-header">
          <h3 className="dash__section-title">Recent Expenses</h3>
          {expenses.length > 0 && (
            <button className="dash__view-all" onClick={() => navigate('/expenses')}>View all</button>
          )}
        </div>
        {recentExpenses.length === 0 ? (
          <EmptyState text="No expenses yet. Add your first one!" cta="Add Expense" onCta={() => navigate('/expenses')} />
        ) : (
          <div className="dash__expense-list">
            {recentExpenses.map(exp => {
              const cat = CATEGORIES.find(c => c.id === exp.category)
              return (
                <div key={exp.id} className="dash__expense-item">
                  <div className="dash__expense-icon" style={{ background: `${cat?.color}22`, color: cat?.color }}>
                    {cat?.emoji}
                  </div>
                  <div className="dash__expense-info">
                    <div className="dash__expense-note">{exp.note || cat?.label}</div>
                    <div className="dash__expense-meta">{cat?.label} · {format(parseISO(exp.date), 'MMM d, yyyy')}</div>
                  </div>
                  <div className="dash__expense-amount" style={{ color: 'var(--red)' }}>
                    {fmt(exp.amount)}
                  </div>
                </div>
              )
            })}
          </div>
        )}
      </div>
    </div>
  )
}

function StatCard({ icon, label, value, color, bg }) {
  return (
    <div className="stat-card">
      <div className="stat-card__icon" style={{ color, background: bg }}>{icon}</div>
      <div className="stat-card__value">{value}</div>
      <div className="stat-card__label">{label}</div>
    </div>
  )
}

function EmptyState({ text, cta, onCta }) {
  return (
    <div className="empty-state">
      <div className="empty-state__icon">📊</div>
      <p>{text}</p>
      {cta && <button className="empty-state__btn" onClick={onCta}>{cta}</button>}
    </div>
  )
}

function getGreeting() {
  const h = new Date().getHours()
  if (h < 12) return 'morning'
  if (h < 17) return 'afternoon'
  return 'evening'
}
