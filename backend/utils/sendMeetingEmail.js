const nodemailer = require("nodemailer");

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.MAIL_USER,
    pass: process.env.MAIL_PASS,
  },
});

async function sendMeetingConfirmation(email, link, name, service, date, time) {
  await transporter.sendMail({
    from: `"GYS Support" <${process.env.MAIL_USER}>`,
    to: email,
    subject: "Your Consultation is Confirmed",
    html: `
      <p>Hi <strong>${name}</strong>,</p>
      <p>Your ${service} meeting is confirmed for <strong>${date}</strong> at <strong>${time}</strong>.</p>
      <p>Click the link below to join the meeting:</p>
      <a href="${link}" style="color: blue;">Join Google Meet</a>
      <p>Thank you!</p>
    `,
  });
}

module.exports = { sendMeetingConfirmation };
