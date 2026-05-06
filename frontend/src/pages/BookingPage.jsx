import { useEffect, useState } from 'react'
import BookingForm from '../components/BookingForm'
import useAuth from '../hooks/useAuth'
import api from '../utils/api'

const BookingPage = () => {
  const { user } = useAuth()
  const [bookings, setBookings] = useState([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  useEffect(() => {
    if (!user?.id) {
      return
    }

    const fetchBookings = async () => {
      try {
        setLoading(true)
        setError('')
        const response = await api.get(`/booking/user/${user.id}`)
        setBookings(Array.isArray(response.data) ? response.data : [])
      } catch (requestError) {
        setError(
          requestError.response?.data?.message ??
            'Failed to load your bookings. Please refresh.',
        )
      } finally {
        setLoading(false)
      }
    }

    fetchBookings()
  }, [user?.id])

  return (
    <main className="container">
      <BookingForm />
      <section className="panel">
        <h2>My Bookings</h2>
        {!user && <p>Please login to view your bookings.</p>}
        {user && loading && <p>Loading bookings...</p>}
        {user && error && <p className="error-text">{error}</p>}
        {user && !loading && !error && bookings.length === 0 && (
          <p>No bookings found yet.</p>
        )}
        {user && bookings.length > 0 && (
          <ul className="admin-area-list">
            {bookings.map((booking) => (
              <li key={booking._id} className="admin-area-item">
                <strong>
                  {booking.pickupArea} {'->'} {booking.dropArea}
                </strong>
                <span>
                  {booking.date} {booking.time} ({booking.status})
                </span>
              </li>
            ))}
          </ul>
        )}
      </section>
    </main>
  )
}

export default BookingPage
