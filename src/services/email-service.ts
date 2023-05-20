import { createTransport } from "nodemailer";

export class EmailService {
  private static readonly transport = createTransport({
    service: "gmail",
    auth: {
      user: `${process.env.SMTP_EMAIL}`,
      pass: `${process.env.SMTP_PASSWORD}`,
    },
  });

  static async sendMail(to: string, text: string, html?: string) {
    return await EmailService.transport.sendMail({
      from: `${process.env.SMTP_EMAIL}`,
      to,
      subject: "Notification",
      text,
      html,
    });
  }
}
