import { createContext, useContext, useEffect, useMemo, useState } from 'react'
import { loginService, registerService } from '../services/AuthService'

const AuthContext = createContext(null)

export const AuthProvider = ({ children }) => {
  const [session, setSession] = useState(null)
  const [authLoading, setAuthLoading] = useState(true)

  useEffect(() => {
    const savedSession = localStorage.getItem('session')
    if (savedSession) {
      setSession(JSON.parse(savedSession))
    }
    setAuthLoading(false)
  }, [])

  const login = async (credentials) => {
    const data = await loginService(credentials)
    const nextSession = {
      token: data.token,
      username: data.username,
      role: data.role
    }

    localStorage.setItem('session', JSON.stringify(nextSession))
    setSession(nextSession)
    return nextSession
  }

  const register = async (credentials) => {
    await registerService(credentials)
    return login(credentials)
  }

  const logout = () => {
    localStorage.removeItem('session')
    setSession(null)
  }

  const value = useMemo(() => ({
    session,
    authLoading,
    isAuthenticated: Boolean(session?.token),
    login,
    register,
    logout
  }), [session, authLoading])

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export const useAuth = () => {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error('useAuth debe usarse dentro de AuthProvider')
  }
  return context
}
