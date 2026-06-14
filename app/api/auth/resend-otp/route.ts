import { NextRequest, NextResponse } from "next/server";
import { getUsersCollection } from "@/lib/db";
import { generateOtp } from "@/lib/auth";
import { sendEmail } from "@/lib/Email-service";
import {
  getLocaleDirection,
  getPreferredLocale,
  localeCookieName,
} from "@/lib/i18n/config";
import { getDictionary } from "@/lib/i18n/dictionaries";

export async function POST(request: NextRequest) {
  try {
    const locale = getPreferredLocale(
      request.headers.get("accept-language"),
      request.cookies.get(localeCookieName)?.value,
    );
    const direction = getLocaleDirection(locale);
    const emailCopy = getDictionary(locale).email;
    const { email } = await request.json();

    if (!email) {
      return NextResponse.json({ error: "Email is required" }, { status: 400 });
    }

    const emailLower = email.toLowerCase().trim();
    const users = await getUsersCollection();
    const user = await users.findOne({ email: emailLower });

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    if (user.isEmailVerified) {
      return NextResponse.json(
        { error: "Email already verified" },
        { status: 409 },
      );
    }

    const otpCode = generateOtp();
    const otpExpiresAt = new Date(Date.now() + 10 * 60 * 1000); // 10 minutes

    await users.updateOne(
      { _id: user._id },
      {
        $set: {
          otpCode,
          otpExpiresAt,
          updatedAt: new Date(),
        },
      },
    );

    sendEmail({
      to: emailLower,
      subject: emailCopy.verifySubject,
      text: emailCopy.resendText.replace("{otp}", otpCode),
      html: `
          <div dir="${direction}" style="font-family: sans-serif; padding: 20px; color: #333; text-align: ${direction === "rtl" ? "right" : "left"};">
            <p>${emailCopy.resendIntro} <strong>${otpCode}</strong></p>
            <p>${emailCopy.validFor}</p>
          </div>
        `,
    });

    console.log("e3");

    return NextResponse.json(
      { message: "Verification code resent successfully." },
      { status: 200 },
    );
  } catch (error) {
    console.error("[POST /api/auth/resend-otp]", error);
    return NextResponse.json(
      { error: "An unexpected error occurred. Please try again." },
      { status: 500 },
    );
  }
}
