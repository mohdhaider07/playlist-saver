import { NextRequest, NextResponse } from "next/server";
import { getUsersCollection } from "@/lib/db";
import { hashPassword, generateOtp } from "@/lib/auth";
import { registerSchema } from "@/lib/validation";
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
    const body = await request.json();
    const result = registerSchema.safeParse(body);
    if (!result.success) {
      return NextResponse.json(
        { error: result.error.issues[0].message },
        { status: 400 },
      );
    }
    const { name, email, password } = result.data;

    const emailLower = email.toLowerCase().trim();

    const users = await getUsersCollection();
    const existing = await users.findOne({ email: emailLower });
    if (existing) {
      return NextResponse.json(
        { error: "Email already registered" },
        { status: 409 },
      );
    }

    const passwordHash = await hashPassword(password);
    const otpCode = generateOtp();
    const otpExpiresAt = new Date(Date.now() + 10 * 60 * 1000); // 10 minutes

    await users.insertOne({
      name,
      email: emailLower,
      passwordHash,
      isEmailVerified: false,
      otpCode,
      otpExpiresAt,
      createdAt: new Date(),
      updatedAt: new Date(),
    });

    await sendEmail({
      to: emailLower,
      subject: emailCopy.verifySubject,
      text: emailCopy.verifyText.replace("{otp}", otpCode),
      html: `
          <div dir="${direction}" style="font-family: sans-serif; padding: 20px; color: #333; text-align: ${direction === "rtl" ? "right" : "left"};">
            <p>${emailCopy.verifyIntro} <strong>${otpCode}</strong></p>
            <p>${emailCopy.validFor}</p>
          </div>
        `,
    });

    return NextResponse.json(
      { message: "OTP sent to your email address. Please check your inbox." },
      { status: 201 },
    );
  } catch (error) {
    console.error("[POST /api/auth/register]", error);
    return NextResponse.json(
      { error: "An unexpected error occurred. Please try again." },
      { status: 500 },
    );
  }
}
