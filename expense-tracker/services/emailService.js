const brevo = require("@getbrevo/brevo");

const apiInstance = new brevo.TransactionalEmailsApi();

apiInstance.setApiKey(
  brevo.TransactionalEmailsApiApiKeys.apiKey,
  process.env.BREVO_API_KEY
);

const sendForgotPasswordEmail = async (email) => {
  const sendSmtpEmail = new brevo.SendSmtpEmail();

  sendSmtpEmail.subject = "Password Reset Request";
  sendSmtpEmail.htmlContent = `
    <h2>Password Reset</h2>
    <p>We received a request to reset your password.</p>
    <p>This is a demo password reset email from your Expense Tracker.</p>
  `;

  // This should be your verified Brevo sender email
  sendSmtpEmail.sender = {
    name: "Expense Tracker",
    email: process.env.BREVO_SENDER_EMAIL,
  };

  sendSmtpEmail.to = [
    {
      email: email,
    },
  ];

  return await apiInstance.sendTransacEmail(sendSmtpEmail);
};

module.exports = {
  sendForgotPasswordEmail,
};