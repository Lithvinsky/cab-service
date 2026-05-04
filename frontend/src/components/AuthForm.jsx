import { useState } from 'react'

const initialState = {
  name: '',
  email: '',
  password: '',
}

const AuthForm = ({ title, buttonText, onSubmit }) => {
  const [formData, setFormData] = useState(initialState)
  const [error, setError] = useState('')

  const handleChange = (event) => {
    const { name, value } = event.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleSubmit = async (event) => {
    event.preventDefault()
    setError('')
    if (!formData.email || !formData.password || (title === 'Signup' && !formData.name)) {
      setError('Please fill all required fields.')
      return
    }
    try {
      await onSubmit(formData)
      setFormData(initialState)
    } catch (requestError) {
      setError(requestError.response?.data?.message ?? 'Authentication failed')
    }
  }

  return (
    <form className="panel form-grid auth-form" onSubmit={handleSubmit}>
      <h2>{title}</h2>
      {title === 'Signup' && (
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
    </form>
  )
}

export default AuthForm
