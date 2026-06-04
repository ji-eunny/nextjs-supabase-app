import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { createGroup, getGroups } from "@/lib/services/groups";
import { dummyGroups } from "@/lib/dummy-data";

export async function GET(request: NextRequest) {
  try {
    // 개발 환경에서는 더미 데이터 반환
    return NextResponse.json({ groups: dummyGroups });
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

    // 개발 환경에서는 더미 그룹 생성
    const newGroup = {
      id: `group-${Date.now()}`,
      name,
      description,
      max_members: parseInt(max_members),
      owner_id: "dummy-user-id",
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };

    return NextResponse.json({ group: newGroup }, { status: 201 });
  } catch (error) {
    console.error("모임 생성 오류:", error);
    return NextResponse.json(
      { error: "모임을 생성할 수 없습니다" },
      { status: 500 }
    );
  }
}
