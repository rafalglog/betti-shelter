import nodemailer from "nodemailer";

type EmailConfig = {
  host: string;
  port: number;
  secure: boolean;
  user: string;
  pass: string;
  from: string;
};

const getEmailConfig = (): EmailConfig | null => {
  const host = process.env.EMAIL_HOST;
  const port = Number(process.env.EMAIL_PORT || 587);
  const secure = process.env.EMAIL_SECURE === "true";
  const user = process.env.EMAIL_USER;
  const pass = process.env.EMAIL_PASS;
  const from = process.env.EMAIL_FROM;

  if (!host || !user || !pass || !from) {
    return null;
  }

  return {
    host,
    port,
    secure,
    user,
    pass,
    from,
  };
};

export const sendPasswordResetEmail = async (to: string, token: string) => {
  const config = getEmailConfig();
  if (!config) {
    throw new Error("Email provider is not configured.");
  }

  const appUrl = process.env.APP_URL || "http://localhost:3000";
  const resetUrl = `${appUrl}/reset-password?token=${token}`;

  const transporter = nodemailer.createTransport({
    host: config.host,
    port: config.port,
    secure: config.secure,
    auth: {
      user: config.user,
      pass: config.pass,
    },
  });

  await transporter.sendMail({
    from: config.from,
    to,
    subject: "Reset your password",
    text: `Reset your password using this link: ${resetUrl}`,
    html: `
      <p>You requested a password reset.</p>
      <p><a href="${resetUrl}">Reset your password</a></p>
      <p>If you did not request this, you can ignore this email.</p>
    `,
  });
};

export const sendVerificationEmail = async (to: string, token: string) => {
  const config = getEmailConfig();
  if (!config) {
    throw new Error("Email provider is not configured.");
  }

  const appUrl = process.env.APP_URL || "http://localhost:3000";
  const verifyUrl = `${appUrl}/verify-email?token=${token}`;

  const transporter = nodemailer.createTransport({
    host: config.host,
    port: config.port,
    secure: config.secure,
    auth: {
      user: config.user,
      pass: config.pass,
    },
  });

  await transporter.sendMail({
    from: config.from,
    to,
    subject: "Verify your email",
    text: `Verify your email using this link: ${verifyUrl}`,
    html: `
      <p>Thanks for creating an account.</p>
      <p><a href="${verifyUrl}">Verify your email</a></p>
      <p>If you did not request this, you can ignore this email.</p>
    `,
  });
};
