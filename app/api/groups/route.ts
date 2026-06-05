import { NextRequest, NextResponse } from "next/server";
import { getAllGroups, addGroup } from "@/lib/group-store";

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const customGroupsParam = searchParams.get("customGroups");

    let groups = getAllGroups();

    // 클라이언트에서 보낸 localStorage 데이터도 포함
    if (customGroupsParam) {
      try {
        const customGroups = JSON.parse(decodeURIComponent(customGroupsParam));
        // 중복 제거 (ID가 같은 것은 파일에 있는 것 사용)
        const groupIds = new Set(groups.map(g => g.id));
        customGroups.forEach((g: any) => {
          if (!groupIds.has(g.id)) {
            groups.push(g);
          }
        });
      } catch (e) {
        console.error("커스텀 그룹 파싱 오류:", e);
      }
    }

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

    const newGroup = {
      id: `group-${Date.now()}`,
      name,
      description,
      max_members: parseInt(max_members),
      owner_id: "dummy-user-id",
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };

    addGroup(newGroup);
    return NextResponse.json({ group: newGroup }, { status: 201 });
  } catch (error) {
    console.error("모임 생성 오류:", error);
    return NextResponse.json(
      { error: "모임을 생성할 수 없습니다" },
      { status: 500 }
    );
  }
}
