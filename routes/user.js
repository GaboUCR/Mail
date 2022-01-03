const router = require('express').Router()
const userHandlers = require('../handlers/user')

router.post("/signUp", userHandlers.signUpUser)
router.post("/LogIn", userHandlers.logIn)

//you have to change this
// router.post("/sendMessage", userHandlers.checkCookie, userHandlers.sendMessage)
// router.get("/inbox", userHandlers.checkCookie, userHandlers.getSentMessages)
// router.get("/sent", userHandlers.checkCookie, userHandlers.getSentMessages)
// router.post("/markMsgAsRead", userHandlers.checkCookie, userHandlers.markMsgAsRead)

function hack(req, res, next){
  // res.locals.id = "61ad8dc34a0e347f088541c1"
  res.locals.id = "61adc8e74a0e347f088541c7"
  next()
}

router.post("/markMsgAsRead", hack, userHandlers.markMsgAsRead)
router.post("/sendMessage", hack, userHandlers.sendMessage)
router.get("/inbox", hack, userHandlers.getInbox)
router.get("/sent", hack, userHandlers.getSentMessages)

router.post("/get-users", userHandlers.getUsers)
router.get("/check", userHandlers.checkCookie, userHandlers.islogged)
router.get("/logout", userHandlers.logOut)
module.exports = router
