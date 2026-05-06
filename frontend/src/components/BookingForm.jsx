import { useEffect, useMemo, useState } from 'react'
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
  const [areas, setAreas] = useState([])
  const [isLoadingAreas, setIsLoadingAreas] = useState(true)

  const areaOptions = useMemo(
    () =>
      areas
        .map((area) => area?.name)
        .filter((name) => typeof name === 'string' && name.trim() !== ''),
    [areas],
  )

  useEffect(() => {
    const fetchAreas = async () => {
      try {
        const response = await api.get('/areas')
        setAreas(Array.isArray(response.data) ? response.data : [])
      } catch {
        setAreas([])
      } finally {
        setIsLoadingAreas(false)
      }
    }

    fetchAreas()
  }, [])

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
        <select
          name="pickupArea"
          value={formData.pickupArea}
          onChange={handleChange}
          disabled={isLoadingAreas || areaOptions.length === 0}
        >
          <option value="">
            {isLoadingAreas ? 'Loading areas...' : 'Select pickup area'}
          </option>
          {areaOptions.map((areaName) => (
            <option key={`pickup-${areaName}`} value={areaName}>
              {areaName}
            </option>
          ))}
        </select>
      </label>
      <label>
        Drop Area
        <select
          name="dropArea"
          value={formData.dropArea}
          onChange={handleChange}
          disabled={isLoadingAreas || areaOptions.length === 0}
        >
          <option value="">
            {isLoadingAreas ? 'Loading areas...' : 'Select drop area'}
          </option>
          {areaOptions.map((areaName) => (
            <option key={`drop-${areaName}`} value={areaName}>
              {areaName}
            </option>
          ))}
        </select>
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
      {!isLoadingAreas && areaOptions.length === 0 && (
        <p className="error-text">
          No areas available yet. Ask an admin to add cab areas first.
        </p>
      )}
      {error && <p className="error-text">{error}</p>}
      {message && <p className="success-text">{message}</p>}
    </form>
  )
}

export default BookingForm
