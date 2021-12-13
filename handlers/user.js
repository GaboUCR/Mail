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
    const MsgForm = {ok:0, user_not_found:1, unknown_error:2}

    try{
      let to_id = await models.User.findOne({email:req.body.to}, "id").exec()
            //You have to change this
      let from_id = await models.User.findOne({email:"gabrielgv14@gmail.com"}, "id").exec()

      if (to_id == null || from_id == null){
        res.json({error:MsgForm.user_not_found})
        res.end()
        return 0;
      }

      let msg = await models.Message.create({to_id:to_id, from_id:from_id, body:req.body.body,
                                              description:req.body.description, date:Date.now()})
      res.json({error:MsgForm.ok})
      res.end()


  } catch (error){
    res.send({error:MsgForm.unknown_error})

  }
    // (error, to_id) => {
    //     if (error || to_id == null) {
    //       res.send({error:"not-found"})
    //     }

        // else {
        //   //Don't forget to change this
        //   models.User.findOne({email:"gabrielgv14@gmail.com"}, "id", (error, from_id) => {
        //       if (error || from_id == null) {
        //         res.send({error:"not-found"})
        //       }
        //       else {
        //         // console.log(from_id.id instanceof mongoose.Types.ObjectId)
        //         // console.log(to_id)
                // models.Message.create({to_id:to_id, from_id:from_id, body:req.body.body,
                                       // description:req.body.description, date:Date.now()}, (error, msg) => {
                                       //   console.log(msg)
        //                                  res.send(msg)
        //                                })
        //       }
        // })
        //
        // }

  }

  // sendMessage : async(req, res) => {
  //   models.User.findOne({email:req.body.to}, "id", (error, to_id) => {
  //       if (error || to_id == null) {
  //         res.send({error:"not-found"})
  //       }
  //       else {
  //         //Don't forget to change this
  //         models.User.findOne({email:"gabrielgv14@gmail.com"}, "id", (error, from_id) => {
  //             if (error || from_id == null) {
  //               res.send({error:"not-found"})
  //             }
  //             else {
  //               // console.log(from_id.id instanceof mongoose.Types.ObjectId)
  //               // console.log(to_id)
  //               models.Message.create({to_id:to_id, from_id:from_id, body:req.body.body,
  //                                      description:req.body.description, date:Date.now()}, (error, msg) => {
  //                                        console.log(msg)
  //                                        res.send(msg)
  //                                      })
  //             }
  //       })
  //
  //       }
  //   })
  // }
}
