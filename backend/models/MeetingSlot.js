const mongoose = require("mongoose");

const bookedSlotSchema = new mongoose.Schema({
  date: {
    type: String, 
    required: true,
  },
  time: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
  },
  service: {
    type: String,
    required: true,
  },
});

module.exports = mongoose.model("BookedSlot", bookedSlotSchema);
