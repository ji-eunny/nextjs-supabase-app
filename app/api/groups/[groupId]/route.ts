import { NextRequest, NextResponse } from "next/server";
import { getGroupById, updateGroup, deleteGroup } from "@/lib/supabase-store";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ groupId: string }> }
) {
  try {
    const { groupId: id } = await params;
    const group = await getGroupById(id);

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

    const updatedGroup = await updateGroup(id, {
      name: name || undefined,
      description: description || undefined,
      max_members: max_members ? parseInt(max_members) : undefined,
    });

    if (updatedGroup) {
      return NextResponse.json({ group: updatedGroup });
    }

    return NextResponse.json(
      { error: "모임을 찾을 수 없습니다" },
      { status: 404 }
    );
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
    const success = await deleteGroup(id);

    if (success) {
      return NextResponse.json({ message: "모임이 삭제되었습니다" });
    }

    return NextResponse.json(
      { error: "모임을 찾을 수 없습니다" },
      { status: 404 }
    );
  } catch (error) {
    console.error("모임 삭제 오류:", error);
    return NextResponse.json(
      { error: "모임을 삭제할 수 없습니다" },
      { status: 500 }
    );
  }
}
