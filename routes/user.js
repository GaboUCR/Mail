const router = require('express').Router()
const userHandlers = require('../handlers/user')

router.post("/signUp", userHandlers.signUpUser)
router.post("/sendMessage", userHandlers.sendMessage)
router.post("/LogIn", userHandlers.logIn)
router.get("/check", userHandlers.checkCookie, userHandlers.islogged)
router.get("/inbox", userHandlers.checkCookie, userHandlers.getSentMessages)
router.get("/sent", userHandlers.checkCookie, userHandlers.getSentMessages)
router.get("/logOut", userHandlers.logOut)
module.exports = router
