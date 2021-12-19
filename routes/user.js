const router = require('express').Router()
const userHandlers = require('../handlers/user')
//
// let authenticateUser = (req, res, next) => {
//
// }
// router.get("/", userHandlers.getUserFrontpage)
router.post("/signUpUser", userHandlers.signUpUser)
router.post("/sendMessage", userHandlers.sendMessage)
router.post("/LogIn", userHandlers.logIn)
router.get("/check", userHandlers.islogged)
router.get("/logOut", userHandlers.logOut)
module.exports = router
