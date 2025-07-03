const User = require("../models/User");

exports.verifyOtp = async (req, res) => {
  const { email, otp } = req.body;

  if (!email || !otp) {
    return res.status(400).json({ message: "Email and OTP are required" });
  }

  try {
    const user = await User.findOne({ email });

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    if (user.otp !== otp) {
      return res.status(400).json({ message: "Invalid OTP" });
    }

    if (user.otpExpires && user.otpExpires < Date.now()) {
      return res.status(400).json({ message: "OTP expired" });
    }

    
    user.otp = null;
    user.otpExpires = null;
    await user.save();

    return res.status(200).json({ message: "OTP verified successfully", user });
  } catch (error) {
    console.error("OTP Verify Error:", error);
    return res.status(500).json({ message: "Server error" });
  }
};