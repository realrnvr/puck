import nodemailer from "nodemailer";
import dotenv from "dotenv";
dotenv.config();

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.AUTH_USER,
    pass: process.env.AUTH_PASS,
  },
});

export const mailer = async (options = {}) => {
  const { to, subject, html } = options ?? {};

  if (!to || !subject || !html) {
    throw new Error("Mailer requires to, subject, and html.");
  }

  await transporter.sendMail({ ...options, from: process.env.AUTH_USER });
};
