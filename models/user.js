const mongoose = require('mongoose')

const userSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
  },
  profilePictureURL: String,
  username: String,
  nickname: String,
  phoneNumber: Number,
  address: String
}, { timestamps: true })

const User = mongoose.model('User', userSchema);

module.exports = User;
