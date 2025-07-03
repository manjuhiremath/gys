const express = require("express");
const router = express.Router();
const User = require("../models/User");
const BookedSlot = require("../models/BookedSlot");
const { createMeetEvent } = require("../utils/googleCalendar");
const { sendMeetingConfirmation } = require("../utils/sendMeetingEmail");

router.post("/book-meeting", async (req, res) => {
  try {
    const { email, service, date, time, additionalInfo } = req.body;

    const user = await User.findOne({ email });
    if (!user) return res.status(403).json({ message: "User not verified" });

    user.meeting = { service, date, time, additionalInfo };
    await user.save();

    await BookedSlot.create({ email, service, date, time });

    const meetingLink = await createMeetEvent({
      email,
      name: user.name,
      service,
      date,
      time,
    });

    await sendMeetingConfirmation(email, meetingLink, user.name, service, date, time);

    res.json({ message: "Meeting booked", meetingLink });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Something went wrong", error: err.message });
  }
});

module.exports = router;
