import { NextRequest, NextResponse } from "next/server";
import { getAllUsers, createUser } from "@/lib/supabase-store-adapter";

export async function GET() {
  try {
    const users = await getAllUsers();
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

    const user = await createUser({ id, name, email, phone, bio });

    if (!user) {
      return NextResponse.json(
        { error: "사용자를 생성할 수 없습니다" },
        { status: 500 }
      );
    }

    return NextResponse.json({ user }, { status: 201 });
  } catch (error) {
    console.error("사용자 생성 오류:", error);
    return NextResponse.json(
      { error: "사용자를 생성할 수 없습니다" },
      { status: 500 }
    );
  }
}
