import { NextRequest, NextResponse } from "next/server";
import { getUsersCollection } from "@/lib/db";
import { generateOtp } from "@/lib/auth";
import { sendEmail } from "@/lib/Email-service";

export async function POST(request: NextRequest) {
  try {
    const { email } = await request.json();

    if (!email) {
      return NextResponse.json(
        { error: "Email is required" },
        { status: 400 }
      );
    }

    const emailLower = email.toLowerCase().trim();
    const users = await getUsersCollection();
    const user = await users.findOne({ email: emailLower });

    if (!user) {
      return NextResponse.json(
        { error: "No account found with this email address." },
        { status: 404 }
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
      }
    );

    try {
      await sendEmail({
        to: emailLower,
        subject: "Playzen Password Reset OTP",
        text: `This email is safe for resetting the password. Your Playzen password reset verification code is: ${otpCode}. It is valid for 10 minutes.`,
        html: `
          <div style="font-family: sans-serif; padding: 20px; color: #333;">
            <p>This email is safe for resetting the password. Your Playzen password reset OTP code is: <strong>${otpCode}</strong></p>
            <p>This code is valid for 10 minutes.</p>
          </div>
        `,
      });
    } catch (emailError) {
      console.error("[FORGOT_PASSWORD_EMAIL_ERROR]", emailError);
      return NextResponse.json(
        { error: "Failed to send reset email. Please try again later." },
        { status: 500 }
      );
    }

    return NextResponse.json(
      { message: "Password reset OTP sent to your email address." },
      { status: 200 }
    );
  } catch (error) {
    console.error("[POST /api/auth/forgot-password]", error);
    return NextResponse.json(
      { error: "An unexpected error occurred. Please try again." },
      { status: 500 }
    );
  }
}
