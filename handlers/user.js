const models = require('../models')

module.exports = {
  getUserFrontpage : async (req, res) => {
    models.Message.getInbox(req.body.id, (error, inbox) => {
      if (error) console.log(error)
      res.send(inbox)
    })},

  signUpUser : async (req, res) => {
    models.User.create(req.body,  (error, userResponse) => {
      if (error) console.log(error)
      res.send(userResponse)
    })
  }
  }
