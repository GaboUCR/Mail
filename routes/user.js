const router = require('express').Router()
const userHandlers = require('../handlers/user')

router.post("/signUp", userHandlers.signUpUser)
router.post("/LogIn", userHandlers.logIn)
router.post("/sendMessage", userHandlers.checkCookie, userHandlers.sendMessage)
router.get("/inbox", userHandlers.checkCookie, userHandlers.getInbox)
router.get("/sent", userHandlers.checkCookie, userHandlers.getSentMessages)
router.post("/markMsgAsRead", userHandlers.checkCookie, userHandlers.markMsgAsRead)
router.post("/deleteMessage", userHandlers.checkCookie, userHandlers.deleteMessage)
router.post("/get-users", userHandlers.getUsers)
router.get("/check", userHandlers.checkCookie, userHandlers.islogged)
router.get("/logout", userHandlers.logOut)
module.exports = router
