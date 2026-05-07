import { useCallback, useMemo, useState } from 'react'
import { signInWithPopup } from 'firebase/auth'
import { http } from '../api/http'
import { useSessionBootstrap } from '../hooks/useSessionBootstrap'
import { AuthContext } from './authContext'
import {
  auth,
  firebaseConfigError,
  firebaseEnabled,
  firebaseInitError,
  googleProvider,
} from '../lib/firebase'

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
    if (!firebaseEnabled) {
      throw new Error(
        firebaseConfigError ||
          'Google sign-in is not configured yet (missing Firebase web config in build)'
      )
    }
    if (firebaseInitError) {
      throw new Error(`Firebase init failed: ${String(firebaseInitError)}`)
    }
    if (!auth || !googleProvider) {
      throw new Error('Firebase auth is not initialized')
    }
    try {
      const result = await signInWithPopup(auth, googleProvider)
      const idToken = await result.user.getIdToken()
      const { data } = await http.post('/auth/google', { idToken })
      setUser(data.user)
      return data.user
    } catch (err) {
      const code = err?.code ? ` [${err.code}]` : ''
      const detail = err?.message || 'Google sign-in failed'
      console.error('[MyJobs] Google sign-in error:', err)
      throw new Error(`${detail}${code}`)
    }
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
