import { Link } from 'react-router-dom'
import { useAuth } from '../hooks/useAuth'
import './Pages.css'

export default function Landing() {
  const { user } = useAuth()

  return (
    <div className="mj-hero">
      <p className="mj-kicker">Resume + preferences → organized job search</p>
      <h1>Track every role in one calm dashboard.</h1>
      <p className="mj-lead">
        MyJobs stores your resume and what you are looking for—roles, industry, and work
        style—then helps you capture applications from live listings and move them through
        your pipeline with clear statuses.
      </p>
      <div className="mj-hero-actions">
        {user ? (
          <Link to="/dashboard" className="mj-btn mj-btn-primary">
            Open dashboard
          </Link>
        ) : (
          <>
            <Link to="/register" className="mj-btn mj-btn-primary">
              Get started
            </Link>
            <Link to="/login" className="mj-btn mj-btn-ghost">
              Sign in
            </Link>
          </>
        )}
      </div>
      <ul className="mj-features">
        <li>
          <strong>Profile</strong>
          <span>Resume text, role categories, industry, remote vs hybrid vs on-site.</span>
        </li>
        <li>
          <strong>Notifications</strong>
          <span>Choose email, SMS, or in-app only and how often you want nudges.</span>
        </li>
        <li>
          <strong>Search + pipeline</strong>
          <span>Pull remote jobs from a live API, save roles, and group by status.</span>
        </li>
      </ul>
    </div>
  )
}
