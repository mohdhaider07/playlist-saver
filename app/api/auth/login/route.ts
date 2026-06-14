import { NextRequest, NextResponse } from "next/server";
import { getUsersCollection } from "@/lib/db";
import { comparePassword, generateToken } from "@/lib/auth";
import { loginSchema } from "@/lib/validation";

const GUEST_LOGIN_EMAIL = "haiderahmed12786@gmail.com";

type LoginUser = {
  _id: { toString: () => string };
  email: string;
  name?: string;
};

function createLoginResponse(user: LoginUser, message: string) {
  const token = generateToken({
    sub: user._id.toString(),
    email: user.email,
  });

  const response = NextResponse.json(
    {
      token,
      message,
      user: { id: user._id.toString(), email: user.email, name: user.name },
    },
    { status: 200 },
  );

  response.cookies.set("token", token, {
    httpOnly: true,
    secure: true,
    sameSite: "none",
    maxAge: 60 * 60 * 24 * 7, // 7 days
  });

  return response;
}

export async function POST(request: NextRequest) {
  try {
    const body: unknown = await request.json();
    const users = await getUsersCollection();

    if (
      typeof body === "object" &&
      body !== null &&
      "guest" in body &&
      body.guest === true
    ) {
      const guestUser = await users.findOne({ email: GUEST_LOGIN_EMAIL });

      if (!guestUser) {
        return NextResponse.json(
          { error: "Guest user not found" },
          { status: 404 },
        );
      }

      if (!guestUser.isEmailVerified) {
        return NextResponse.json(
          { error: "Guest user email is not verified." },
          { status: 403 },
        );
      }

      return createLoginResponse(
        {
          _id: guestUser._id,
          email: guestUser.email,
          name: guestUser.name,
        },
        "Logged in as guest successfully.",
      );
    }

    const result = loginSchema.safeParse(body);
    if (!result.success) {
      return NextResponse.json(
        { error: result.error.issues[0].message },
        { status: 400 },
      );
    }
    const { email, password } = result.data;

    const emailLower = email.toLowerCase().trim();
    const user = await users.findOne({ email: emailLower });

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    if (!user.isEmailVerified) {
      return NextResponse.json(
        { error: "Please verify your email before logging in." },
        { status: 403 },
      );
    }

    const isMatch = await comparePassword(password, user.passwordHash);
    if (!isMatch) {
      return NextResponse.json(
        { error: "Invalid email or password" },
        { status: 401 },
      );
    }

    return createLoginResponse(
      {
        _id: user._id,
        email: user.email,
        name: user.name,
      },
      "Logged in successfully.",
    );
  } catch (error) {
    console.error("[POST /api/auth/login]", error);
    return NextResponse.json(
      { error: "An unexpected error occurred. Please try again." },
      { status: 500 },
    );
  }
}
