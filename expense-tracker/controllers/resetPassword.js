const User = require("../models/User");
const ForgetPassword = require("../models/ForgetPassword");
const bcrypt = require("bcrypt");

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
    `);

  } catch (error) {
    console.error("Show Reset Password Error:", error);

    return res.status(500).send("Internal Server Error");
  }
};


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

    const hashedPassword = await bcrypt.hash(password, 10);

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
      <a href="/login">Go to Login</a>
    `);

  } catch (error) {
    console.error("Reset Password Error:", error);

    return res.status(500).send("Internal Server Error");
  }
};


module.exports = {
  showResetPasswordForm,
  resetPassword,
};