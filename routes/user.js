const router = require('express').Router()
const userHandlers = require('../handlers/user')

router.get("/", userHandlers.getUserFrontpage)
router.post("/signUpUser", userHandlers.signUpUser)
router.post("/sendMessage", userHandlers.sendMessage)
module.exports = router
