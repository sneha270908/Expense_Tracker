import React, { useState } from 'react'
import { Outlet, NavLink, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { LayoutDashboard, Receipt, LogOut, Menu, X, TrendingUp } from 'lucide-react'
import './Layout.css'

export default function Layout() {
  const { user, logout } = useAuth()
  const navigate = useNavigate()
  const [mobileOpen, setMobileOpen] = useState(false)

  const handleLogout = () => {
    logout()
    navigate('/login')
  }

  const navItems = [
    { to: '/dashboard', icon: <LayoutDashboard size={18} />, label: 'Dashboard' },
    { to: '/expenses',  icon: <Receipt size={18} />,         label: 'Expenses' },
  ]

  return (
    <div className="layout">
      {/* Mobile overlay */}
      {mobileOpen && <div className="layout__overlay" onClick={() => setMobileOpen(false)} />}

      {/* Sidebar */}
      <aside className={`sidebar ${mobileOpen ? 'sidebar--open' : ''}`}>
        <div className="sidebar__logo">
          <TrendingUp size={22} color="var(--accent2)" />
          <span>SpendLens</span>
        </div>

        <nav className="sidebar__nav">
          {navItems.map(item => (
            <NavLink
              key={item.to}
              to={item.to}
              className={({ isActive }) => `sidebar__link ${isActive ? 'sidebar__link--active' : ''}`}
              onClick={() => setMobileOpen(false)}
            >
              {item.icon}
              <span>{item.label}</span>
            </NavLink>
          ))}
        </nav>

        <div className="sidebar__footer">
          <div className="sidebar__user">
            <div className="sidebar__avatar">{user?.name?.[0]?.toUpperCase()}</div>
            <div className="sidebar__user-info">
              <div className="sidebar__user-name">{user?.name}</div>
              <div className="sidebar__user-email">{user?.email}</div>
            </div>
          </div>
          <button className="sidebar__logout" onClick={handleLogout} title="Logout">
            <LogOut size={16} />
          </button>
        </div>
      </aside>

      {/* Main */}
      <main className="layout__main">
        <div className="layout__topbar">
          <button className="layout__menu-btn" onClick={() => setMobileOpen(true)}>
            <Menu size={22} />
          </button>
        </div>
        <div className="layout__content">
          <Outlet />
        </div>
      </main>
    </div>
  )
}
