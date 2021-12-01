const router = require('express').Router()
const track = require('./track')

router.use('/track', track)
module.exports = router
