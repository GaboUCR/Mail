const models = require('../models')

let createCookie = () => {
  const characters = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz!@#$%^&*()_+{}[]|,.?1234567890"

  let newCookie = ""

  for (var i=0; i<40; i++){
    var ran = Math.floor(Math.random() * characters.length)
    newCookie += characters[ran]
  }
  return newCookie;

}

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



  logIn: async (req, res) => {
    let credential = await models.User.findOne({email:req.body.email}, "password").exec()
    const MsgForm = {ok:0, wrong_credentials:1, unknown_error:2}

    if (credential.password == null){
      res.json({error:MsgForm.wrong_credentials})
      res.end()
      return 0;
    }

    if (credential.password == req.body.password){
      const cookie = createCookie()
      req.app.locals.users.push({id:credential._id, cookie:cookie})
      res.cookie('LogIn', cookie, {
        maxAge: 60 * 60 * 1000
        // httpOnly: true,
        // secure: true,
        // sameSite: true
      })
      res.json({error:MsgForm.ok})
      res.end()
      return 0;
    }
  },

  sendMessage : async(req, res) => {
    const MsgForm = {ok:0, user_not_found:1, unknown_error:2}
    const MsgType = {read:0, unread:1, sent:2, spam:3}

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

      let to_msg_type = await models.User.updateOne({_id:to_id}, {$addToSet: {messages:
                                                    {msg_id:msg._id, msg_type:MsgType.unread}}}, {upsert:true})

      let from_msg_type = await models.User.updateOne({_id:from_id}, {$addToSet: {messages:
                                                      {msg_id:msg._id, msg_type:MsgType.sent}}}, {upsert:true})
      console.log(from_id)
      console.log(to_id)
      res.json({error:MsgForm.ok})
      res.end()


  } catch (error){
    console.log(error)
    res.send({error:MsgForm.unknown_error})

    }
  }
}
