const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true },
  age: { type: Number, required: true },
  profile: { type: String, default: '' }
});

const UserModel = mongoose.model("users", UserSchema);
module.exports = UserModel;