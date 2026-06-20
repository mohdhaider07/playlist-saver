import { NextRequest, NextResponse } from "next/server";
import { getUsersCollection } from "@/lib/db";
import { generateToken } from "@/lib/auth";

export async function POST(request: NextRequest) {
  try {
    const { email, otp } = await request.json();

    if (!email || !otp) {
      return NextResponse.json(
        { error: "Email and OTP required" },
        { status: 400 }
      );
    }

    const emailLower = email.toLowerCase().trim();
    const users = await getUsersCollection();
    const user = await users.findOne({ email: emailLower });

    if (!user) {
      return NextResponse.json(
        { error: "User not found" },
        { status: 404 }
      );
    }

    if (user.isEmailVerified) {
      return NextResponse.json(
        { error: "Email already verified" },
        { status: 409 }
      );
    }

    const isValidReal =
      otp === user.otpCode &&
      user.otpExpiresAt &&
      new Date() < user.otpExpiresAt;

    if (!isValidReal) {
      return NextResponse.json(
        { error: "Invalid or expired OTP" },
        { status: 400 }
      );
    }

    await users.updateOne(
      { _id: user._id },
      {
        $set: {
          isEmailVerified: true,
          otpCode: null,
          otpExpiresAt: null,
          updatedAt: new Date(),
        },
      }
    );

    const token = generateToken({
      sub: user._id.toString(),
      email: user.email,
    });

    const response = NextResponse.json(
      { token, message: "Email verified successfully." },
      { status: 200 }
    );

    response.cookies.set("token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      path: "/",
      maxAge: 60 * 60 * 24 * 7, // 7 days
    });

    return response;
  } catch (error) {
    console.error("[POST /api/auth/verify-otp]", error);
    return NextResponse.json(
      { error: "An unexpected error occurred. Please try again." },
      { status: 500 }
    );
  }
}
