import { NextRequest, NextResponse } from "next/server";
import { getAllEvents } from "@/lib/event-store";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ userId: string }> }
) {
  try {
    const { userId } = await params;
    const searchParams = request.nextUrl.searchParams;
    const customEventsParam = searchParams.get("customEvents");

    // 저장소의 모든 이벤트
    let allEvents = getAllEvents();

    // 클라이언트에서 보낸 localStorage 데이터도 포함
    if (customEventsParam) {
      try {
        const customEvents = JSON.parse(decodeURIComponent(customEventsParam));
        // 중복 제거 (ID가 같은 것은 파일에 있는 것 사용)
        const eventIds = new Set(allEvents.map(e => e.id));
        customEvents.forEach((e: any) => {
          if (!eventIds.has(e.id)) {
            allEvents.push(e);
          }
        });
      } catch (e) {
        console.error("커스텀 이벤트 파싱 오류:", e);
      }
    }

    // 참가한 이벤트 필터링 (현재는 모든 이벤트 반환)
    // 향후 participant 테이블 추가 시 userId로 필터링
    return NextResponse.json({ events: allEvents });
  } catch (error) {
    console.error("사용자 이벤트 조회 오류:", error);
    return NextResponse.json(
      { error: "이벤트를 조회할 수 없습니다" },
      { status: 500 }
    );
  }
}
