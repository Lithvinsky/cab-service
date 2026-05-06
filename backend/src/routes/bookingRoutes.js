const express = require('express')
const {
  createBooking,
  getAllBookings,
  getUserBookings,
  updateBookingStatus,
} = require('../controllers/bookingController')
const { protect, requireAdmin } = require('../middleware/auth')

const router = express.Router()

router.post('/', protect, createBooking)
router.get('/user/:id', protect, getUserBookings)
router.get('/admin/all', protect, requireAdmin, getAllBookings)
router.patch('/admin/:id/status', protect, requireAdmin, updateBookingStatus)

module.exports = router
