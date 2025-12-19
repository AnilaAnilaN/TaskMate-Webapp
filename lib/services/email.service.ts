// service/email.service.ts
import nodemailer from 'nodemailer';

interface EmailOptions {
  to: string;
  subject: string;
  html: string;
}

class EmailService {
  private transporter: nodemailer.Transporter | null = null;
  private from: string;
  private isConfigured: boolean;

  constructor() {
    this.isConfigured = !!(
      process.env.SMTP_HOST &&
      process.env.SMTP_USER &&
      process.env.SMTP_PASS
    );

    if (!this.isConfigured) {
      console.warn('⚠️  SMTP credentials not configured. Email sending will fail.');
    }

    this.from = `"TaskManager" <${process.env.SMTP_USER || 'noreply@taskmanager.com'}>`;

    if (this.isConfigured) {
      this.transporter = nodemailer.createTransport({
        host: process.env.SMTP_HOST,
        port: Number(process.env.SMTP_PORT) || 587,
        secure: process.env.SMTP_SECURE === 'true',
        auth: {
          user: process.env.SMTP_USER,
          pass: process.env.SMTP_PASS,
        },
      });
    }
  }

  async sendEmail({ to, subject, html }: EmailOptions): Promise<void> {
    if (!this.isConfigured || !this.transporter) {
      console.error('❌ Cannot send email: SMTP not configured');
      throw new Error('Email service not configured');
    }

    try {
      const info = await this.transporter.sendMail({
        from: this.from,
        to,
        subject,
        html,
      });
      console.log(`✅ Email sent to ${to} - Message ID: ${info.messageId}`);
    } catch (error: any) {
      console.error('❌ Failed to send email:', error);
      throw new Error(`Failed to send email: ${error.message}`);
    }
  }

  async sendVerificationEmail(email: string, token: string): Promise<void> {
    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000';
    const verifyUrl = `${baseUrl}/verify-email?token=${token}`;

    const html = `
      <!DOCTYPE html>
      <html>
        <head>
          <meta charset="utf-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
        </head>
        <body style="margin: 0; padding: 0; font-family: Arial, sans-serif; background-color: #f5f5f5;">
          <table role="presentation" style="width: 100%; border-collapse: collapse;">
            <tr>
              <td style="padding: 40px 0; text-align: center;">
                <table role="presentation" style="width: 600px; margin: 0 auto; background-color: #ffffff; border-radius: 8px;">
                  <tr>
                    <td style="padding: 40px 30px; text-align: center;">
                      <h1 style="margin: 0 0 20px 0; color: #4f46e5; font-size: 28px;">📋 TaskManager</h1>
                      <h2 style="margin: 0 0 20px 0; color: #333;">Verify Your Email</h2>
                      <p style="margin: 0 0 30px 0; color: #666; font-size: 16px;">Click the button below to verify your email address.</p>
                      <a href="${verifyUrl}" style="display: inline-block; padding: 14px 32px; background: #4f46e5; color: #ffffff; text-decoration: none; border-radius: 6px; font-weight: 600;">Verify Email</a>
                      <p style="margin: 30px 0 0 0; color: #999; font-size: 14px;">Or copy this link: ${verifyUrl}</p>
                      <p style="margin: 20px 0 0 0; padding: 15px; background-color: #fef3c7; color: #92400e; font-size: 14px;">⏰ This link expires in 24 hours</p>
                    </td>
                  </tr>
                  <tr>
                    <td style="padding: 20px 30px; text-align: center; border-top: 1px solid #eee;">
                      <p style="margin: 0; color: #999; font-size: 12px;">© ${new Date().getFullYear()} TaskManager</p>
                    </td>
                  </tr>
                </table>
              </td>
            </tr>
          </table>
        </body>
      </html>
    `;

    await this.sendEmail({ to: email, subject: 'Verify Your Email - TaskManager', html });
  }

  async sendPasswordResetEmail(email: string, token: string): Promise<void> {
    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000';
    const resetUrl = `${baseUrl}/reset-password?token=${token}`;

    const html = `
      <!DOCTYPE html>
      <html>
        <head>
          <meta charset="utf-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
        </head>
        <body style="margin: 0; padding: 0; font-family: Arial, sans-serif; background-color: #f5f5f5;">
          <table role="presentation" style="width: 100%; border-collapse: collapse;">
            <tr>
              <td style="padding: 40px 0; text-align: center;">
                <table role="presentation" style="width: 600px; margin: 0 auto; background-color: #ffffff; border-radius: 8px;">
                  <tr>
                    <td style="padding: 40px 30px; text-align: center;">
                      <h1 style="margin: 0 0 20px 0; color: #dc2626; font-size: 28px;">🔐 Reset Password</h1>
                      <p style="margin: 0 0 30px 0; color: #666; font-size: 16px;">Click the button below to reset your password.</p>
                      <a href="${resetUrl}" style="display: inline-block; padding: 14px 32px; background: #dc2626; color: #ffffff; text-decoration: none; border-radius: 6px; font-weight: 600;">Reset Password</a>
                      <p style="margin: 30px 0 0 0; color: #999; font-size: 14px;">Or copy this link: ${resetUrl}</p>
                      <p style="margin: 20px 0 0 0; padding: 15px; background-color: #fee2e2; color: #991b1b; font-size: 14px;">🔒 This link expires in 1 hour</p>
                    </td>
                  </tr>
                  <tr>
                    <td style="padding: 20px 30px; text-align: center; border-top: 1px solid #eee;">
                      <p style="margin: 0; color: #999; font-size: 12px;">© ${new Date().getFullYear()} TaskManager</p>
                    </td>
                  </tr>
                </table>
              </td>
            </tr>
          </table>
        </body>
      </html>
    `;

    await this.sendEmail({ to: email, subject: 'Reset Your Password - TaskManager', html });
  }
}

export const emailService = new EmailService();