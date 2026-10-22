import nodemailer, { type SendMailOptions } from "nodemailer";
import dotenv from "dotenv";
dotenv.config();

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.AUTH_USER as string,
    pass: process.env.AUTH_PASS as string,
  },
});

export const mailer = async (options: SendMailOptions = {}): Promise<void> => {
  const { to, subject, html } = options;

  if (!to || !subject || !html) {
    throw new Error("Mailer requires to, subject, and html.");
  }

  await transporter.sendMail({ ...options, from: process.env.AUTH_USER });
};
