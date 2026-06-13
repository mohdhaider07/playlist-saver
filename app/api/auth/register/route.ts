import { NextRequest, NextResponse } from "next/server";
import { getUsersCollection } from "@/lib/db";
import { hashPassword, generateOtp } from "@/lib/auth";
import { registerSchema } from "@/lib/validation";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const result = registerSchema.safeParse(body);
    if (!result.success) {
      return NextResponse.json(
        { error: result.error.issues[0].message },
        { status: 400 }
      );
    }
    const { email, password } = result.data;

    const emailLower = email.toLowerCase().trim();

    const users = await getUsersCollection();
    const existing = await users.findOne({ email: emailLower });
    if (existing) {
      return NextResponse.json(
        { error: "Email already registered" },
        { status: 409 }
      );
    }

    const passwordHash = await hashPassword(password);
    const otpCode = generateOtp();
    const otpExpiresAt = new Date(Date.now() + 10 * 60 * 1000); // 10 minutes

    await users.insertOne({
      email: emailLower,
      passwordHash,
      isEmailVerified: false,
      otpCode,
      otpExpiresAt,
      createdAt: new Date(),
      updatedAt: new Date(),
    });

    return NextResponse.json(
      { message: "OTP sent to your email address. Please check your inbox." },
      { status: 201 }
    );
  } catch (error) {
    console.error("[POST /api/auth/register]", error);
    return NextResponse.json(
      { error: "An unexpected error occurred. Please try again." },
      { status: 500 }
    );
  }
}
