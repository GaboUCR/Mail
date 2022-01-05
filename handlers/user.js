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
    let msgQuery = await models.User.findById(res.locals.id, "messages email").exec()
    let messagesIds = msgQuery.messages
    let to = msgQuery.email
    let tinbox = []

    for (const n of messagesIds) {
      if (n.msg_type === MsgType.sent){
        continue;
      }
      tinbox.push({id:n.msg_id, type:n.msg_type})
    }
    let messagesQuery = await models.Message.find({to_id:res.locals.id, deleted:false}).exec()
    let inbox = []

    for (const n in messagesQuery){
      for (const m of tinbox){
        if (m.id.toString() === messagesQuery[n]._id.toString()){
          var from = await models.User.findById(messagesQuery[n].from_id, "email").exec()
          inbox.push({from:from.email, to:to, body:messagesQuery[n].body, description:messagesQuery[n].description,
                      date:messagesQuery[n].date, id:messagesQuery[n]._id.toString(), type:m.type})
        }
      }
    }
    //revert the order of the list so that new messages appear at the top
    //definitely there is a fancier way to do this
    let rMessages = []
    for (const n of inbox){
      rMessages.unshift(n)
    }

    res.json({messages:rMessages})
    res.end()

  },
  getSentMessages : async (req, res) => {
    const MsgType = {read:0, unread:1, sent:2}
    let msgQuery = await models.Message.find({from_id:res.locals.id, deleted:false}).exec()
    let from = await models.User.findById(res.locals.id, "email")
    let messages = []


    for (const n in msgQuery){
      var to = await models.User.findById(msgQuery[n].to_id, "email").exec()
      messages.push({to:to.email, from:from.email, body:msgQuery[n].body, description:msgQuery[n].description,
                     date:msgQuery[n].date, id:msgQuery[n]._id.toString(), type:MsgType.sent})
    }
    //revert the order of the list so that new messages appear at the top
    //definitely there is a fancier way to do this
    let rMessages = []
    for (const n of messages){
      rMessages.unshift(n)
    }

    res.json({messages:rMessages})
    res.end()
  },

  getUsers: async(req, res) => {
    let emailsQ = await models.User.find({"email":{$regex: req.body.search, $options:"i" }}, "email").exec()
    emails = []
    for (const n in emailsQ){
      emails.push(emailsQ[n].email)
    }
    res.json({emails:emails})
    res.end()
  },

  deleteMessage: async(req, res) => {

    let msg = await models.Message.findByIdAndUpdate(req.body.msg_id, {deleted:true}).exec()
    res.json({ok:true})
    res.end()
  },

  markMsgAsRead: async(req, res) => {
    const MsgType = {read:0, unread:1, sent:2}
    let msgStatus = await models.User.update({id:res.locals.id, "messages.msg_id":req.body.msg_id}, {
      $set:{'messages.$.msg_type' : MsgType.read}
    })

    res.json({ok:msgStatus.acknowledged})
    res.end()
  },

  signUpUser : async (req, res) => {
    let users = await models.User.find({}, "email").exec()
    const MsgForm = {ok:0, user_taken:1, unknown_error:2}

    for (const n of users){
      if (n.email == req.body.email){
        res.json({error:MsgForm.user_taken})
        res.end()
        return 0;
      }
    }
    let user = await models.User.create(req.body)

    const cookie = createCookie()
    req.app.locals.users.push({id:user._id, cookie:cookie})
    res.cookie('LogIn', cookie, {
      maxAge: 60 * 60 * 1000,
      httpOnly: true,
      sameSite: true,
      secure:true
    })
    res.json({error:MsgForm.ok})
    res.end()
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

    if (credential.password == null){
      res.json({error:MsgForm.wrong_credentials})
      res.end()
      return 0;
    }

    if (credential.password == req.body.password){
      const cookie = createCookie()
      req.app.locals.users.push({id:credential._id, cookie:cookie})

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
      let from_id = res.locals.id

      if (to_id == null || from_id == null){
        res.json({error:MsgForm.user_not_found})
        res.end()
        return 0;
      }

      let fullDate = new Date(Date.now())
      let date = (fullDate.getMonth()+1).toString()+"/"+fullDate.getDate().toString()+"/"+fullDate.getFullYear().toString()

      let msg = await models.Message.create({to_id:to_id, from_id:from_id, body:req.body.body,
                                             description:req.body.description, date:date, deleted:false})

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
