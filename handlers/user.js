const models = require('../models')
// async function getUserId(email, callb){
//   let idBool = 0
//   models.User.findOne({email:email}, "id", (error, id) => {
//       if (error) return 0
//       if (id == null) return 0
//       // console.log(id)
//       idBool = id
//   })
//   return idBool
//
// }

module.exports = {
  getUserFrontpage : async (req, res) => {
    models.Message.getInbox(req.body.id, (error, inbox) => {
      if (error) console.log(error)
      res.send(inbox)
    })},

  signUpUser : async (req, res) => {
    models.User.create(req.body,  (error, user) => {
      if (error) console.log(error)
      res.send(user)
    })
  },

  sendMessage : async(req, res) => {
    models.User.findOne({email:req.body.to}, "id", (error, to_id) => {
        if (error || to_id == null) {
          res.send({error:"not-found"})
        }
        else {
          //Don't forget to change this
          models.User.findOne({email:"gabrielgv14@gmail.com"}, "id", (error, from_id) => {
              if (error || from_id == null) {
                res.send({error:"not-found"})
              }
              else {
                // console.log(from_id.id instanceof mongoose.Types.ObjectId)
                // console.log(to_id)
                models.Message.create({to_id:to_id, from_id:from_id, body:req.body.body,
                                       description:req.body.description, date:Date.now()})
              }
        })

        }
    })
  }
}
