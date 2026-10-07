const { BrevoClient } = require("@getbrevo/brevo");

const brevo = new BrevoClient({
  apiKey: process.env.BREVO_API_KEY,
});

const sendForgotPasswordEmail = async (email, resetUrl) => {
  const result = await brevo.transactionalEmails.sendTransacEmail({
    subject: "Password Reset Request",

    htmlContent: `
      <h2>Password Reset</h2>

      <p>We received a request to reset your password.</p>

      <p>Click the button below to reset your password:</p>

      <a href="${resetUrl}"
         style="
           display:inline-block;
           padding:10px 20px;
           background:#007bff;
           color:white;
           text-decoration:none;
           border-radius:5px;
         ">
         Reset Password
      </a>

      <p>If you did not request this, you can ignore this email.</p>
    `,

    sender: {
      name: "Expense Tracker",
      email: process.env.BREVO_SENDER_EMAIL,
    },

    to: [
      {
        email: email,
      },
    ],
  });

  return result;
};

module.exports = {
  sendForgotPasswordEmail,
};