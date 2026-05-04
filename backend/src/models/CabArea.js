const mongoose = require('mongoose')

const cabAreaSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
      unique: true,
    },
    coordinates: {
      type: String,
      required: true,
      trim: true,
    },
  },
  { timestamps: true },
)

module.exports = mongoose.model('CabArea', cabAreaSchema)
