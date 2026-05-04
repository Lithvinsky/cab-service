import { createContext, useMemo, useState } from 'react'
import api from '../utils/api'

export const AuthContext = createContext(null)

const getStoredUser = () => {
  const raw = localStorage.getItem('cab_user')
  return raw ? JSON.parse(raw) : null
}

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(getStoredUser)

  const login = async (payload) => {
    const response = await api.post('/auth/login', payload)
    localStorage.setItem('cab_token', response.data.token)
    localStorage.setItem('cab_user', JSON.stringify(response.data.user))
    setUser(response.data.user)
    return response.data.user
  }

  const signup = async (payload) => {
    await api.post('/auth/signup', payload)
  }

  const logout = () => {
    localStorage.removeItem('cab_token')
    localStorage.removeItem('cab_user')
    setUser(null)
  }

  const value = useMemo(() => ({ user, login, signup, logout }), [user])
  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}
