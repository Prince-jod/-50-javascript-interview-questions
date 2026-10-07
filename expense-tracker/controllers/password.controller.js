const User = require("../models/User");
const ForgotPasswordRequest = require("../models/ForgotPasswordRequest");
const { sendForgotPasswordEmail } = require("../services/emailService");

const { v4: uuidv4 } = require("uuid");

const forgotPassword = async (req, res) => {
  try {
    const { email } = req.body;

    // 1. Check email
    if (!email) {
      return res.status(400).json({
        message: "Email is required",
      });
    }

    // 2. Find user
    const user = await User.findOne({
      where: { email },
    });

    if (!user) {
      return res.status(404).json({
        message: "User not found",
      });
    }

    // 3. Generate UUID
    const resetId = uuidv4();

    // 4. Create forgot password request
    const forgotRequest = await ForgotPasswordRequest.create({
      id: resetId,
      userId: user.id,
      isActive: true,
    });

    console.log("Reset UUID:", forgotRequest.id);

    // 5. Create reset URL
    const resetUrl =
      `http://localhost:3000/api/password/resetpassword/${forgotRequest.id}`;

    console.log("Reset URL:", resetUrl);

    // 6. Try sending email
    try {
      await sendForgotPasswordEmail(email, resetUrl);

      return res.status(200).json({
        message: "Password reset email sent successfully",
      });

    } catch (emailError) {

      console.error("Email Error:", emailError);

      // Email failed, but request already exists in DB
      return res.status(200).json({
        message: "Reset request created, but email could not be sent.",
        resetUrl: resetUrl,
      });
    }

  } catch (error) {
    console.error("Forgot Password Error:", error);

    return res.status(500).json({
      message: error.message || "Internal Server Error",
    });
  }
};

module.exports = {
  forgotPassword,
};