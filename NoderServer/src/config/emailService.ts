/**
 * Email Service Configuration Module
 * 
 * This module provides email functionality for the Node.js server using Nodemailer.
 * It handles sending OTP (One-Time Password) emails for user authentication.
 * 
 * Features:
 * - Configurable email transporter using environment variables
 * - OTP email templates with professional HTML formatting
 * - Error handling and logging for email operations
 * - Support for various email service providers (Gmail, Outlook, etc.)
 * 
 * Environment Variables Required:
 * - EMAIL_SERVICE: Email service provider (e.g., 'gmail', 'outlook')
 * - EMAIL_USER: Sender email address
 * - EMAIL_PASS: Email account password or app-specific password
 * 
 * Usage:
 * - Import and call sendOtpEmail(email, otp) to send OTP emails
 * - Returns boolean indicating success/failure of email delivery
 */

import nodemailer from 'nodemailer';

// Create nodemailer transporter
const transporter = nodemailer.createTransport({
  service: process.env.EMAIL_SERVICE,
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS
  }
});

// Function to send OTP email
const sendOtpEmail = async (email, otp) => {

  const mailOptions = {
    from: process.env.EMAIL_USER,
    to: email,
    subject: 'Your Login OTP',
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #eee; border-radius: 5px;">
        <h2 style="color: #333;">Authentication OTP</h2>
        <p>Hello,</p>
        <p>Your One-Time Password (OTP) for login is:</p>
        <div style="background-color: #f4f4f4; padding: 10px; text-align: center; font-size: 24px; font-weight: bold; letter-spacing: 5px; margin: 20px 0;">
          ${otp}
        </div>
        <p>This OTP is valid for 10 minutes. Please do not share it with anyone.</p>
        <p>If you did not request this OTP, please ignore this email.</p>
        <p>Thank you!</p>
      </div>
    `
  };

  try {
    const info = await transporter.sendMail(mailOptions);
    console.log('Email sent: ' + info.response);
    return true;
  } catch (error) {
    console.error('Error sending email:', error);
    return false;
  }
};

export default sendOtpEmail;