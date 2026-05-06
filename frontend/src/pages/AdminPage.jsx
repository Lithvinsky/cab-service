import { useEffect, useState } from 'react'
import api from '../utils/api'

const initialForm = {
  name: '',
  coordinates: '',
}

const resolveBookingUserLabel = (booking) => {
  if (typeof booking.userName === 'string' && booking.userName.trim() !== '') {
    return booking.userName
  }
  if (booking.userId && typeof booking.userId === 'object') {
    if (typeof booking.userId.name === 'string' && booking.userId.name.trim() !== '') {
      return booking.userId.name
    }
    if (typeof booking.userId.email === 'string' && booking.userId.email.trim() !== '') {
      return booking.userId.email
    }
  }
  return 'Unknown user'
}

const AdminPage = () => {
  const [areas, setAreas] = useState([])
  const [bookings, setBookings] = useState([])
  const [formData, setFormData] = useState(initialForm)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isUpdatingBooking, setIsUpdatingBooking] = useState('')
  const [error, setError] = useState('')
  const [message, setMessage] = useState('')
  const [bookingError, setBookingError] = useState('')
  const pendingCount = bookings.filter((booking) => booking.status === 'pending').length
  const approvedCount = bookings.filter((booking) => booking.status === 'approved').length
  const cancelledCount = bookings.filter((booking) => booking.status === 'cancelled').length

  useEffect(() => {
    const fetchAdminData = async () => {
      try {
        const [areasResponse, bookingsResponse] = await Promise.all([
          api.get('/areas'),
          api.get('/booking/admin/all'),
        ])
        setAreas(Array.isArray(areasResponse.data) ? areasResponse.data : [])
        setBookings(Array.isArray(bookingsResponse.data) ? bookingsResponse.data : [])
      } catch {
        setError('Could not load admin dashboard data.')
      }
    }

    fetchAdminData()
  }, [])

  const handleChange = (event) => {
    const { name, value } = event.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleSubmit = async (event) => {
    event.preventDefault()
    setError('')
    setMessage('')

    if (!formData.name.trim() || !formData.coordinates.trim()) {
      setError('Area name and coordinates are required.')
      return
    }

    try {
      setIsSubmitting(true)
      const response = await api.post('/areas', {
        name: formData.name.trim(),
        coordinates: formData.coordinates.trim(),
      })
      setAreas((prev) => [response.data, ...prev])
      setFormData(initialForm)
      setMessage('Area added successfully.')
    } catch (requestError) {
      setError(
        requestError.response?.data?.message ??
          'Failed to add area. Please try again.',
      )
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleBookingStatusChange = async (bookingId, status) => {
    try {
      setIsUpdatingBooking(bookingId)
      setBookingError('')
      const response = await api.patch(`/booking/admin/${bookingId}/status`, { status })
      setBookings((prev) =>
        prev.map((booking) =>
          booking._id === bookingId ? { ...booking, status: response.data.status } : booking,
        ),
      )
    } catch (requestError) {
      setBookingError(
        requestError.response?.data?.message ??
          'Failed to update booking status.',
      )
    } finally {
      setIsUpdatingBooking('')
    }
  }

  return (
    <main className="container admin-dashboard">
      <section className="panel admin-header">
        <p className="hero-kicker">Operations Center</p>
        <h2>Admin Dashboard</h2>
        <p>Manage cab areas, review booking requests, and update ride statuses in one place.</p>
      </section>

      <section className="admin-stats">
        <article className="panel stat-card">
          <p className="stat-label">Total Areas</p>
          <p className="stat-value">{areas.length}</p>
        </article>
        <article className="panel stat-card">
          <p className="stat-label">Pending Bookings</p>
          <p className="stat-value">{pendingCount}</p>
        </article>
        <article className="panel stat-card">
          <p className="stat-label">Approved</p>
          <p className="stat-value">{approvedCount}</p>
        </article>
        <article className="panel stat-card">
          <p className="stat-label">Cancelled</p>
          <p className="stat-value">{cancelledCount}</p>
        </article>
      </section>

      <section className="admin-content-grid">
        <section className="panel">
          <h3>Add New Area</h3>
          <form className="form-grid" onSubmit={handleSubmit}>
            <label>
              Area Name
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                placeholder="e.g. North Tech Campus"
              />
            </label>

            <label>
              Coordinates
              <input
                type="text"
                name="coordinates"
                value={formData.coordinates}
                onChange={handleChange}
                placeholder="e.g. 40.7128,-74.0060"
              />
            </label>

            <button className="btn btn-primary" type="submit" disabled={isSubmitting}>
              {isSubmitting ? 'Adding...' : 'Add Area'}
            </button>
          </form>

          {error && <p className="error-text">{error}</p>}
          {message && <p className="success-text">{message}</p>}
        </section>

        <section className="panel">
          <h3>Existing Areas</h3>
          {areas.length === 0 ? (
            <p>No areas found yet.</p>
          ) : (
            <ul className="admin-area-list">
              {areas.map((area) => (
                <li key={area._id} className="admin-area-item">
                  <strong>{area.name}</strong>
                  <span>{area.coordinates}</span>
                </li>
              ))}
            </ul>
          )}
        </section>
      </section>

      <section className="panel">
        <h3>Manage Bookings</h3>
        {bookingError && <p className="error-text">{bookingError}</p>}
        {bookings.length === 0 ? (
          <p>No bookings found yet.</p>
        ) : (
          <ul className="admin-booking-list">
            {bookings.map((booking) => (
              <li key={booking._id} className="admin-booking-item">
                <div>
                  <strong>
                    {booking.pickupArea} {'->'} {booking.dropArea}
                  </strong>
                  <p className="admin-booking-meta">
                    Date: {booking.date} | Time: {booking.time}
                  </p>
                  <p className="admin-booking-meta">
                    User: {resolveBookingUserLabel(booking)}
                  </p>
                </div>
                <label className="admin-status-control">
                  Status
                  <select
                    value={booking.status}
                    disabled={isUpdatingBooking === booking._id}
                    onChange={(event) =>
                      handleBookingStatusChange(booking._id, event.target.value)
                    }
                  >
                    <option value="pending">Pending</option>
                    <option value="approved">Approved</option>
                    <option value="cancelled">Cancelled</option>
                  </select>
                </label>
              </li>
            ))}
          </ul>
        )}
      </section>
    </main>
  )
}

export default AdminPage
