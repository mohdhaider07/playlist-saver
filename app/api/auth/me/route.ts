import { NextRequest, NextResponse } from "next/server";
import { getUsersCollection } from "@/lib/db";
import { getAuthUser } from "@/lib/auth-helpers";
import { ObjectId } from "mongodb";

export async function GET(request: NextRequest) {
  try {
    const authUser = getAuthUser(request);
    if (!authUser) {
      return NextResponse.json(
        { error: "Not authenticated" },
        { status: 401 }
      );
    }

    const users = await getUsersCollection();
    const user = await users.findOne({ _id: new ObjectId(authUser.id) });

    if (!user) {
      return NextResponse.json(
        { error: "User not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({
      user: {
        id: user._id.toString(),
        email: user.email,
        createdAt: user.createdAt,
      },
    });
  } catch (error) {
    console.error("[GET /api/auth/me]", error);
    return NextResponse.json(
      { error: "An unexpected error occurred." },
      { status: 500 }
    );
  }
}
