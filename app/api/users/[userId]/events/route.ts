import { NextRequest, NextResponse } from "next/server";
import { getAllEvents } from "@/lib/supabase-store-adapter";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ userId: string }> }
) {
  try {
    const { userId } = await params;

    // 모든 이벤트 조회 (현재는 참가자 테이블이 없으므로 모든 이벤트 반환)
    // 향후 participants 테이블 추가 시 userId로 필터링
    const events = await getAllEvents();

    return NextResponse.json({ events });
  } catch (error) {
    console.error("사용자 이벤트 조회 오류:", error);
    return NextResponse.json(
      { error: "이벤트를 조회할 수 없습니다" },
      { status: 500 }
    );
  }
}
