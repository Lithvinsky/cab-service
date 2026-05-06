import { NavLink, useNavigate } from 'react-router-dom'
import useAuth from '../hooks/useAuth'

const Navbar = () => {
  const { user, logout } = useAuth()
  const navigate = useNavigate()
  const isAdmin = user?.role === 'admin'

  const handleLogout = () => {
    logout()
    navigate('/login')
  }

  return (
    <header className="navbar">
      <div className="navbar-brand">
        <NavLink to="/" aria-label="Go to homepage">
          <img src="/assets/branding/logo.svg" alt="CabConnect logo" />
        </NavLink>
      </div>
      <nav className="navbar-nav">
        <NavLink to="/" className={({ isActive }) => (isActive ? 'nav-link is-active' : 'nav-link')}>
          Home
        </NavLink>

        {user && !isAdmin && (
          <NavLink
            to="/book"
            className={({ isActive }) => (isActive ? 'nav-link is-active' : 'nav-link')}
          >
            Book
          </NavLink>
        )}

        {isAdmin && (
          <NavLink
            to="/admin"
            className={({ isActive }) => (isActive ? 'nav-link is-active' : 'nav-link')}
          >
            Admin
          </NavLink>
        )}

        {!user && (
          <>
            <NavLink
              to="/login"
              className={({ isActive }) => (isActive ? 'nav-link is-active' : 'nav-link')}
            >
              Login
            </NavLink>
            <NavLink
              to="/signup"
              className={({ isActive }) => (isActive ? 'nav-link is-active' : 'nav-link')}
            >
              Signup
            </NavLink>
          </>
        )}

        {user && (
          <>
            <span className="navbar-user" title={user.email || user.name}>
              {user.name} ({isAdmin ? 'Admin' : 'User'})
            </span>
            <button type="button" className="btn btn-logout" onClick={handleLogout}>
              Logout
            </button>
          </>
        )}
      </nav>
    </header>
  )
}

export default Navbar
