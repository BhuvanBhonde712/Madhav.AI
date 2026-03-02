import { createContext, useContext, useState, useEffect } from 'react'
import axios from 'axios'

const AuthContext = createContext(null)

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)
  const [token, setToken] = useState(() => localStorage.getItem('madhav_token'))

  useEffect(() => {
    if (token) {
      axios.defaults.headers.common['Authorization'] = `Bearer ${token}`
      fetchProfile()
    } else {
      setLoading(false)
    }
  }, [token])

  const fetchProfile = async () => {
    try {
      const res = await axios.get('/api/auth/profile')
      setUser(res.data.user)
    } catch {
      localStorage.removeItem('madhav_token')
      setToken(null)
      delete axios.defaults.headers.common['Authorization']
    } finally {
      setLoading(false)
    }
  }

  const login = async (email, password) => {
    const res = await axios.post('/api/auth/login', { email, password })
    const { token: newToken, user: newUser } = res.data
    localStorage.setItem('madhav_token', newToken)
    axios.defaults.headers.common['Authorization'] = `Bearer ${newToken}`
    setToken(newToken)
    setUser(newUser)
    return newUser
  }

  const signup = async (name, email, password) => {
    const res = await axios.post('/api/auth/signup', { name, email, password })
    const { token: newToken, user: newUser } = res.data
    localStorage.setItem('madhav_token', newToken)
    axios.defaults.headers.common['Authorization'] = `Bearer ${newToken}`
    setToken(newToken)
    setUser(newUser)
    return newUser
  }

  const logout = () => {
    localStorage.removeItem('madhav_token')
    delete axios.defaults.headers.common['Authorization']
    setToken(null)
    setUser(null)
  }

  const continueAsGuest = () => {
    setUser({ name: 'Parth', isGuest: true })
    setLoading(false)
  }

  return (
    <AuthContext.Provider value={{ user, loading, login, signup, logout, continueAsGuest, token }}>
      {children}
    </AuthContext.Provider>
  )
}

export const useAuth = () => {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error('useAuth must be used within AuthProvider')
  return ctx
}