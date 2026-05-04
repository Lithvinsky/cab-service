import AuthForm from '../components/AuthForm'
import useAuth from '../hooks/useAuth'

const SignupPage = () => {
  const { signup } = useAuth()

  const handleSignup = async (payload) => {
    await signup(payload)
  }

  return (
    <main className="container">
      <AuthForm title="Signup" buttonText="Create Account" onSubmit={handleSignup} />
    </main>
  )
}

export default SignupPage
