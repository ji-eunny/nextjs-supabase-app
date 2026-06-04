import { NextRequest, NextResponse } from "next/server";
import {
  getEventsByGroupId,
  getAllEvents,
  addEvent,
} from "@/lib/event-store";

interface Event {
  id: string;
  group_id: string;
  title: string;
  description: string;
  date: string;
  time: string;
  location: string;
  max_participants: number;
  participant_count: number;
  waiting_count: number;
  fee: number;
  carpool_enabled: boolean;
  created_at?: string;
  updated_at?: string;
}

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const groupId = searchParams.get("groupId");

    // 저장소의 이벤트만 사용
    let allEvents = getAllEvents();

    if (groupId) {
      allEvents = allEvents.filter((e) => e.group_id === groupId);
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

    const newEvent: Event = {
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
    };

    addEvent(newEvent);
    return NextResponse.json({ event: newEvent }, { status: 201 });
  } catch (error) {
    console.error("이벤트 생성 오류:", error);
    return NextResponse.json(
      { error: "이벤트를 생성할 수 없습니다" },
      { status: 500 }
    );
  }
}
