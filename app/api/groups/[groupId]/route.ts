import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { getGroupById, updateGroup, deleteGroup } from "@/lib/services/groups";
import { dummyGroups } from "@/lib/dummy-data";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ groupId: string }> }
) {
  try {
    const { groupId: id } = await params;
    const group = dummyGroups.find((g) => g.id === id);

    if (group) {
      return NextResponse.json({ group });
    }

    return NextResponse.json(
      { error: "모임을 찾을 수 없습니다" },
      { status: 404 }
    );
  } catch (error) {
    console.error("모임 조회 오류:", error);
    return NextResponse.json(
      { error: "모임을 조회할 수 없습니다" },
      { status: 500 }
    );
  }
}

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ groupId: string }> }
) {
  try {
    const { groupId: id } = await params;
    const body = await request.json();
    const { name, description, max_members } = body;

    const updatedGroup = {
      id,
      name: name || '',
      description: description || '',
      max_members: max_members ? parseInt(max_members) : 20,
      owner_id: 'user-1',
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };

    return NextResponse.json({ group: updatedGroup });
  } catch (error) {
    console.error("모임 수정 오류:", error);
    return NextResponse.json(
      { error: "모임을 수정할 수 없습니다" },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ groupId: string }> }
) {
  try {
    const { groupId: id } = await params;

    return NextResponse.json({ message: "모임이 삭제되었습니다" });
  } catch (error) {
    console.error("모임 삭제 오류:", error);
    return NextResponse.json(
      { error: "모임을 삭제할 수 없습니다" },
      { status: 500 }
    );
  }
}
