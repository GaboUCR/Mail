const router = require('express').Router()
const userHandlers = require('../handlers/user')

router.get("/", userHandlers.getUserFrontpage)
router.post("/signUpUser", userHandlers.signUpUser)

module.exports = router
