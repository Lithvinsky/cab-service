import { Link, useNavigate } from 'react-router-dom'
import AuthForm from '../components/AuthForm'
import useAuth from '../hooks/useAuth'

const SignupPage = () => {
  const { signup } = useAuth()
  const navigate = useNavigate()

  const handleSignup = async (payload) => {
    await signup(payload)
    navigate('/login', { replace: true, state: { registered: true } })
  }

  return (
    <main className="container auth-page">
      <section className="auth-shell panel">
        <section className="auth-brand-panel">
          <img className="auth-logo" src="/assets/branding/logo.svg" alt="CabConnect" />
          <p className="hero-kicker">Enterprise Ready</p>
          <h2 className="auth-brand-title">Start booking smarter rides</h2>
          <p className="auth-brand-text">
            Create your account and get fast, organized internal transport for your team.
          </p>
        </section>

        <section>
          <AuthForm
            title="Create Account"
            subtitle="Join CabConnect to request office rides in seconds."
            buttonText="Create Account"
            includeName
            onSubmit={handleSignup}
            footer={
              <p>
                Already registered? <Link to="/login">Login here</Link>
              </p>
            }
          />
        </section>
      </section>
    </main>
  )
}

export default SignupPage
