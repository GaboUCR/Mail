const mongoose = require("mongoose")
const Schema = mongoose.Schema

const msgSchema = Schema({
  to_id : mongoose.ObjectId,
  from_id : mongoose.ObjectId,
  body : String,
  description : String,
  date : Number
})

module.exports = mongoose.model('Message', msgSchema)
