const mongoose = require("mongoose")
const Schema = mongoose.Schema

const msgSchema = Schema({
  to_id :  [Number],
  from_id : [Number],
  body : String,
  description : String,
  date : String,
  time: String,
  type : Number
})

msgSchema.method({
  getInbox : function(id, callback){
    this.find({to_id:id}, null, null, callback)
  }
})

module.exports = mongoose.model('Message', msgSchema)
