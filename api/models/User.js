const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  name:String,
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  role: { type: String, enum: ['student', 'professor', 'admin'], default: 'student' }
});

const User = mongoose.model('User', userSchema);
module.exports = User;