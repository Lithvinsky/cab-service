const express = require('express')
const { createArea, getAreas } = require('../controllers/areaController')
const { protect, requireAdmin } = require('../middleware/auth')

const router = express.Router()

router.get('/', getAreas)
router.post('/', protect, requireAdmin, createArea)

module.exports = router
