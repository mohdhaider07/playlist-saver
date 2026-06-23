import { NextRequest, NextResponse } from "next/server";
import { getUsersCollection } from "@/lib/db";
import { generateOtp } from "@/lib/auth";
import { sendResendOtpEmail } from "@/lib/email-service";

export async function POST(request: NextRequest) {
  try {
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

    await sendResendOtpEmail({
      emailLower,
      otpCode,
      lng: "en",
    });

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
