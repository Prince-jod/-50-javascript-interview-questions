const User = require("../models/User");
const ForgetPassword = require("../models/ForgetPassword");
const { sendForgotPasswordEmail } = require("../services/emailService");
const { v4: uuidv4 } = require("uuid");
const bcrypt = require("bcrypt");


// FORGET PASSWORD
const forgetPassword = async (req, res) => {
  try {
    const { email } = req.body;

    if (!email) {
      return res.status(400).json({
        message: "Email is required",
      });
    }

    const user = await User.findOne({
      where: { email },
    });

    if (!user) {
      return res.status(404).json({
        message: "User not found",
      });
    }

    const resetId = uuidv4();

    const forgetRequest = await ForgetPassword.create({
      id: resetId,
      userId: user.id,
      isActive: true,
    });

    const resetUrl =
      `http://localhost:3000/api/password/resetpassword/${forgetRequest.id}`;

    console.log("Reset UUID:", forgetRequest.id);
    console.log("Reset URL:", resetUrl);

    try {
      await sendForgotPasswordEmail(email, resetUrl);

      return res.status(200).json({
        message: "Password reset email sent successfully",
      });

    } catch (emailError) {
      console.error("Email Error:", emailError);

      return res.status(200).json({
        message: "Reset request created, but email could not be sent.",
        resetUrl,
      });
    }

  } catch (error) {
    console.error("Forget Password Error:", error);

    return res.status(500).json({
      message: error.message || "Internal Server Error",
    });
  }
};


// SHOW RESET PASSWORD FORM
const showResetPasswordForm = async (req, res) => {
  try {
    const { id } = req.params;

    const forgetRequest = await ForgetPassword.findOne({
      where: {
        id: id,
        isActive: true,
      },
    });

    if (!forgetRequest) {
      return res.status(400).send(`
        <h2>Invalid or expired password reset link</h2>
      `);
    }

    return res.send(`
      <!DOCTYPE html>
      <html>

      <head>
        <title>Reset Password</title>
      </head>

      <body>

        <h2>Reset Password</h2>

        <form method="POST" action="/api/password/resetpassword/${id}">

          <input
            type="password"
            name="password"
            placeholder="Enter new password"
            required
          />

          <button type="submit">
            Reset Password
          </button>

        </form>

      </body>

      </html>
    `);

  } catch (error) {
    console.error("Reset Password Form Error:", error);

    return res.status(500).send("Internal Server Error");
  }
};


// RESET PASSWORD
const resetPassword = async (req, res) => {
  try {
    const { id } = req.params;
    const { password } = req.body;

    if (!password) {
      return res.status(400).send("Password is required");
    }

    const forgetRequest = await ForgetPassword.findOne({
      where: {
        id: id,
        isActive: true,
      },
    });

    if (!forgetRequest) {
      return res.status(400).send(`
        <h2>Invalid or expired password reset link</h2>
      `);
    }

    // Hash new password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Update user's password
    await User.update(
      {
        password: hashedPassword,
      },
      {
        where: {
          id: forgetRequest.userId,
        },
      }
    );

    // Make reset link inactive
    await ForgetPassword.update(
      {
        isActive: false,
      },
      {
        where: {
          id: forgetRequest.id,
        },
      }
    );

    return res.send(`
      <h2>Password reset successfully!</h2>

      <p>You can now login with your new password.</p>

      <a href="/login">
        Go to Login
      </a>
    `);

  } catch (error) {
    console.error("Reset Password Error:", error);

    return res.status(500).send("Internal Server Error");
  }
};


module.exports = {
  forgetPassword,
  showResetPasswordForm,
  resetPassword,
};