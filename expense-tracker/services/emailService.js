const { BrevoClient } = require("@getbrevo/brevo");

const brevo = new BrevoClient({
  apiKey: process.env.BREVO_API_KEY,
});

const sendForgotPasswordEmail = async (email) => {
  const result = await brevo.transactionalEmails.sendTransacEmail({
    subject: "Password Reset Request",
    htmlContent: `
      <h2>Password Reset</h2>
      <p>We received a request to reset your password.</p>
      <p>This is a demo password reset email from your Expense Tracker.</p>
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