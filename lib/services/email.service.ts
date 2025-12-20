// lib/services/email.service.ts
import nodemailer from 'nodemailer';

interface EmailOptions {
  to: string;
  subject: string;
  html: string;
}

const isConfigured = !!(
  process.env.SMTP_HOST &&
  process.env.SMTP_USER &&
  process.env.SMTP_PASS
);

if (!isConfigured) {
  console.warn('⚠️ SMTP credentials not configured. Email sending will fail.');
}

const from = `"TaskMate" <${process.env.SMTP_USER || 'noreply@taskmate.app'}>`;

let transporter: nodemailer.Transporter | null = null;

if (isConfigured) {
  transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port: Number(process.env.SMTP_PORT) || 587,
    secure: process.env.SMTP_SECURE === 'true',
    auth: {
      user: process.env.SMTP_USER,
      pass: process.env.SMTP_PASS,
    },
    tls: {
      rejectUnauthorized: false,
    },
  });
}

async function sendEmail({ to, subject, html }: EmailOptions): Promise<void> {
  if (!isConfigured || !transporter) {
    console.error('❌ Cannot send email: SMTP not configured');
    throw new Error('Email service not configured');
  }

  try {
    const info = await transporter.sendMail({
      from,
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

/**
 * Send 6-digit verification code
 */
export async function sendVerificationCode(email: string, code: string): Promise<void> {
  const html = `
    <!DOCTYPE html>
    <html lang="en">
      <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Your TaskMate Verification Code</title>
      </head>
      <body style="margin: 0; padding: 0; font-family: Arial, Helvetica, sans-serif; background-color: #f9fafb;">
        <table role="presentation" style="width: 100%; border-collapse: collapse;">
          <tr>
            <td style="padding: 40px 20px; text-align: center;">
              <table role="presentation" style="max-width: 600px; margin: 0 auto; background-color: #ffffff; border-radius: 12px; box-shadow: 0 4px 20px rgba(0,0,0,0.08);">
                <tr>
                  <td style="padding: 40px 30px; text-align: center;">
                    <div style="font-size: 48px; margin-bottom: 16px;">😊</div>
                    <h1 style="margin: 0 0 20px 0; color: #4f46e5; font-size: 32px; font-weight: bold;">TaskMate</h1>
                    <h2 style="margin: 0 0 24px 0; color: #1f2937; font-size: 24px;">Your Verification Code</h2>
                    <p style="margin: 0 0 32px 0; color: #6b7280; font-size: 16px; line-height: 1.6;">
                      Please use the following code to verify your email and complete your registration.
                    </p>
                    
                    <div style="padding: 20px 40px; background-color: #eef2ff; border-radius: 10px; font-size: 36px; font-weight: bold; letter-spacing: 12px; color: #4f46e5; display: inline-block; margin: 20px 0; border: 2px dashed #c7d2fe;">
                      ${code}
                    </div>

                    <p style="margin: 32px 0 0 0; color: #9ca3af; font-size: 15px;">
                      ⏰ This code expires in <strong>15 minutes</strong>
                    </p>
                  </td>
                </tr>
                <tr>
                  <td style="padding: 24px 30px; text-align: center; background-color: #f9fafb; border-top: 1px solid #e5e7eb;">
                    <p style="margin: 0; color: #9ca3af; font-size: 12px;">
                      © ${new Date().getFullYear()} TaskMate. All rights reserved.
                    </p>
                  </td>
                </tr>
              </table>
            </td>
          </tr>
        </table>
      </body>
    </html>
  `;

  await sendEmail({
    to: email,
    subject: 'Your TaskMate Verification Code',
    html,
  });
}

/**
 * Send password reset link
 */
export async function sendPasswordResetEmail(email: string, token: string, userId: string): Promise<void> {
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000';
  const resetUrl = `${baseUrl}/reset-password?token=${token}&userId=${userId}`;

  const html = `
    <!DOCTYPE html>
    <html lang="en">
      <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Reset Your TaskMate Password</title>
      </head>
      <body style="margin: 0; padding: 0; font-family: Arial, Helvetica, sans-serif; background-color: #f9fafb;">
        <table role="presentation" style="width: 100%; border-collapse: collapse;">
          <tr>
            <td style="padding: 40px 20px; text-align: center;">
              <table role="presentation" style="max-width: 600px; margin: 0 auto; background-color: #ffffff; border-radius: 12px; box-shadow: 0 4px 20px rgba(0,0,0,0.08);">
                <tr>
                  <td style="padding: 40px 30px; text-align: center;">
                    <div style="font-size: 48px; margin-bottom: 16px;">🔐</div>
                    <h1 style="margin: 0 0 20px 0; color: #dc2626; font-size: 32px; font-weight: bold;">TaskMate</h1>
                    <h2 style="margin: 0 0 24px 0; color: #1f2937; font-size: 24px;">Reset Your Password</h2>
                    <p style="margin: 0 0 32px 0; color: #6b7280; font-size: 16px; line-height: 1.6;">
                      You requested to reset your password. Click the button below to create a new one.
                    </p>
                    
                    <a href="${resetUrl}" style="display: inline-block; padding: 16px 40px; background-color: #dc2626; color: #ffffff; text-decoration: none; border-radius: 8px; font-weight: bold; font-size: 18px;">
                      Reset Password
                    </a>

                    <p style="margin: 32px 0 0 0; color: #9ca3af; font-size: 15px;">
                      Or copy and paste this link:
                      <br><br>
                      <span style="word-break: break-all; color: #6b7280;">${resetUrl}</span>
                    </p>

                    <p style="margin: 32px 0 0 0; color: #9ca3af; font-size: 15px;">
                      🔒 This link expires in <strong>1 hour</strong>
                    </p>
                  </td>
                </tr>
                <tr>
                  <td style="padding: 24px 30px; text-align: center; background-color: #f9fafb; border-top: 1px solid #e5e7eb;">
                    <p style="margin: 0; color: #9ca3af; font-size: 12px;">
                      © ${new Date().getFullYear()} TaskMate. All rights reserved.
                    </p>
                  </td>
                </tr>
              </table>
            </td>
          </tr>
        </table>
      </body>
    </html>
  `;

  await sendEmail({
    to: email,
    subject: 'Reset Your TaskMate Password',
    html,
  });
}