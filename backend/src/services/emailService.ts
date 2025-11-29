import nodemailer from 'nodemailer';

// Minimal email sender for forgot-password flows. Configure using env vars.
const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST || 'localhost',
  port: Number(process.env.SMTP_PORT || 1025),
  secure: false,
  auth: process.env.SMTP_USER ? { user: process.env.SMTP_USER, pass: process.env.SMTP_PASS } : undefined,
});

export async function sendPasswordReset(email: string, token: string) {
  const resetUrl = `${process.env.FRONTEND_URL || 'http://localhost:3001'}/reset-password?token=${token}`;
  await transporter.sendMail({
    from: process.env.SMTP_FROM || 'no-reply@icoachie.local',
    to: email,
    subject: 'iCoachie password reset',
    text: `Click here to reset your password: ${resetUrl}`,
    html: `<p>Click here to reset your password: <a href="${resetUrl}">${resetUrl}</a></p>`,
  });
}
