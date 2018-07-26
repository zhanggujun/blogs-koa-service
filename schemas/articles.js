const mongoose = require('mongoose');
module.exports = new mongoose.Schema({
  title: String,
  keyword:String,
  label:String,
  labelId:String,
  describe:String,
  content:String,
  type:String,
  typeId:String,
  status:String,
  isopen:String,
  time:Date,
  articleId:String,
  image:{
    type:Array,
    default:[]
  },
  imageList:{
    type:Array,
    default:[]
  }
});