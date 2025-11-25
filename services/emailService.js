const nodemailer = require("nodemailer");

class EmailService {
  constructor() {
    // PERBAIKAN: createTransport (bukan createTransporter)
    this.transporter = nodemailer.createTransport({
      service: process.env.EMAIL_SERVICE || "gmail",
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });
  }

  async sendVerificationEmail(email, token) {
    try {
      // PERBAIKAN: Tambahkan validasi untuk environment variables
      if (!process.env.EMAIL_USER || !process.env.EMAIL_PASS) {
        throw new Error("Email configuration not found");
      }

      const verificationUrl = `${process.env.BASE_URL}/api/auth/verify-email?token=${token}`;

      const mailOptions = {
        from: `"EduCourse" <${process.env.EMAIL_USER}>`,
        to: email,
        subject: "Verify Your Email - EduCourse",
        html: `
          <!DOCTYPE html>
          <html>
          <head>
            <style>
              body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
              .container { max-width: 600px; margin: 0 auto; padding: 20px; }
              .header { background: #4CAF50; color: white; padding: 20px; text-align: center; }
              .content { padding: 20px; background: #f9f9f9; }
              .button { 
                display: inline-block; 
                padding: 12px 24px; 
                background: #4CAF50; 
                color: white; 
                text-decoration: none; 
                border-radius: 4px; 
                margin: 20px 0;
              }
              .footer { 
                margin-top: 20px; 
                padding: 20px; 
                background: #eee; 
                text-align: center; 
                font-size: 12px;
              }
            </style>
          </head>
          <body>
            <div class="container">
              <div class="header">
                <h1>Welcome to EduCourse!</h1>
              </div>
              <div class="content">
                <h2>Email Verification</h2>
                <p>Hello,</p>
                <p>Thank you for registering with EduCourse. Please verify your email address by clicking the button below:</p>
                <a href="${verificationUrl}" class="button">Verify Email Address</a>
                <p>Or copy and paste this link in your browser:</p>
                <p><a href="${verificationUrl}">${verificationUrl}</a></p>
                <p>This verification link will expire in 24 hours.</p>
                <p>If you didn't create an account with EduCourse, please ignore this email.</p>
              </div>
              <div class="footer">
                <p>&copy; 2024 EduCourse. All rights reserved.</p>
              </div>
            </div>
          </body>
          </html>
        `,
      };

      const result = await this.transporter.sendMail(mailOptions);
      console.log("✅ Verification email sent to:", email);
      return result;
    } catch (error) {
      console.error("❌ Error sending verification email:", error);
      throw new Error("Failed to send verification email: " + error.message);
    }
  }

  async sendWelcomeEmail(email, fullname) {
    try {
      if (!process.env.EMAIL_USER || !process.env.EMAIL_PASS) {
        throw new Error("Email configuration not found");
      }

      const mailOptions = {
        from: `"EduCourse" <${process.env.EMAIL_USER}>`,
        to: email,
        subject: "Welcome to EduCourse!",
        html: `
          <!DOCTYPE html>
          <html>
          <head>
            <style>
              body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
              .container { max-width: 600px; margin: 0 auto; padding: 20px; }
              .header { background: #4CAF50; color: white; padding: 20px; text-align: center; }
              .content { padding: 20px; background: #f9f9f9; }
            </style>
          </head>
          <body>
            <div class="container">
              <div class="header">
                <h1>Welcome to EduCourse!</h1>
              </div>
              <div class="content">
                <h2>Hello ${fullname}!</h2>
                <p>Your email has been successfully verified and your account is now active.</p>
                <p>Start exploring our courses and enhance your skills today!</p>
                <p>Happy learning! 🎓</p>
              </div>
            </div>
          </body>
          </html>
        `,
      };

      const result = await this.transporter.sendMail(mailOptions);
      console.log("✅ Welcome email sent to:", email);
      return result;
    } catch (error) {
      console.error("❌ Error sending welcome email:", error);
      throw new Error("Failed to send welcome email: " + error.message);
    }
  }

  // Method untuk verifikasi koneksi transporter
  async verifyTransporter() {
    try {
      await this.transporter.verify();
      console.log("✅ Email transporter is ready");
      return true;
    } catch (error) {
      console.error("❌ Email transporter error:", error);
      return false;
    }
  }
}

module.exports = new EmailService();
