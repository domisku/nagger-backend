import { createTransport } from "nodemailer";
import { config } from "../config/config";

export class EmailService {
  private static readonly transport = createTransport({
    service: "gmail",
    auth: {
      user: `${config.SMTP_EMAIL}`,
      pass: `${config.SMTP_PASSWORD}`,
    },
  });

  static async sendMail(to: string, text: string, html?: string) {
    return await EmailService.transport.sendMail({
      from: `${config.SMTP_EMAIL}`,
      to,
      subject: "Notification",
      text,
      html,
    });
  }
}
