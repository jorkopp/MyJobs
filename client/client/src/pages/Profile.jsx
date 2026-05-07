import { useState } from 'react'
import { http } from '../api/http'
import { useAuth } from '../hooks/useAuth'
import {
  ROLE_CATEGORIES,
  INDUSTRIES,
  WORK_MODES,
  NOTIFY_CHANNELS,
  NOTIFY_FREQUENCIES,
} from '../constants/profileOptions'
import './Pages.css'

/**
 * Remount when the server user document changes so local form state stays aligned
 * without a sync effect (keeps React Compiler / ESLint happy).
 */
function ProfileEditor({ user }) {
  const { refresh, setUser } = useAuth()
  const p = user.profile || {}
  const [resumeText, setResumeText] = useState(p.resumeText || '')
  const [roleCategories, setRoleCategories] = useState(p.roleCategories || [])
  const [industry, setIndustry] = useState(p.industry || 'technology')
  const [workMode, setWorkMode] = useState(p.workMode || 'remote')
  const [notifyChannel, setNotifyChannel] = useState(p.notifyChannel || 'site')
  const [notifyFrequency, setNotifyFrequency] = useState(p.notifyFrequency || 'daily')
  const [phoneE164, setPhoneE164] = useState(p.phoneE164 || '')
  const [profileComplete, setProfileComplete] = useState(!!p.profileComplete)
  const [message, setMessage] = useState('')
  const [error, setError] = useState('')
  const [busy, setBusy] = useState(false)

  function toggleRole(value) {
    setRoleCategories((prev) =>
      prev.includes(value) ? prev.filter((x) => x !== value) : [...prev, value]
    )
  }

  async function onSubmit(e) {
    e.preventDefault()
    setMessage('')
    setError('')
    setBusy(true)
    try {
      const { data } = await http.patch('/profile', {
        resumeText,
        roleCategories,
        industry,
        workMode,
        notifyChannel,
        notifyFrequency,
        phoneE164: notifyChannel === 'sms' ? phoneE164 : '',
        profileComplete,
      })
      setUser((u) => ({ ...u, profile: data.profile }))
      await refresh()
      setMessage('Profile saved.')
    } catch (err) {
      setError(err.message || 'Save failed')
    } finally {
      setBusy(false)
    }
  }

  return (
    <div className="mj-panel mj-panel-wide">
      <h1>Your profile</h1>
      <p className="mj-muted">
        Tell MyJobs what you want next. This drives recommendations and notification
        settings (delivery is simulated in this demo—wire your provider in production).
      </p>
      <form className="mj-form" onSubmit={onSubmit}>
        <label className="mj-field">
          <span>Resume (paste text)</span>
          <textarea
            rows={8}
            value={resumeText}
            onChange={(e) => setResumeText(e.target.value)}
            placeholder="Summary, skills, and experience…"
          />
        </label>

        <fieldset className="mj-fieldset">
          <legend>Role categories you are open to</legend>
          <div className="mj-chips">
            {ROLE_CATEGORIES.map((r) => (
              <label key={r.value} className="mj-chip">
                <input
                  type="checkbox"
                  checked={roleCategories.includes(r.value)}
                  onChange={() => toggleRole(r.value)}
                />
                {r.label}
              </label>
            ))}
          </div>
        </fieldset>

        <label className="mj-field">
          <span>Industry focus</span>
          <select value={industry} onChange={(e) => setIndustry(e.target.value)}>
            {INDUSTRIES.map((i) => (
              <option key={i.value} value={i.value}>
                {i.label}
              </option>
            ))}
          </select>
        </label>

        <fieldset className="mj-fieldset">
          <legend>Work arrangement</legend>
          <div className="mj-inline">
            {WORK_MODES.map((w) => (
              <label key={w.value} className="mj-radio">
                <input
                  type="radio"
                  name="workMode"
                  value={w.value}
                  checked={workMode === w.value}
                  onChange={() => setWorkMode(w.value)}
                />
                {w.label}
              </label>
            ))}
          </div>
        </fieldset>

        <label className="mj-field">
          <span>How should we notify you?</span>
          <select value={notifyChannel} onChange={(e) => setNotifyChannel(e.target.value)}>
            {NOTIFY_CHANNELS.map((n) => (
              <option key={n.value} value={n.value}>
                {n.label}
              </option>
            ))}
          </select>
        </label>

        {notifyChannel === 'sms' ? (
          <label className="mj-field">
            <span>Mobile number (E.164, e.g. +15551234567)</span>
            <input
              type="tel"
              value={phoneE164}
              onChange={(e) => setPhoneE164(e.target.value)}
              placeholder="+1…"
            />
          </label>
        ) : null}

        <label className="mj-field">
          <span>How often?</span>
          <select
            value={notifyFrequency}
            onChange={(e) => setNotifyFrequency(e.target.value)}
          >
            {NOTIFY_FREQUENCIES.map((n) => (
              <option key={n.value} value={n.value}>
                {n.label}
              </option>
            ))}
          </select>
        </label>

        <label className="mj-check">
          <input
            type="checkbox"
            checked={profileComplete}
            onChange={(e) => setProfileComplete(e.target.checked)}
          />
          I have completed my preferences
        </label>

        {message ? <p className="mj-success">{message}</p> : null}
        {error ? <p className="mj-error">{error}</p> : null}

        <button type="submit" className="mj-btn mj-btn-primary" disabled={busy}>
          {busy ? 'Saving…' : 'Save profile'}
        </button>
      </form>
    </div>
  )
}

export default function Profile() {
  const { user, loading } = useAuth()

  if (loading) {
    return (
      <div className="mj-panel mj-center">
        <p>Loading profile…</p>
      </div>
    )
  }
  if (!user) return null

  return <ProfileEditor key={String(user.updatedAt || user.id)} user={user} />
}
