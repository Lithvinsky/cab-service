const cors = require('cors')
const dotenv = require('dotenv')
const express = require('express')
const areaRoutes = require('./routes/areaRoutes')
const authRoutes = require('./routes/authRoutes')
const bookingRoutes = require('./routes/bookingRoutes')
const connectDB = require('./config/db')

dotenv.config()
connectDB()

const app = express()

app.use(cors())
app.use(express.json())

app.get('/api/health', (req, res) => {
  res.json({ message: 'Cab booking backend is running' })
})

app.use('/api/auth', authRoutes)
app.use('/api/areas', areaRoutes)
app.use('/api/booking', bookingRoutes)

const PORT = process.env.PORT || 5000
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})
