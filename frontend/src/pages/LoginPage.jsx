import AuthForm from '../components/AuthForm'
import useAuth from '../hooks/useAuth'

const LoginPage = () => {
  const { login } = useAuth()

  const handleLogin = async (payload) => {
    await login({ email: payload.email, password: payload.password })
  }

  return (
    <main className="container">
      <AuthForm title="Login" buttonText="Login" onSubmit={handleLogin} />
    </main>
  )
}

export default LoginPage
