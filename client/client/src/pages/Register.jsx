import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../hooks/useAuth'
import './Pages.css'

export default function Register() {
  const { register } = useAuth()
  const navigate = useNavigate()

  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [busy, setBusy] = useState(false)

  async function onSubmit(e) {
    e.preventDefault()
    setError('')
    if (password.length < 8) {
      setError('Password must be at least 8 characters.')
      return
    }
    if (!/[A-Za-z]/.test(password) || !/[0-9]/.test(password)) {
      setError('Password must include at least one letter and one number.')
      return
    }
    setBusy(true)
    try {
      await register(email, password)
      navigate('/profile', { replace: true })
    } catch (err) {
      setError(err.message || 'Could not create account')
    } finally {
      setBusy(false)
    }
  }

  return (
    <div className="mj-panel">
      <h1>Create account</h1>
      <p className="mj-muted">Password must be 8+ characters with letters and numbers.</p>
      <form className="mj-form" onSubmit={onSubmit}>
        <label className="mj-field">
          <span>Email</span>
          <input
            type="email"
            autoComplete="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </label>
        <label className="mj-field">
          <span>Password</span>
          <input
            type="password"
            autoComplete="new-password"
            required
            minLength={8}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </label>
        {error ? <p className="mj-error">{error}</p> : null}
        <button type="submit" className="mj-btn mj-btn-primary" disabled={busy}>
          {busy ? 'Creating…' : 'Create account'}
        </button>
      </form>
      <p className="mj-muted">
        Already have an account? <Link to="/login">Sign in</Link>
      </p>
    </div>
  )
}
