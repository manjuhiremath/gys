const nodemailer = require("nodemailer");

const transporter = nodemailer.createTransport({
  service: 'gmail', 
  auth: {
    user: process.env.MAIL_USER,
    pass: process.env.MAIL_PASS,
  },
});

exports.sendOtpEmail = async (to, otp) => {
  const mailOptions = {
    from: process.env.MAIL_USER,
    to:to,
    subject: "Your OTP Code",
    html:  `Hello ,\n\nYour OTP for the ride confirmation is: ${otp}. It will expire in 5 minutes.\n\nThanks,\nTaxi App`,
  };

  return transporter.sendMail(mailOptions);
};

exports.sendMeetingConfirmation = async (to, meetingLink, name, service, date, time) => {
  return transporter.sendMail({
    from: process.env.MAIL_USER,
    to: to,
    subject: "✅ Your Meeting is Confirmed",
    html: `
      <div style="font-family: Arial, sans-serif; color: #333; padding: 20px;">
        <h2 style="color: #4CAF50;">Hello ${name},</h2>
        
        <p>Thank you for booking a meeting with us! 🎉</p>

        <h3>📅 Meeting Details:</h3>
        <ul style="line-height: 1.6;">
          <li><strong>Service:</strong> ${service}</li>
          <li><strong>Date:</strong> ${date}</li>
          <li><strong>Time:</strong> ${time}</li>
          <li><strong>Meeting Link:</strong> <a href="${meetingLink}">${meetingLink}</a></li>
        </ul>

        <p>Please join the meeting on time using the link above.</p>
        
        <p>If you have any questions, feel free to reply to this email.</p>

        <br/>
        <p>Best Regards,</p>
        <p><strong>The Tech Team</strong></p>
      </div>
    `
  });
};
