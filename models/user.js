const mongoose = require("mongoose")
const Schema = mongoose.Schema

const msg_type = {
   inbox: 1,
   sent: 2,
   spam: 3,
   stared: 4
};
Object.freeze(msg_type);

const userSchema = Schema({
  email : String,
  password : String
})

module.exports = mongoose.model('User', userSchema)
