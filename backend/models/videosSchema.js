const mongoose = require('mongoose');

mongoose.connect("mongodb://127.0.0.1:27017/youtubeclone")

const videoSchema = new mongoose.Schema({
  id:Number,
  title:String,
  description:String,
  likes:Number,
  views:Number,
  dislikes:Number,
  thumbinal:String,
  video:String,
  uploadBy: Number,
  comments:[],
  date:{
    type:Date,
    default:Date.now
  }
});

// Create the User model
const video = mongoose.model('Video', videoSchema);

// Export the User model
module.exports = video;