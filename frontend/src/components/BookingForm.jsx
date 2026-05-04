import { useState } from 'react'
import useAuth from '../hooks/useAuth'
import api from '../utils/api'

const initialValues = {
  pickupArea: '',
  dropArea: '',
  date: '',
  time: '',
}

const BookingForm = () => {
  const { user } = useAuth()
  const [formData, setFormData] = useState(initialValues)
  const [message, setMessage] = useState('')
  const [error, setError] = useState('')

  const handleChange = (event) => {
    const { name, value } = event.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleSubmit = async (event) => {
    event.preventDefault()
    setMessage('')
    setError('')

    if (Object.values(formData).some((value) => !value.trim())) {
      setError('All booking fields are required.')
      return
    }
    if (!user) {
      setError('Please login first to submit a booking.')
      return
    }

    try {
      await api.post('/booking', { ...formData, userId: user.id })
      setMessage('Cab booking request sent successfully.')
      setFormData(initialValues)
    } catch (requestError) {
      setError(
        requestError.response?.data?.message ??
          'Booking request failed. Please try again.',
      )
    }
  }

  return (
    <form className="panel form-grid" onSubmit={handleSubmit}>
      <h2>Book a Cab</h2>
      <label>
        Pickup Area
        <input
          type="text"
          name="pickupArea"
          value={formData.pickupArea}
          onChange={handleChange}
          placeholder="Enter pickup area"
        />
      </label>
      <label>
        Drop Area
        <input
          type="text"
          name="dropArea"
          value={formData.dropArea}
          onChange={handleChange}
          placeholder="Enter drop area"
        />
      </label>
      <label>
        Date
        <input
          type="date"
          name="date"
          value={formData.date}
          onChange={handleChange}
        />
      </label>
      <label>
        Time
        <input
          type="time"
          name="time"
          value={formData.time}
          onChange={handleChange}
        />
      </label>
      <button className="btn btn-primary" type="submit">
        Submit Booking
      </button>
      {error && <p className="error-text">{error}</p>}
      {message && <p className="success-text">{message}</p>}
    </form>
  )
}

export default BookingForm
