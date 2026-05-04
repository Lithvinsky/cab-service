const mongoose = require('mongoose')

const bookingSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    pickupArea: {
      type: String,
      required: true,
      trim: true,
    },
    dropArea: {
      type: String,
      required: true,
      trim: true,
    },
    date: {
      type: String,
      required: true,
    },
    time: {
      type: String,
      required: true,
    },
    status: {
      type: String,
      default: 'pending',
      enum: ['pending', 'approved', 'cancelled'],
    },
  },
  { timestamps: true },
)

module.exports = mongoose.model('Booking', bookingSchema)
