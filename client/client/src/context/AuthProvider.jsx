import { useCallback, useMemo, useState } from 'react'
import { http } from '../api/http'
import { useSessionBootstrap } from '../hooks/useSessionBootstrap'
import { AuthContext } from './authContext'

export default function AuthProvider({ children }) {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)

  const refresh = useCallback(async () => {
    try {
      const { data } = await http.get('/auth/me')
      setUser(data.user)
    } catch {
      setUser(null)
    } finally {
      setLoading(false)
    }
  }, [])

  useSessionBootstrap(refresh)

  const login = useCallback(async (email, password) => {
    const { data } = await http.post('/auth/login', { email, password })
    setUser(data.user)
    return data.user
  }, [])

  const register = useCallback(async (email, password) => {
    const { data } = await http.post('/auth/register', { email, password })
    setUser(data.user)
    return data.user
  }, [])

  const logout = useCallback(async () => {
    await http.post('/auth/logout')
    setUser(null)
  }, [])

  const value = useMemo(
    () => ({
      user,
      loading,
      login,
      register,
      logout,
      refresh,
      setUser,
    }),
    [user, loading, login, register, logout, refresh]
  )

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}
