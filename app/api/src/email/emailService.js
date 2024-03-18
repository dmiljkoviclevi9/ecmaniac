import emailTransporter from './emailConfig.js'; 

class EmailService {
  static async sendVerificationEmail(to, token) {
    const verificationUrl = `http://yourfrontenddomain.com/verify?token=${token}`;
    const message = {
      from: '"ecmaniac" <no-reply@example.com>',
      to,
      subject: 'Verify Your Email',
      html: `Please click the following link to verify your email: <a href="${verificationUrl}">${verificationUrl}</a>`
    };

    await emailTransporter.sendMail(message);
  }
}

export default EmailService;