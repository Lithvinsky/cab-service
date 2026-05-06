const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')
const User = require('../models/User')

const signup = async (req, res) => {
  try {
    const { name, password } = req.body
    const email = String(req.body?.email ?? '')
      .toLowerCase()
      .trim()
    if (!name || !email || !password) {
      return res.status(400).json({ message: 'All fields are required' })
    }

    const existingUser = await User.findOne({ email })
    if (existingUser) {
      return res.status(409).json({ message: 'Email already registered' })
    }

    const hashedPassword = await bcrypt.hash(password, 10)
    const user = await User.create({
      name,
      email,
      password: hashedPassword,
    })

    return res.status(201).json({
      id: String(user._id),
      email: user.email,
      role: user.role,
    })
  } catch (error) {
    return res.status(500).json({ message: 'Signup failed', error: error.message })
  }
}

const login = async (req, res) => {
  try {
    const password = req.body?.password
    const email = String(req.body?.email ?? '')
      .toLowerCase()
      .trim()

    if (!email || password == null || String(password) === '') {
      return res.status(400).json({ message: 'Email and password are required' })
    }

    if (!process.env.JWT_SECRET) {
      return res.status(500).json({ message: 'Server misconfiguration: JWT_SECRET missing' })
    }

    const user = await User.findOne({ email })

    if (!user || !(await bcrypt.compare(password, user.password))) {
      return res.status(401).json({ message: 'Invalid credentials' })
    }

    const token = jwt.sign(
      { id: String(user._id), role: user.role, name: user.name },
      process.env.JWT_SECRET,
      {
        expiresIn: '1d',
      },
    )

    return res.json({
      token,
      user: {
        id: String(user._id),
        name: user.name,
        email: user.email,
        role: user.role,
      },
    })
  } catch (error) {
    return res.status(500).json({ message: 'Login failed', error: error.message })
  }
}

module.exports = { signup, login }
