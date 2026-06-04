import { NextRequest, NextResponse } from "next/server";
import { dummyEvents } from "@/lib/dummy-data";
import {
  getEventById,
  updateEvent,
  deleteEvent,
} from "@/lib/event-store";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ eventId: string }> }
) {
  try {
    const { eventId } = await params;

    // 저장소에서 먼저 찾기
    let event = getEventById(eventId);

    // 저장소에 없으면 더미 데이터에서 찾기
    if (!event) {
      event = dummyEvents.find((e) => e.id === eventId);
    }

    if (event) {
      return NextResponse.json({ event });
    }

    return NextResponse.json(
      { error: "이벤트를 찾을 수 없습니다" },
      { status: 404 }
    );
  } catch (error) {
    console.error("이벤트 조회 오류:", error);
    return NextResponse.json(
      { error: "이벤트를 조회할 수 없습니다" },
      { status: 500 }
    );
  }
}

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ eventId: string }> }
) {
  try {
    const { eventId } = await params;
    const body = await request.json();
    const {
      title,
      description,
      date,
      time,
      location,
      max_participants,
      fee,
      carpool_enabled,
    } = body;

    // 저장소에서 먼저 찾기
    let event = getEventById(eventId);

    // 저장소에 없으면 더미 데이터에서 찾기
    if (!event) {
      event = dummyEvents.find((e) => e.id === eventId);
    }

    if (!event) {
      return NextResponse.json(
        { error: "이벤트를 찾을 수 없습니다" },
        { status: 404 }
      );
    }

    const updatedEvent = {
      ...event,
      title: title || event.title,
      description: description || event.description,
      date: date || event.date,
      time: time || event.time,
      location: location || event.location,
      max_participants: max_participants || event.max_participants,
      fee: fee !== undefined ? fee : event.fee,
      carpool_enabled:
        carpool_enabled !== undefined ? carpool_enabled : event.carpool_enabled,
      updated_at: new Date().toISOString(),
    };

    updateEvent(eventId, updatedEvent);
    return NextResponse.json({ event: updatedEvent });
  } catch (error) {
    console.error("이벤트 수정 오류:", error);
    return NextResponse.json(
      { error: "이벤트를 수정할 수 없습니다" },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ eventId: string }> }
) {
  try {
    const { eventId } = await params;
    deleteEvent(eventId);
    return NextResponse.json({ message: "이벤트가 삭제되었습니다" });
  } catch (error) {
    console.error("이벤트 삭제 오류:", error);
    return NextResponse.json(
      { error: "이벤트를 삭제할 수 없습니다" },
      { status: 500 }
    );
  }
}
