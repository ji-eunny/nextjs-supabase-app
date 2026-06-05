import { NextRequest, NextResponse } from "next/server";
import { getUserById, updateUser } from "@/lib/user-store";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ userId: string }> }
) {
  try {
    const { userId } = await params;
    const user = getUserById(userId);

    if (user) {
      return NextResponse.json({ user });
    }

    return NextResponse.json(
      { error: "사용자를 찾을 수 없습니다" },
      { status: 404 }
    );
  } catch (error) {
    console.error("사용자 조회 오류:", error);
    return NextResponse.json(
      { error: "사용자를 조회할 수 없습니다" },
      { status: 500 }
    );
  }
}

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ userId: string }> }
) {
  try {
    const { userId } = await params;
    const body = await request.json();
    const { name, phone, bio } = body;

    const updatedUser = updateUser(userId, {
      name: name || undefined,
      phone: phone || undefined,
      bio: bio || undefined,
    });

    if (updatedUser) {
      return NextResponse.json({ user: updatedUser });
    }

    return NextResponse.json(
      { error: "사용자를 찾을 수 없습니다" },
      { status: 404 }
    );
  } catch (error) {
    console.error("사용자 수정 오류:", error);
    return NextResponse.json(
      { error: "사용자를 수정할 수 없습니다" },
      { status: 500 }
    );
  }
}
