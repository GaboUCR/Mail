const mongoose = require("mongoose")
const Schema = mongoose.Schema

const msgSchema = Schema({
  to_id : mongoose.ObjectId,
  from_id : mongoose.ObjectId,
  body : String,
  description : String,
  date : Number
})

msgSchema.method({
  getInbox : function(id, callback){
    this.find({to_id:id}, null, null, callback)
  }
})

module.exports = mongoose.model('Message', msgSchema)
