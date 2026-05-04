const Booking = require('../models/Booking')

const createBooking = async (req, res) => {
  try {
    const { userId, pickupArea, dropArea, date, time } = req.body
    if (!userId || !pickupArea || !dropArea || !date || !time) {
      return res.status(400).json({ message: 'All booking fields are required' })
    }

    const booking = await Booking.create({
      userId,
      pickupArea,
      dropArea,
      date,
      time,
      status: 'pending',
    })

    return res.status(201).json(booking)
  } catch (error) {
    return res.status(500).json({ message: 'Failed to create booking', error: error.message })
  }
}

const getUserBookings = async (req, res) => {
  try {
    const bookings = await Booking.find({ userId: req.params.id }).sort({ createdAt: -1 })
    return res.json(bookings)
  } catch (error) {
    return res.status(500).json({ message: 'Failed to fetch bookings' })
  }
}

module.exports = { createBooking, getUserBookings }
