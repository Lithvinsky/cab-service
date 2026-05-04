const CabArea = require('../models/CabArea')

const getAreas = async (req, res) => {
  try {
    const areas = await CabArea.find().sort({ createdAt: -1 })
    return res.json(areas)
  } catch (error) {
    return res.status(500).json({ message: 'Failed to fetch areas' })
  }
}

const createArea = async (req, res) => {
  try {
    const { name, coordinates } = req.body
    if (!name || !coordinates) {
      return res.status(400).json({ message: 'Name and coordinates are required' })
    }

    const area = await CabArea.create({ name, coordinates })
    return res.status(201).json(area)
  } catch (error) {
    return res.status(500).json({ message: 'Failed to create area', error: error.message })
  }
}

module.exports = { getAreas, createArea }
