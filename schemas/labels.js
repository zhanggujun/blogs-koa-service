const mongoose = require('mongoose');
module.exports = new mongoose.Schema({
  label:String,
  time:Date,
  labelId:String,
  articleCount:Number||String,
  isDefault:{
    type:Boolean,
    default:false
  }
});