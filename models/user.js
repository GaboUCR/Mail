const mongoose = require("mongoose")
const Schema = mongoose.Schema

const userSchema = Schema({
  email : String,
  password : String,
  messages : [{msg_id:mongoose.ObjectId, msg_type:Number}]
})

module.exports = mongoose.model('User', userSchema)
