const TOKEN_PURPOSE = {
    email_verification: "email_verification",
    reset_password: "reset_password",
    
}
function getVerificationEmailTemplate(token) {
  const verificationLink = `${process.env.CLIENT_URL}/auth/verify-email/${token}`;

  return `
    <div style="font-family: Arial, sans-serif; line-height: 1.5; padding: 20px;">
      <h2 style="color: #333;">Welcome to Todo App 🎉</h2>
      <p>Thanks for signing up! Please verify your email by clicking the button below:</p>
      <div style="margin: 30px 0;">
        <a href="${verificationLink}"
           style="background: #007BFF; color: white; padding: 12px 20px; text-decoration: none; border-radius: 5px; font-weight: bold;">
          Verify Email
        </a>
      </div>
      <p style="color: #888; font-size: 12px;">If you didn’t request this, you can safely ignore this email.</p>
    </div>
  `;
}

module.exports ={
    TOKEN_PURPOSE, getVerificationEmailTemplate
}