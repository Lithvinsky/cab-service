import { useState } from 'react'

const initialState = {
  name: '',
  email: '',
  password: '',
}

const AuthForm = ({ title, subtitle, buttonText, onSubmit, footer, includeName = false }) => {
  const [formData, setFormData] = useState(initialState)
  const [error, setError] = useState('')

  const handleChange = (event) => {
    const { name, value } = event.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleSubmit = async (event) => {
    event.preventDefault()
    setError('')
    if (!formData.email || !formData.password || (includeName && !formData.name.trim())) {
      setError('Please fill all required fields.')
      return
    }
    try {
      await onSubmit(formData)
      setFormData(initialState)
    } catch (requestError) {
      const apiMessage = requestError.response?.data?.message
      const isNetwork =
        requestError.code === 'ERR_NETWORK' ||
        requestError.message === 'Network Error'
      const fallback = isNetwork
        ? 'Cannot reach the server. Is the backend running on port 5000?'
        : requestError.message || 'Authentication failed'
      setError(apiMessage ?? fallback)
    }
  }

  return (
    <form className="panel form-grid auth-form" onSubmit={handleSubmit}>
      <div className="auth-form-heading">
        <h2>{title}</h2>
        {subtitle && <p className="auth-subtitle">{subtitle}</p>}
      </div>
      {includeName && (
        <label>
          Full Name
          <input
            type="text"
            name="name"
            value={formData.name}
            onChange={handleChange}
            placeholder="Enter your name"
          />
        </label>
      )}
      <label>
        Email
        <input
          type="email"
          name="email"
          value={formData.email}
          onChange={handleChange}
          placeholder="name@company.com"
        />
      </label>
      <label>
        Password
        <input
          type="password"
          name="password"
          value={formData.password}
          onChange={handleChange}
          placeholder="Enter your password"
        />
      </label>
      <button className="btn btn-primary" type="submit">
        {buttonText}
      </button>
      {error && <p className="error-text">{error}</p>}
      {footer && <div className="auth-footer">{footer}</div>}
    </form>
  )
}

export default AuthForm
