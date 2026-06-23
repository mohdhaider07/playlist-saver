import { Resend } from "resend";

interface EmailOptions {
  to: string;
  subject: string;
  html: string;
  lng: LanguageType;
}

export type LanguageType = "en" | "ar";

const resend = new Resend(process.env.RESEND_API_KEY);

const getEmailTemplate = (html: string, lng: LanguageType) => {
  const direction = lng === "ar" ? "rtl" : "ltr";
  const textAlign = lng === "ar" ? "right" : "left";
  return `
    <div dir="${direction}" style="font-family: sans-serif; padding: 20px; color: #333; text-align: ${textAlign};">
      ${html}
    </div>
  `;
};

export const sendEmail = async (options: EmailOptions): Promise<void> => {
  try {
    const wrappedHtml = getEmailTemplate(options.html, options.lng);
    const { error } = await resend.emails.send({
      from: "MyTaalim <onboarding@mytaalim.xyz>",
      to: [options.to],
      subject: options.subject,
      html: wrappedHtml,
    });

    if (error) {
      console.error("Email sending failed for", options.to, ":", error);
      throw new Error(error.message);
    }
  } catch (error) {
    console.error("Email sending failed for", options.to, ":", error);
    throw error;
  }
};

export const sendVerifyEmailOtp = async ({
  emailLower,
  otpCode,
  lng,
}: {
  emailLower: string;
  otpCode: string;
  lng: LanguageType;
}) => {
  await sendEmail({
    to: emailLower,
    subject: "Verify your email address",
    html: `
        <div>
            <p>Otp verification for your account <strong>${otpCode}</strong></p>
            <p>Otp is valid for 10 minutes</p>
        <div>
        `,
    lng,
  });
};

export const sendForgotPasswordEmailOtp = async ({
  emailLower,
  otpCode,
  lng,
}: {
  emailLower: string;
  otpCode: string;
  lng: LanguageType;
}) => {
  await sendEmail({
    to: emailLower,
    subject: "Reset your password",
    html: `
          <div>
            <p>Password reset code for your account: <strong>${otpCode}</strong></p>
            <p>This code is valid for 10 minutes.</p>
          </div>
        `,
    lng,
  });
};

export const sendResendOtpEmail = async ({
  emailLower,
  otpCode,
  lng,
}: {
  emailLower: string;
  otpCode: string;
  lng: LanguageType;
}) => {
  await sendEmail({
    to: emailLower,
    subject: "Verify your email address",
    html: `
          <div>
            <p>Email verification code for your account: <strong>${otpCode}</strong></p>
            <p>This code is valid for 10 minutes.</p>
          </div>
        `,
    lng,
  });
};
