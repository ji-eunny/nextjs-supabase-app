import { NextRequest, NextResponse } from "next/server";
import { dummyEvents } from "@/lib/dummy-data";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ eventId: string }> }
) {
  try {
    const { eventId } = await params;
    const event = dummyEvents.find((e) => e.id === eventId);

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

    const event = dummyEvents.find((e) => e.id === eventId);

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

    return NextResponse.json({ message: "이벤트가 삭제되었습니다" });
  } catch (error) {
    console.error("이벤트 삭제 오류:", error);
    return NextResponse.json(
      { error: "이벤트를 삭제할 수 없습니다" },
      { status: 500 }
    );
  }
}
