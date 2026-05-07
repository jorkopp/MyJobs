import { useCallback, useState } from 'react'
import { Link } from 'react-router-dom'
import { http } from '../api/http'
import { APPLICATION_STATUSES } from '../constants/profileOptions'
import { useSessionBootstrap } from '../hooks/useSessionBootstrap'
import './Pages.css'

const STATUS_ORDER = APPLICATION_STATUSES.map((s) => s.value)

export default function Dashboard() {
  const [grouped, setGrouped] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  const load = useCallback(async () => {
    setError('')
    setLoading(true)
    try {
      const { data } = await http.get('/applications', { params: { groupBy: 'status' } })
      setGrouped(data.grouped || {})
    } catch (e) {
      setError(e.message || 'Could not load applications')
    } finally {
      setLoading(false)
    }
  }, [])

  useSessionBootstrap(load)

  async function updateStatus(id, status) {
    await http.patch(`/applications/${id}`, { status })
    await load()
  }

  async function removeApp(id) {
    if (!confirm('Remove this role from your pipeline?')) return
    await http.delete(`/applications/${id}`)
    await load()
  }

  if (loading) {
    return (
      <div className="mj-panel mj-center">
        <p>Loading your applications…</p>
      </div>
    )
  }

  if (error) {
    return (
      <div className="mj-panel">
        <p className="mj-error">{error}</p>
        <button type="button" className="mj-btn mj-btn-primary" onClick={load}>
          Retry
        </button>
      </div>
    )
  }

  return (
    <div>
      <div className="mj-dashhead">
        <div>
          <h1>Dashboard</h1>
          <p className="mj-muted">Roles grouped by where you are in the process.</p>
        </div>
        <Link to="/search" className="mj-btn mj-btn-primary">
          Search jobs
        </Link>
      </div>

      {STATUS_ORDER.map((status) => {
        const label =
          APPLICATION_STATUSES.find((s) => s.value === status)?.label || status
        const items = grouped?.[status] || []
        if (!items.length) return null
        return (
          <section key={status} className="mj-board">
            <h2>{label}</h2>
            <ul className="mj-applist">
              {items.map((a) => (
                <li key={a._id} className="mj-appcard">
                  <div>
                    <h3>{a.title}</h3>
                    <p className="mj-muted">{a.company}</p>
                  </div>
                  <div className="mj-appactions">
                    <label className="mj-selectwrap">
                      <span className="mj-sr-only">Status</span>
                      <select
                        value={a.status}
                        onChange={(e) => updateStatus(a._id, e.target.value)}
                        aria-label={`Status for ${a.title}`}
                      >
                        {APPLICATION_STATUSES.map((s) => (
                          <option key={s.value} value={s.value}>
                            {s.label}
                          </option>
                        ))}
                      </select>
                    </label>
                    {a.jobUrl ? (
                      <a className="mj-btn mj-btn-ghost" href={a.jobUrl} target="_blank" rel="noreferrer">
                        Posting
                      </a>
                    ) : null}
                    <button type="button" className="mj-btn mj-btn-danger" onClick={() => removeApp(a._id)}>
                      Remove
                    </button>
                  </div>
                </li>
              ))}
            </ul>
          </section>
        )
      })}

      {STATUS_ORDER.every((s) => !(grouped?.[s] || []).length) ? (
        <div className="mj-panel mj-center">
          <p>No applications yet.</p>
          <Link to="/search" className="mj-btn mj-btn-primary">
            Search remote jobs
          </Link>
        </div>
      ) : null}
    </div>
  )
}
