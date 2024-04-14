const mongoose = require('mongoose');

mongoose.connect("mongodb://127.0.0.1:27017/youtubeclone")

const userSchema = new mongoose.Schema({
  id:Number,
  username:String,
  email:String,
  password:String,
  number:Number,
  channelName:String,
  bannerPic:String,
  profilePic:String,
  subscribers:Number,
  date:{
    type:Date,
    default:Date.now
  }
});

// Create the User model
const user = mongoose.model('user', userSchema);

// Export the User model
module.exports = user;