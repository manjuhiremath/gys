const express = require("express");
const router = express.Router();
const BookedSlot = require("../models/MeetingSlot.js");

router.get("/booked-times", async (req, res) => {
  const { date } = req.query;
  if (!date) return res.status(400).json({ message: "Date is required" });

  const slots = await BookedSlot.find({ date });
  const bookedTimes = slots.map(slot => slot.time);
  res.json(bookedTimes);
});

module.exports = router;
