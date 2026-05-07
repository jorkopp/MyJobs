import { useState } from 'react'
import { http } from '../api/http'
import { APPLICATION_STATUSES } from '../constants/profileOptions'
import './Pages.css'

export default function JobSearch() {
  const [q, setQ] = useState('react')
  const [category, setCategory] = useState('')
  const [jobs, setJobs] = useState([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [message, setMessage] = useState('')

  async function runSearch(e) {
    e.preventDefault()
    setError('')
    setMessage('')
    setLoading(true)
    try {
      const { data } = await http.get('/jobs/search', {
        params: { q, category: category || undefined, limit: 30 },
      })
      setJobs(data.jobs || [])
    } catch (err) {
      setError(err.message || 'Search failed')
    } finally {
      setLoading(false)
    }
  }

  async function saveJob(job) {
    setMessage('')
    setError('')
    try {
      await http.post('/applications', {
        externalJobId: job.externalJobId,
        source: job.source,
        title: job.title,
        company: job.company,
        jobUrl: job.jobUrl,
        category: job.category,
        status: 'interested',
      })
      setMessage(`Saved “${job.title}” to your pipeline.`)
      setJobs((prev) =>
        prev.map((j) =>
          j.externalJobId === job.externalJobId ? { ...j, savedStatus: 'interested' } : j
        )
      )
    } catch (err) {
      setError(err.message || 'Could not save job')
    }
  }

  return (
    <div>
      <h1>Search jobs</h1>
      <p className="mj-muted">
        Listings are fetched from the public{' '}
        <a href="https://remotive.com/api-documentation" target="_blank" rel="noreferrer">
          Remotive
        </a>{' '}
        REST API and merged with your saved pipeline in MongoDB.
      </p>

      <form className="mj-search mj-form" onSubmit={runSearch}>
        <label className="mj-field mj-grow">
          <span>Keywords</span>
          <input value={q} onChange={(e) => setQ(e.target.value)} placeholder="e.g. frontend" />
        </label>
        <label className="mj-field">
          <span>Remotive category (optional)</span>
          <input
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            placeholder="software-dev"
          />
        </label>
        <button type="submit" className="mj-btn mj-btn-primary" disabled={loading}>
          {loading ? 'Searching…' : 'Search'}
        </button>
      </form>

      {error ? <p className="mj-error">{error}</p> : null}
      {message ? <p className="mj-success">{message}</p> : null}

      <ul className="mj-joblist">
        {jobs.map((job) => (
          <li key={job.externalJobId} className="mj-jobcard">
            <div>
              <h2>{job.title}</h2>
              <p className="mj-muted">
                {job.company}
                {job.category ? ` · ${job.category}` : ''}
              </p>
              {job.candidateRequiredLocation ? (
                <p className="mj-small">{job.candidateRequiredLocation}</p>
              ) : null}
            </div>
            <div className="mj-jobactions">
              {job.jobUrl ? (
                <a className="mj-btn mj-btn-ghost" href={job.jobUrl} target="_blank" rel="noreferrer">
                  View posting
                </a>
              ) : null}
              {job.savedStatus ? (
                <span className="mj-pill">
                  In pipeline:{' '}
                  {APPLICATION_STATUSES.find((s) => s.value === job.savedStatus)?.label ||
                    job.savedStatus}
                </span>
              ) : (
                <button type="button" className="mj-btn mj-btn-primary" onClick={() => saveJob(job)}>
                  Add to pipeline
                </button>
              )}
            </div>
          </li>
        ))}
      </ul>
      {!loading && jobs.length === 0 ? (
        <p className="mj-muted">Run a search to see roles from the external API.</p>
      ) : null}
    </div>
  )
}
