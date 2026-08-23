import nodemailer from 'nodemailer';

let transporter;

const getTransporter = () => {
  if (transporter) return transporter;

  // If SMTP isn't configured, fall back to a JSON transport that logs
  // emails to the console instead of failing — handy for local dev/demos.
  if (!process.env.SMTP_USER || !process.env.SMTP_PASS) {
    console.warn('[Email] SMTP not configured — emails will be logged to console instead of sent.');
    transporter = nodemailer.createTransport({ jsonTransport: true });
    return transporter;
  }

  transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port: Number(process.env.SMTP_PORT) || 587,
    secure: false,
    auth: { user: process.env.SMTP_USER, pass: process.env.SMTP_PASS },
  });
  return transporter;
};

const baseTemplate = (title, bodyHtml) => `
  <div style="font-family: 'Segoe UI', Arial, sans-serif; background:#f4f6fb; padding:32px;">
    <div style="max-width:480px;margin:0 auto;background:#fff;border-radius:16px;padding:32px;box-shadow:0 4px 24px rgba(20,20,60,0.08);">
      <h2 style="color:#0f766e;margin-top:0;">MediSense</h2>
      <h3 style="color:#111827;">${title}</h3>
      ${bodyHtml}
      <p style="color:#9ca3af;font-size:12px;margin-top:32px;">
        MediSense provides AI-assisted, preliminary information only and is not a substitute for professional medical advice.
      </p>
    </div>
  </div>
`;

export const sendVerificationEmail = async (to, name, token) => {
  const url = `${process.env.CLIENT_URL}/verify-email/${token}`;
  const html = baseTemplate(
    'Verify your email',
    `<p>Hi ${name}, welcome to MediSense! Please confirm your email address to activate your account.</p>
     <p><a href="${url}" style="display:inline-block;background:#0f766e;color:#fff;padding:12px 24px;border-radius:8px;text-decoration:none;">Verify Email</a></p>
     <p style="color:#6b7280;font-size:13px;">This link expires in 24 hours. If the button doesn't work, copy this link: ${url}</p>`
  );

  const info = await getTransporter().sendMail({
    from: process.env.EMAIL_FROM,
    to,
    subject: 'Verify your MediSense account',
    html,
  });

  if (info.message) console.log('[Email:jsonTransport] Verification email ->', to, url);
  return info;
};

export const sendPasswordResetEmail = async (to, name, token) => {
  const url = `${process.env.CLIENT_URL}/reset-password/${token}`;
  const html = baseTemplate(
    'Reset your password',
    `<p>Hi ${name}, we received a request to reset your MediSense password.</p>
     <p><a href="${url}" style="display:inline-block;background:#0f766e;color:#fff;padding:12px 24px;border-radius:8px;text-decoration:none;">Reset Password</a></p>
     <p style="color:#6b7280;font-size:13px;">This link expires in 1 hour. If you didn't request this, you can safely ignore this email.</p>`
  );

  const info = await getTransporter().sendMail({
    from: process.env.EMAIL_FROM,
    to,
    subject: 'Reset your MediSense password',
    html,
  });

  if (info.message) console.log('[Email:jsonTransport] Password reset email ->', to, url);
  return info;
};
