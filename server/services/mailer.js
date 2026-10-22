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

// TODO(audit COR-02): replace this invalid default with a required options
// object and a regression test in fix/server-p1.
// eslint-disable-next-line no-undef
export const mailer = async (options = { to, subject, html }) => {
  await transporter.sendMail({ from: process.env.AUTH_USER, ...options });
};
