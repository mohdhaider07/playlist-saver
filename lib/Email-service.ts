import nodemailer from "nodemailer";

interface EmailOptions {
  to: string | string[];
  subject: string;
  text?: string;
  html?: string;
  attachments?: { filename: string; content: Buffer }[];
}

console.log("Email Service Init - EMAIL_USER exists:", process.env.EMAIL_USER);
console.log(
  "Email Service Init - EMAIL_PASSWORD exists:",
  process.env.EMAIL_PASSWORD,
);

const transporter = nodemailer.createTransport({
  service: "gmail",
  host: "smtp.gmail.com",
  port: 587,
  secure: false,
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASSWORD,
  },
});

export const sendEmail = async (options: EmailOptions): Promise<void> => {
  const recipients = Array.isArray(options.to) ? options.to : [options.to];

  for (const recipient of recipients) {
    const mailOptions = {
      from: "Playzen<mohdhaider.altide@gmail.com>",
      to: recipient,
      subject: options.subject,
      text: options.text,
      html: options.html,
      attachments: options.attachments,
    };

    try {
      await transporter.sendMail(mailOptions);
    } catch (error) {
      console.error("Email sending failed for", recipient, ":", error);
      throw error;
    }
  }
};
