import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { TrendingUp, Eye, EyeOff, AlertCircle } from 'lucide-react'
import './AuthPage.css'

export default function RegisterPage() {
  const [form, setForm] = useState({ name: '', email: '', password: '', confirm: '' })
  const [showPass, setShowPass] = useState(false)
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const { register } = useAuth()
  const navigate = useNavigate()

  const validate = () => {
    if (!form.name.trim()) return 'Name is required'
    if (!form.email.trim()) return 'Email is required'
    if (!/\S+@\S+\.\S+/.test(form.email)) return 'Enter a valid email'
    if (form.password.length < 6) return 'Password must be at least 6 characters'
    if (form.password !== form.confirm) return 'Passwords do not match'
    return null
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    const err = validate()
    if (err) { setError(err); return }
    setError('')
    setLoading(true)
    try {
      await register(form)
      navigate('/dashboard')
    } catch (e) {
      setError(e.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="auth-page">
      <div className="auth-bg" />
      <div className="auth-card fade-up">
        <div className="auth-logo">
          <TrendingUp size={24} color="var(--accent2)" />
          <span>SpendLens</span>
        </div>
        <h1 className="auth-title">Create account</h1>
        <p className="auth-sub">Start tracking in seconds</p>

        {error && (
          <div className="auth-error">
            <AlertCircle size={15} />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="auth-form">
          <div className="field">
            <label className="field__label">Full Name</label>
            <input
              className="field__input"
              type="text"
              placeholder="Anmol Singh"
              value={form.name}
              onChange={e => setForm(p => ({ ...p, name: e.target.value }))}
              autoFocus
            />
          </div>
          <div className="field">
            <label className="field__label">Email</label>
            <input
              className="field__input"
              type="email"
              placeholder="you@example.com"
              value={form.email}
              onChange={e => setForm(p => ({ ...p, email: e.target.value }))}
            />
          </div>
          <div className="field">
            <label className="field__label">Password</label>
            <div className="field__wrap">
              <input
                className="field__input"
                type={showPass ? 'text' : 'password'}
                placeholder="Min 6 characters"
                value={form.password}
                onChange={e => setForm(p => ({ ...p, password: e.target.value }))}
              />
              <button type="button" className="field__eye" onClick={() => setShowPass(p => !p)}>
                {showPass ? <EyeOff size={16} /> : <Eye size={16} />}
              </button>
            </div>
          </div>
          <div className="field">
            <label className="field__label">Confirm Password</label>
            <input
              className="field__input"
              type="password"
              placeholder="••••••••"
              value={form.confirm}
              onChange={e => setForm(p => ({ ...p, confirm: e.target.value }))}
            />
          </div>

          <button type="submit" className="auth-btn" disabled={loading}>
            {loading ? <span className="spinner" /> : 'Create Account'}
          </button>
        </form>

        <p className="auth-switch">
          Already have an account? <Link to="/login">Sign in</Link>
        </p>
      </div>
    </div>
  )
}
