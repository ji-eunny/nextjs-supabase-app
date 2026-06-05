import { NextRequest, NextResponse } from "next/server";
import {
  getEventsByGroupId,
  getAllEvents,
  addEvent,
} from "@/lib/event-store";

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const groupId = searchParams.get("groupId");

    let allEvents;

    if (groupId) {
      allEvents = getEventsByGroupId(groupId);
    } else {
      allEvents = getAllEvents();
    }

    return NextResponse.json({ events: allEvents });
  } catch (error) {
    console.error("이벤트 조회 오류:", error);
    return NextResponse.json(
      { error: "이벤트를 조회할 수 없습니다" },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const {
      group_id,
      title,
      description,
      date,
      time,
      location,
      max_participants,
      fee,
      carpool_enabled,
    } = body;

    if (!group_id || !title || !description || !date || !time || !location || !max_participants) {
      return NextResponse.json(
        { error: "필수 필드가 누락되었습니다" },
        { status: 400 }
      );
    }

    const newEvent = addEvent({
      id: `event-${Date.now()}`,
      group_id,
      title,
      description,
      date,
      time,
      location,
      max_participants,
      participant_count: 0,
      waiting_count: 0,
      fee: fee || 0,
      carpool_enabled: carpool_enabled || false,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    });

    return NextResponse.json({ event: newEvent }, { status: 201 });
  } catch (error) {
    console.error("이벤트 생성 오류:", error);
    return NextResponse.json(
      { error: "이벤트를 생성할 수 없습니다" },
      { status: 500 }
    );
  }
}
