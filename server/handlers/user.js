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

  getUsers: async(req, res, next) => {
    try{
      let emailsQ = await models.User.find({"email":{$regex: req.body.search, $options:"i" }}, "email").exec()
      emails = []
      for (const n in emailsQ){
        emails.push(emailsQ[n].email)
      }
      res.json({emails:emails})
      res.end()
    }
    catch(err){
      next(err)
    }
  },

  signUpUser : async (req, res, next) => {
    try{
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
        maxAge: 30*24*60 * 60 * 1000,
        httpOnly: true,
        sameSite: true,
        secure:true
      })
      res.json({error:MsgForm.ok})
      res.end()
    }
    catch(err){
      next(err)
    }
  },

  logOut: async(req, res, next) => {
    try{
      res.clearCookie("LogIn")
      res.end()
    }
    catch (err){
      next(err)
    }
  },

  checkCookie : async (req, res, next) => {
    try{
      for (const n of req.app.locals.users) {
        if (n.cookie === req.cookies.LogIn){
          res.locals.id = n.id
          next()
          return 0;
        }
      }
      res.json({logged:false})
      res.end()
    }
    catch(err){
      next(err)
    }

  },
  islogged : async(req, res, next) => {
    try{
      let email = await models.User.findById(res.locals.id, "email").exec()
      res.json({email:email.email, logged:true})
      res.end()
    }
    catch(err){
      next(err)
    }
  },

  logIn: async (req, res, next) => {
    try{
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
    }
    catch(err){
      next(err)
    }
  }
}
