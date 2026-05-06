import { Link } from 'react-router-dom'
import useAuth from '../hooks/useAuth'

const HeroSection = () => {
  const { user } = useAuth()
  const isAdmin = user?.role === 'admin'

  return (
    <section className="hero">
      <p className="hero-kicker">Internal Employee Cab Service</p>
      <h1>Book cabs faster across your office locations</h1>
      <p className="hero-text">
        Automate employee transport with instant booking and centralized area
        management for admins.
      </p>
      <div className="hero-actions">
        <Link className="btn btn-primary btn-link" to={user ? '/book' : '/login'}>
          {user ? 'Book a Cab' : 'Login to Book'}
        </Link>
        {isAdmin ? (
          <Link className="btn btn-ghost btn-link" to="/admin">
            Open Admin Panel
          </Link>
        ) : (
          <Link className="btn btn-ghost btn-link" to="/signup">
            Create Account
          </Link>
        )}
      </div>
    </section>
  )
}

export default HeroSection
