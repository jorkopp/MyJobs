import { useCallback, useMemo, useState } from 'react'
import { signInWithPopup } from 'firebase/auth'
import { http } from '../api/http'
import { useSessionBootstrap } from '../hooks/useSessionBootstrap'
import { AuthContext } from './authContext'
import { auth, firebaseEnabled, googleProvider } from '../lib/firebase'

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

  const loginWithGoogle = useCallback(async () => {
    if (!firebaseEnabled || !auth || !googleProvider) {
      throw new Error('Google sign-in is not configured yet')
    }
    const result = await signInWithPopup(auth, googleProvider)
    const idToken = await result.user.getIdToken()
    const { data } = await http.post('/auth/google', { idToken })
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
      loginWithGoogle,
      register,
      logout,
      refresh,
      setUser,
    }),
    [user, loading, login, loginWithGoogle, register, logout, refresh]
  )

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}
