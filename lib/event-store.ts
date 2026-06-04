// 임시 in-memory 이벤트 저장소
import { dummyEvents } from "./dummy-data";

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

// 더미 데이터를 초기 데이터로 로드
let events: Event[] = [...dummyEvents];

export function getAllEvents() {
  return events;
}

export function getEventsByGroupId(groupId: string) {
  return events.filter((e) => e.group_id === groupId);
}

export function getEventById(eventId: string) {
  return events.find((e) => e.id === eventId);
}

export function addEvent(event: Event) {
  events.push(event);
  return event;
}

export function updateEvent(eventId: string, updates: Partial<Event>) {
  const event = events.find((e) => e.id === eventId);
  if (event) {
    Object.assign(event, updates);
    return event;
  }
  return null;
}

export function deleteEvent(eventId: string) {
  const index = events.findIndex((e) => e.id === eventId);
  if (index !== -1) {
    events.splice(index, 1);
    return true;
  }
  return false;
}
