import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export const mailTemplate = ({ username, redirect, template }) => {
  const templatePath = path.join(
    __dirname,
    "..",
    "template",
    `${template}.html`
  );
  let htmlContent = fs.readFileSync(templatePath, "utf-8");

  htmlContent = htmlContent.replace("{{username}}", username);
  htmlContent = htmlContent.replace("{{verificationLink}}", redirect);

  return htmlContent;
};
