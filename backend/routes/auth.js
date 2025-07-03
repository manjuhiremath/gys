const express = require("express");
const router = express.Router();
const User = require("../models/User.js");
const BookedSlot = require("../models/MeetingSlot.js");
const nodemailer = require("nodemailer");
const { sendOtpEmail, sendMeetingConfirmation } = require("../utils/sendOtp.js");
const crypto = require("crypto");
const { verifyOtp } = require("../utils/otpcontroller.js");
const { createMeetEvent, createCalendarEvent } = require("../utils/googleCalendar.js");


router.post("/send-otp", async (req, res) => {
  const { name, email } = req.body;

  if (!email || !name) {
    return res.status(400).json({ message: 'Name and Email are required.' });
  }

  try {
    let user = await User.findOne({ email });

    const otp = crypto.randomInt(100000, 999999);
    const otpExpires = new Date(Date.now() + 5 * 60 * 1000);

    if (!user) {
      user = await User.create({ name, email, otp, otpExpires });
    } else {
      user.otp = otp;
      user.otpExpires = otpExpires;
    }

    await user.save();

    await sendOtpEmail(email, otp);

    res.status(200).json({ message: 'OTP sent to email', email });
  } catch (error) {
    console.error('Auth Error:', error);
    res.status(500).json({ message: 'Server error' });
  }
})
router.post("/verify-otp", verifyOtp);



router.post("/book-meeting", async (req, res) => {
  try {
    const { email, service, date, time, additionalInfo } = req.body;
   
    const user = await User.findOne({ email });
    if (!user) return res.status(403).json({ message: "User not verified" });

    user.meeting = { service, date, time, additionalInfo };
    await user.save();

    await BookedSlot.create({ email, service, date, time });

    const meetingLink = await createCalendarEvent({
      email,
      name: user.name,
      service,
      date,
      time,
    });

    await sendMeetingConfirmation(email, meetingLink, user.name, service, date, time);

    res.json({ message: "Meeting booked", email:email,meetinglink: meetingLink, name:user.name, service:service, date:date, time:time });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Something went wrong", error: err.message });
  }
});

module.exports = router;
