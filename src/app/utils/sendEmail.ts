/* eslint-disable @typescript-eslint/no-explicit-any */
import nodemailer from "nodemailer";
import { envVariables } from "../config/env.config";
import path from "path";
import ejs from "ejs";
interface sendEmailOptions {
  to: string;
  subject: string;
  templateName: string;
  templateData?: Record<string, any>;
  attachments?: {
    filename: string;
    content: Buffer | string;
    contentType: string;
  }[];
}
const transport = nodemailer.createTransport({
  secure: true,
  auth: {
    user: envVariables.SMTP_USER,
    pass: envVariables.SMTP_PASS,
  },
  port: envVariables.SMTP_PORT,
  host: envVariables.SMTP_HOST, // ✅ host should be string
});

export const sendmail = async ({
  to,
  subject,
  templateName,
  templateData,
  attachments,
}: sendEmailOptions) => {
  try {
    const templatePath = path.join(__dirname, `./template/${templateName}.ejs`);
    const templateContent = await ejs.renderFile(
      templatePath,
      templateData || {}
    );

    const info = await transport.sendMail({
      from: envVariables.SMTP_FROM,
      to,
      subject,
      html: templateContent,
      text: templateContent.replace(/<[^>]*>/g, ""), // optional plain text
      attachments: attachments?.map((item) => ({
        filename: item.filename,
        content: item.content,
        contentType: item.contentType,
      })),
    });

    console.log("Email sent. Message ID:", info.messageId);
  } catch (error) {
    console.error("Email send error:", error);
    throw new Error("Failed to send email");
  }
};
