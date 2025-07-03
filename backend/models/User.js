const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  email: { type: String, required: true, unique: true },
  name: String,
  otp: String,
  otpExpires: {
    type: Date,
    index: { expires: 0 }  
  }
});

module.exports = mongoose.model("User", userSchema);
