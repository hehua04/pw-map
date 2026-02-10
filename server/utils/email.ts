import nodemailer from "nodemailer";

const requireEnv = (key: string) => {
  const value = process.env[key];
  if (!value) {
    throw new Error(`Missing ${key} environment variable`);
  }
  return value;
};

const smtpHost = () => requireEnv("SMTP_HOST");
const smtpPort = () => Number(process.env.SMTP_PORT ?? "587");
const smtpUser = () => requireEnv("SMTP_USER");
const smtpPass = () => requireEnv("SMTP_PASS");
const smtpFrom = () => requireEnv("SMTP_FROM");
const baseUrl = () => process.env.APP_BASE_URL ?? "https://maps.postal.wiki";

const getTransport = () =>
  nodemailer.createTransport({
    host: smtpHost(),
    port: smtpPort(),
    secure:
      process.env.SMTP_SECURE === "true" ||
      Number(process.env.SMTP_PORT) === 465,
    auth: {
      user: smtpUser(),
      pass: smtpPass(),
    },
  });

export const sendVerificationEmail = async ({
  to,
  token,
  name,
}: {
  to: string;
  token: string;
  name: string;
}) => {
  const url = new URL("/api/verify", baseUrl());
  url.searchParams.set("token", token);

  const transporter = getTransport();
  await transporter.sendMail({
    from: smtpFrom(),
    to,
    subject: "Verify your Postal Wiki submission",
    text: `Hi there,\n\nVerify your submission by clicking this link:\n${url.toString()}\n\nIf you did not request this, you can ignore this email.`,
    html: `<p>Hi ${name},</p><p>Verify your submission by clicking this link:</p><p><a href="${url.toString()}">Verify your email</a></p><p>If you did not request this, you can ignore this email.</p>`,
  });
};
