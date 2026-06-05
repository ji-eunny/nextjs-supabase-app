import { NextRequest, NextResponse } from "next/server";
import { getUserById, updateUser, deleteUser } from "@/lib/supabase-store-adapter";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ userId: string }> }
) {
  try {
    const { userId } = await params;
    const user = await getUserById(userId);

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

    const updatedUser = await updateUser(userId, {
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

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ userId: string }> }
) {
  try {
    const { userId } = await params;
    const success = await deleteUser(userId);

    if (success) {
      return NextResponse.json({ message: "사용자가 삭제되었습니다" });
    }

    return NextResponse.json(
      { error: "사용자를 삭제할 수 없습니다" },
      { status: 500 }
    );
  } catch (error) {
    console.error("사용자 삭제 오류:", error);
    return NextResponse.json(
      { error: "사용자를 삭제할 수 없습니다" },
      { status: 500 }
    );
  }
}
