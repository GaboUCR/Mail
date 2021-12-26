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
  //There has to be a better way to do this!!!
  getInbox : async (req, res) => {
    const MsgType = {read:0, unread:1, sent:2}
    let msgQuery = await models.User.findById(res.locals.id, "messages").exec()
    let messagesIds = msgQuery.messages
    let tinbox = []

    for (const n of messagesIds) {
      if (n.msg_type === MsgType.sent){
        continue;
      }
      tinbox.push({id:n.msg_id, type:n.msg_type})
    }
    let messagesQuery = await models.Message.find({to_id:res.locals.id}).exec()
    // console.log(messagesQuery)
    let inbox = []
    for (const n in messagesQuery){
      for (const m of tinbox){
        if (m.id.toString() === messagesQuery[n]._id.toString()){
          inbox.push({body:messagesQuery[n].body, description:messagesQuery[n].description,
                      date:messagesQuery[n].date})
        }
      }
    }
    console.log(inbox)
    res.end()

  },
  getSentMessages : async (req, res) => {
    console.log(res.locals.id)
    let msgQuery = await models.Message.find({from_id:res.locals.id}).exec()
    let messages = []

    for (const n in msgQuery){
      var to = await models.User.findById(msgQuery[n].to_id, "email").exec()
      messages.push({to:to.email, body:msgQuery[n].body, description:msgQuery[n].description,
                     date:msgQuery[n].date})
    }

    console.log(messages)

  },

  signUpUser : async (req, res) => {
    let user = await models.User.create(req.body)
    console.log(user)
  },

  logOut: async(req, res) => {
    res.clearCookie("LogIn")
    res.end()
  },

  checkCookie : async (req, res, next) => {

    for (const n of req.app.locals.users) {
      if (n.cookie === req.cookies.LogIn){
        res.locals.id = n.id
        next()
        return 0;
      }
    }
    res.json({logged:false})
    res.end()
  },
  islogged : async(req, res) => {
    let email = await models.User.findById(res.locals.id, "email").exec()
    res.json({email:email.email, logged:true})
    res.end()
  },

  logIn: async (req, res) => {
    let credential = await models.User.findOne({email:req.body.email}, "password").exec()
    const MsgForm = {ok:0, wrong_credentials:1, unknown_error:2}
    console.log(req)
    if (credential.password == null){
      res.json({error:MsgForm.wrong_credentials})
      res.end()
      return 0;
    }

    if (credential.password == req.body.password){
      const cookie = createCookie()
      req.app.locals.users.push({id:credential._id, cookie:cookie})
      console.log(cookie)
      res.cookie('LogIn', cookie, {
        maxAge: 60 * 60 * 1000,
        httpOnly: true,
        sameSite: true,
        secure:true
      })

      res.json({error:MsgForm.ok})
      res.end()
      return 0;
    }
  },

  sendMessage : async(req, res) => {
    const MsgForm = {ok:0, user_not_found:1, unknown_error:2}
    const MsgType = {read:0, unread:1, sent:2}

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
      res.json({error:MsgForm.ok})
      res.end()


  } catch (error){
    console.log(error)
    res.send({error:MsgForm.unknown_error})

    }
  }
}
