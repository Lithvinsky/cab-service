const Booking = require('../models/Booking')

const createBooking = async (req, res) => {
  try {
    const { userId: bodyUserId, pickupArea, dropArea, date, time } = req.body
    const userId = req.user?.id || bodyUserId

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

const getAllBookings = async (req, res) => {
  try {
    const bookings = await Booking.find()
      .populate('userId', 'name email')
      .lean()
      .sort({ createdAt: -1 })

    const normalizedBookings = bookings.map((booking) => {
      const populatedUser = booking.userId && typeof booking.userId === 'object' ? booking.userId : null
      return {
        ...booking,
        userName: populatedUser?.name ?? null,
        userEmail: populatedUser?.email ?? null,
      }
    })

    return res.json(normalizedBookings)
  } catch (error) {
    return res.status(500).json({ message: 'Failed to fetch all bookings' })
  }
}

const updateBookingStatus = async (req, res) => {
  try {
    const { status } = req.body
    const allowedStatuses = ['pending', 'approved', 'cancelled']

    if (!allowedStatuses.includes(status)) {
      return res.status(400).json({ message: 'Invalid booking status' })
    }

    const booking = await Booking.findByIdAndUpdate(
      req.params.id,
      { status },
      { new: true },
    )

    if (!booking) {
      return res.status(404).json({ message: 'Booking not found' })
    }

    return res.json(booking)
  } catch (error) {
    return res.status(500).json({ message: 'Failed to update booking status' })
  }
}

module.exports = {
  createBooking,
  getUserBookings,
  getAllBookings,
  updateBookingStatus,
}
