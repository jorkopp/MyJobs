import { Link, NavLink, Outlet } from 'react-router-dom'
import { useAuth } from '../hooks/useAuth'
import './Layout.css'

export default function Layout() {
  const { user, logout } = useAuth()

  return (
    <div className="mj-shell">
      <header className="mj-header">
        <Link to="/" className="mj-brand">
          MyJobs
        </Link>
        <nav className="mj-nav" aria-label="Main">
          {user ? (
            <>
              <NavLink to="/dashboard" className={({ isActive }) => (isActive ? 'active' : '')}>
                Dashboard
              </NavLink>
              <NavLink to="/search" className={({ isActive }) => (isActive ? 'active' : '')}>
                Search jobs
              </NavLink>
              <NavLink to="/profile" className={({ isActive }) => (isActive ? 'active' : '')}>
                Profile
              </NavLink>
              <button type="button" className="mj-linkbtn" onClick={() => logout()}>
                Sign out
              </button>
            </>
          ) : (
            <>
              <NavLink to="/login">Sign in</NavLink>
              <NavLink to="/register" className="mj-cta">
                Create account
              </NavLink>
            </>
          )}
        </nav>
      </header>
      <main className="mj-main">
        <Outlet />
      </main>
      <footer className="mj-footer">
        <span>MyJobs — track applications and discover remote roles.</span>
      </footer>
    </div>
  )
}
