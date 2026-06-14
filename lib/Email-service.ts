import nodemailer from "nodemailer";

interface EmailOptions {
  to: string;
  subject: string;
  text?: string;
  html?: string;
  attachments?: { filename: string; content: Buffer }[];
}

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
  const mailOptions = {
    from: "Playzen<mohdhaider.altide@gmail.com>",
    to: options.to,
    subject: options.subject,
    text: options.text,
    html: options.html,
    attachments: options.attachments,
  };

  try {
    const res = await transporter.sendMail(mailOptions);
  } catch (error) {
    console.error("Email sending failed for", options.to, ":", error);
    throw error;
  }
};
