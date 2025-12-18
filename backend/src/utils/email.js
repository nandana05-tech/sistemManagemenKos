const nodemailer = require('nodemailer');
const logger = require('./logger');

// Create transporter
const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST,
  port: process.env.SMTP_PORT,
  secure: process.env.SMTP_PORT === '465',
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS
  }
});

/**
 * Send email
 * @param {string} to - Recipient email
 * @param {string} subject - Email subject
 * @param {string} html - Email HTML content
 */
const sendEmail = async (to, subject, html) => {
  try {
    const info = await transporter.sendMail({
      from: process.env.EMAIL_FROM,
      to,
      subject,
      html
    });
    logger.info(`Email sent to ${to}: ${info.messageId}`);
    return info;
  } catch (error) {
    logger.error(`Failed to send email to ${to}:`, error);
    throw error;
  }
};

/**
 * Send verification email
 * @param {string} to - Recipient email
 * @param {string} name - User name
 * @param {string} token - Verification token
 */
const sendVerificationEmail = async (to, name, token) => {
  const verifyUrl = `${process.env.FRONTEND_URL}/verify-email?token=${token}`;
  const html = `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
      <h2 style="color: #333;">Verifikasi Email Anda</h2>
      <p>Halo <strong>${name}</strong>,</p>
      <p>Terima kasih telah mendaftar di Sistem Manajemen Kost. Silakan klik tombol di bawah untuk memverifikasi email Anda:</p>
      <p style="text-align: center; margin: 30px 0;">
        <a href="${verifyUrl}" style="background-color: #4F46E5; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; display: inline-block;">
          Verifikasi Email
        </a>
      </p>
      <p>Atau salin link berikut ke browser Anda:</p>
      <p style="color: #666; word-break: break-all;">${verifyUrl}</p>
      <hr style="border: none; border-top: 1px solid #eee; margin: 30px 0;">
      <p style="color: #999; font-size: 12px;">Jika Anda tidak mendaftar di platform kami, abaikan email ini.</p>
    </div>
  `;
  return sendEmail(to, 'Verifikasi Email - Kost Management', html);
};

/**
 * Send password reset email
 * @param {string} to - Recipient email
 * @param {string} name - User name
 * @param {string} token - Reset token
 */
const sendPasswordResetEmail = async (to, name, token) => {
  const resetUrl = `${process.env.FRONTEND_URL}/reset-password?token=${token}`;
  const html = `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
      <h2 style="color: #333;">Reset Password</h2>
      <p>Halo <strong>${name}</strong>,</p>
      <p>Kami menerima permintaan untuk reset password akun Anda. Klik tombol di bawah untuk membuat password baru:</p>
      <p style="text-align: center; margin: 30px 0;">
        <a href="${resetUrl}" style="background-color: #4F46E5; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; display: inline-block;">
          Reset Password
        </a>
      </p>
      <p>Link ini akan kadaluarsa dalam 1 jam.</p>
      <p>Atau salin link berikut ke browser Anda:</p>
      <p style="color: #666; word-break: break-all;">${resetUrl}</p>
      <hr style="border: none; border-top: 1px solid #eee; margin: 30px 0;">
      <p style="color: #999; font-size: 12px;">Jika Anda tidak meminta reset password, abaikan email ini.</p>
    </div>
  `;
  return sendEmail(to, 'Reset Password - Kost Management', html);
};

/**
 * Send payment notification email
 * @param {string} to - Recipient email
 * @param {object} data - Payment data
 */
const sendPaymentNotification = async (to, data) => {
  const html = `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
      <h2 style="color: #333;">Notifikasi Pembayaran</h2>
      <p>Halo <strong>${data.name}</strong>,</p>
      <p>Pembayaran Anda telah <strong>${data.status}</strong>.</p>
      <table style="width: 100%; border-collapse: collapse; margin: 20px 0;">
        <tr>
          <td style="padding: 10px; border-bottom: 1px solid #eee;">Kode Pembayaran</td>
          <td style="padding: 10px; border-bottom: 1px solid #eee; font-weight: bold;">${data.kodePembayaran}</td>
        </tr>
        <tr>
          <td style="padding: 10px; border-bottom: 1px solid #eee;">Nominal</td>
          <td style="padding: 10px; border-bottom: 1px solid #eee; font-weight: bold;">Rp ${data.nominal.toLocaleString('id-ID')}</td>
        </tr>
        <tr>
          <td style="padding: 10px; border-bottom: 1px solid #eee;">Tanggal</td>
          <td style="padding: 10px; border-bottom: 1px solid #eee;">${new Date().toLocaleDateString('id-ID')}</td>
        </tr>
      </table>
      <hr style="border: none; border-top: 1px solid #eee; margin: 30px 0;">
      <p style="color: #999; font-size: 12px;">Email ini dikirim secara otomatis. Jangan membalas email ini.</p>
    </div>
  `;
  return sendEmail(to, `Notifikasi Pembayaran - ${data.kodePembayaran}`, html);
};

module.exports = {
  sendEmail,
  sendVerificationEmail,
  sendPasswordResetEmail,
  sendPaymentNotification
};
