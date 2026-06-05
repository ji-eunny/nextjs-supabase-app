import { NextRequest, NextResponse } from "next/server";
import { getAllGroups, createGroup } from "@/lib/supabase-store";

export async function GET() {
  try {
    const groups = await getAllGroups();
    return NextResponse.json({ groups });
  } catch (error) {
    console.error("모임 목록 조회 오류:", error);
    return NextResponse.json(
      { error: "모임 목록을 조회할 수 없습니다" },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { name, description, max_members } = body;

    if (!name || !description || !max_members) {
      return NextResponse.json(
        { error: "필수 필드가 누락되었습니다" },
        { status: 400 }
      );
    }

    const newGroup = await createGroup({
      id: `group-${Date.now()}`,
      name,
      description,
      max_members: parseInt(max_members),
      owner_id: "dummy-user-id",
    });

    if (!newGroup) {
      return NextResponse.json(
        { error: "모임을 생성할 수 없습니다" },
        { status: 500 }
      );
    }

    return NextResponse.json({ group: newGroup }, { status: 201 });
  } catch (error) {
    console.error("모임 생성 오류:", error);
    return NextResponse.json(
      { error: "모임을 생성할 수 없습니다" },
      { status: 500 }
    );
  }
}
