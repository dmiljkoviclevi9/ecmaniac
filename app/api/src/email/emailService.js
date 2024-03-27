import { createEmailTransporter } from './emailConfig.js'; 

class EmailService {
  async sendVerificationEmail(to, token) {
    const transporter = createEmailTransporter();
    const verificationUrl = `http://yourfrontenddomain.com/verify?token=${token}`;
    const message = {
      from: '"ecmaniac" <no-reply@example.com>',
      to,
      subject: 'Verify Your Email',
      html: `Please click the following link to verify your email: <a href="${verificationUrl}">${verificationUrl}</a>`
    };

    await transporter.sendMail(message);
  }
}

export default EmailService;