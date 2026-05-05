import React, { createContext, useContext, useState, useEffect } from 'react'

const AuthContext = createContext(null)

// Simulated JWT token encode/decode
function createToken(user) {
  const payload = btoa(JSON.stringify({ ...user, exp: Date.now() + 86400000 }))
  return `mock.${payload}.signature`
}

function decodeToken(token) {
  try {
    const payload = token.split('.')[1]
    return JSON.parse(atob(payload))
  } catch {
    return null
  }
}

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const token = localStorage.getItem('et_token')
    if (token) {
      const decoded = decodeToken(token)
      if (decoded && decoded.exp > Date.now()) {
        setUser(decoded)
      } else {
        localStorage.removeItem('et_token')
      }
    }
    setLoading(false)
  }, [])

  const register = async ({ name, email, password }) => {
    // Simulate API call
    await new Promise(r => setTimeout(r, 800))
    const users = JSON.parse(localStorage.getItem('et_users') || '[]')
    if (users.find(u => u.email === email)) {
      throw new Error('Email already registered')
    }
    const newUser = { id: Date.now().toString(), name, email }
    users.push({ ...newUser, password })
    localStorage.setItem('et_users', JSON.stringify(users))
    const token = createToken(newUser)
    localStorage.setItem('et_token', token)
    setUser(newUser)
    return newUser
  }

  const login = async ({ email, password }) => {
    await new Promise(r => setTimeout(r, 800))
    const users = JSON.parse(localStorage.getItem('et_users') || '[]')
    const found = users.find(u => u.email === email && u.password === password)
    if (!found) throw new Error('Invalid email or password')
    const { password: _, ...userInfo } = found
    const token = createToken(userInfo)
    localStorage.setItem('et_token', token)
    setUser(userInfo)
    return userInfo
  }

  const logout = () => {
    localStorage.removeItem('et_token')
    setUser(null)
  }

  return (
    <AuthContext.Provider value={{ user, loading, register, login, logout }}>
      {children}
    </AuthContext.Provider>
  )
}

export const useAuth = () => useContext(AuthContext)
