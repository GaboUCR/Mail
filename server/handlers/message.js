const models = require('../models')

module.exports = {
  //I made the rookie mistake of building this database like an SQL database
  //That's why this code looks so weird
  getInbox : async (req, res, next) => {
    try{
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
      res.end()}
    catch (err){
      next(err)
    }
  },

  getSentMessages : async (req, res, next) => {
    try{
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
      res.end()}
    catch(err){
      next(err)
    }
  },

  sendMessage : async(req, res, next) => {
    try{
      const MsgForm = {ok:0, user_not_found:1, unknown_error:2}
      const MsgType = {read:0, unread:1, sent:2}

      let to_id = await models.User.findOne({email:req.body.to}, "id").exec()
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
    }
    catch (error){
      next(error)
    }
  },

  deleteMessage: async(req, res, next) => {
    try{
      let msg = await models.Message.findByIdAndUpdate(req.body.msg_id, {deleted:true}).exec()
      res.json({ok:true})
      res.end()
    }
    catch(err){
      next(err)
    }
  },
  
  markMsgAsRead: async(req, res, next) => {
    try{
      const MsgType = {read:0, unread:1, sent:2}
      let msgStatus = await models.User.update({id:res.locals.id, "messages.msg_id":req.body.msg_id}, {
        $set:{'messages.$.msg_type' : MsgType.read}
      })

      res.json({ok:msgStatus.acknowledged})
      res.end()
    }
    catch(err){
      next(err)
    }
  }
}