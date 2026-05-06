const bcrypt = require('bcrypt')
const dotenv = require('dotenv')
const mongoose = require('mongoose')

dotenv.config()

const User = require('./models/User')
const CabArea = require('./models/CabArea')
const Booking = require('./models/Booking')

const DEMO_EMAIL_RE = /@cabconnect\.demo$/

const SEED_AREAS = [
  { name: 'Downtown Office Park', coordinates: '52.2297,21.0122' },
  { name: 'North Tech Campus', coordinates: '52.2500,21.0500' },
  { name: 'Airport Business District', coordinates: '52.1657,20.9671' },
  { name: 'South Corporate Hub', coordinates: '52.2000,20.9500' },
]

const SEED_USERS = [
  { name: 'Admin User', email: 'admin@cabconnect.demo', role: 'admin' },
  { name: 'Alice Employee', email: 'alice@cabconnect.demo', role: 'user' },
  { name: 'Bob Employee', email: 'bob@cabconnect.demo', role: 'user' },
]

const DEMO_PASSWORD = 'Password123!'

async function clearPreviousDemo() {
  const demoUsers = await User.find({ email: DEMO_EMAIL_RE }).select('_id')
  const ids = demoUsers.map((u) => u._id)
  if (ids.length) {
    await Booking.deleteMany({ userId: { $in: ids } })
  }
  await User.deleteMany({ email: DEMO_EMAIL_RE })
  await CabArea.deleteMany({
    name: { $in: SEED_AREAS.map((a) => a.name) },
  })
}

async function seed() {
  if (!process.env.MONGODB_URI) {
    console.error('Missing MONGODB_URI in .env')
    process.exit(1)
  }

  await mongoose.connect(process.env.MONGODB_URI)
  console.log('Connected to MongoDB')

  await clearPreviousDemo()

  const passwordHash = await bcrypt.hash(DEMO_PASSWORD, 10)

  const users = []
  for (const u of SEED_USERS) {
    const doc = await User.create({
      name: u.name,
      email: u.email,
      password: passwordHash,
      role: u.role,
    })
    users.push(doc)
    console.log(`User: ${doc.email} (${doc.role})`)
  }

  for (const area of SEED_AREAS) {
    const doc = await CabArea.create(area)
    console.log(`Area: ${doc.name}`)
  }

  const alice = users.find((u) => u.email === 'alice@cabconnect.demo')
  if (alice) {
    const today = new Date().toISOString().slice(0, 10)
    await Booking.create({
      userId: alice._id,
      pickupArea: 'Downtown Office Park',
      dropArea: 'North Tech Campus',
      date: today,
      time: '08:30',
      status: 'approved',
    })
    await Booking.create({
      userId: alice._id,
      pickupArea: 'South Corporate Hub',
      dropArea: 'Airport Business District',
      date: today,
      time: '17:45',
      status: 'pending',
    })
    console.log('Bookings: 2 for alice@cabconnect.demo')
  }

  console.log('\nDone. Login with any seed user / Password123!')
  await mongoose.disconnect()
}

seed().catch((err) => {
  console.error(err)
  process.exit(1)
})
