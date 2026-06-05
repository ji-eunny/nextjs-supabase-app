import fs from "fs";
import path from "path";
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

const EVENTS_FILE = path.join(process.cwd(), ".data", "events.json");

function ensureDir() {
  const dir = path.dirname(EVENTS_FILE);
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }
}

function loadEvents(): Event[] {
  try {
    ensureDir();
    if (fs.existsSync(EVENTS_FILE)) {
      const data = fs.readFileSync(EVENTS_FILE, "utf-8");
      return JSON.parse(data);
    }
  } catch (error) {
    console.error("이벤트 파일 로드 오류:", error);
  }
  // 초기값으로 더미 데이터 사용
  return [...dummyEvents];
}

function saveEvents(events: Event[]) {
  try {
    ensureDir();
    fs.writeFileSync(EVENTS_FILE, JSON.stringify(events, null, 2), "utf-8");
  } catch (error) {
    console.error("이벤트 파일 저장 오류:", error);
  }
}

let events: Event[] = loadEvents();

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
  saveEvents(events);
  return event;
}

export function updateEvent(eventId: string, updates: Partial<Event>) {
  const event = events.find((e) => e.id === eventId);
  if (event) {
    Object.assign(event, updates);
    saveEvents(events);
    return event;
  }
  return null;
}

export function deleteEvent(eventId: string) {
  const index = events.findIndex((e) => e.id === eventId);
  if (index !== -1) {
    events.splice(index, 1);
    saveEvents(events);
    return true;
  }
  return false;
}
