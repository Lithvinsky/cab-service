const express = require('express')
const {
  createBooking,
  getUserBookings,
} = require('../controllers/bookingController')
const { protect } = require('../middleware/auth')

const router = express.Router()

router.post('/', protect, createBooking)
router.get('/user/:id', protect, getUserBookings)

module.exports = router
