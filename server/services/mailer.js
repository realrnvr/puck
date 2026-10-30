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

export const mailer = async (options = { to, subject, html }) => {
  await transporter.sendMail({ from: process.env.AUTH_USER, ...options });
};
