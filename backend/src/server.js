const cors = require('cors')
const dotenv = require('dotenv')
const express = require('express')
const connectDB = require('./config/db')

dotenv.config()
connectDB()

const app = express()

app.use(cors())
app.use(express.json())

app.get('/api/health', (req, res) => {
  res.json({ message: 'Cab booking backend is running' })
})

const PORT = process.env.PORT || 5000
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})
