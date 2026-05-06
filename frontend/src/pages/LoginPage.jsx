import { Link, useLocation, useNavigate } from 'react-router-dom'
import AuthForm from '../components/AuthForm'
import useAuth from '../hooks/useAuth'

const LoginPage = () => {
  const { login } = useAuth()
  const navigate = useNavigate()
  const location = useLocation()
  const registered = location.state?.registered

  const handleLogin = async (payload) => {
    await login({ email: payload.email, password: payload.password })
    navigate('/', { replace: true })
  }

  return (
    <main className="container auth-page">
      <section className="auth-shell panel">
        <section className="auth-brand-panel">
          <img className="auth-logo" src="/assets/branding/logo.svg" alt="CabConnect" />
          <p className="hero-kicker">Corporate Commute Platform</p>
          <h2 className="auth-brand-title">Welcome back to CabConnect</h2>
          <p className="auth-brand-text">
            Manage office rides, booking requests, and schedules with one secure platform.
          </p>
        </section>

        <section>
          {registered && (
            <p className="success-text auth-alert">
              Account created. You can sign in now.
            </p>
          )}
          <AuthForm
            title="Sign In"
            subtitle="Use your work credentials to continue."
            buttonText="Login"
            onSubmit={handleLogin}
            footer={
              <p>
                New here? <Link to="/signup">Create an account</Link>
              </p>
            }
          />
        </section>
      </section>
    </main>
  )
}

export default LoginPage
