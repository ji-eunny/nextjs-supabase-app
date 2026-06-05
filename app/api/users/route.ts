import { NextRequest, NextResponse } from "next/server";
import { getAllUsers, addUser } from "@/lib/user-store";

export async function GET() {
  try {
    const users = getAllUsers();
    return NextResponse.json({ users });
  } catch (error) {
    console.error("사용자 목록 조회 오류:", error);
    return NextResponse.json(
      { error: "사용자 목록을 조회할 수 없습니다" },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { id, name, email, phone, bio } = body;

    if (!id || !name || !email) {
      return NextResponse.json(
        { error: "필수 필드가 누락되었습니다" },
        { status: 400 }
      );
    }

    const user = addUser({
      id,
      name,
      email,
      phone: phone || undefined,
      bio: bio || undefined,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    });

    return NextResponse.json({ user }, { status: 201 });
  } catch (error) {
    console.error("사용자 생성 오류:", error);
    return NextResponse.json(
      { error: "사용자를 생성할 수 없습니다" },
      { status: 500 }
    );
  }
}
