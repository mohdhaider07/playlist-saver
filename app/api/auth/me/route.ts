import { NextRequest, NextResponse } from "next/server";
import { getUsersCollection } from "@/lib/db";
import { getAuthUser } from "@/lib/auth-helpers";
import { clearAuthCookie } from "@/lib/auth";
import { ObjectId } from "mongodb";

export async function GET(request: NextRequest) {
  try {
    const authUser = getAuthUser(request);
    if (!authUser) {
      const response = NextResponse.json(
        { error: "Not authenticated" },
        { status: 401 },
      );
      clearAuthCookie(response);
      return response;
    }

    const users = await getUsersCollection();
    const user = await users.findOne({ _id: new ObjectId(authUser.id) });

    if (!user) {
      const response = NextResponse.json(
        { error: "User not found" },
        { status: 404 },
      );
      clearAuthCookie(response);
      return response;
    }

    return NextResponse.json({
      user: {
        id: user._id.toString(),
        email: user.email,
        name: user.name,
        createdAt: user.createdAt,
      },
    });
  } catch (error) {
    console.error("[GET /api/auth/me]", error);
    return NextResponse.json(
      { error: "An unexpected error occurred." },
      { status: 500 },
    );
  }
}
