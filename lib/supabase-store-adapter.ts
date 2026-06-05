// Supabase 호환 인터페이스를 제공하는 어댑터
// 현재는 파일 저장소를 사용하며, 향후 Supabase로 마이그레이션 가능

import { getAllUsers as getFileUsers, getUserById as getFileUserById, updateUser as updateFileUser, addUser as addFileUser, getUserByEmail } from "@/lib/user-store";
import { getAllGroups as getFileGroups, getGroupById as getFileGroupById, updateGroup as updateFileGroup, addGroup as addFileGroup, deleteGroup as deleteFileGroup } from "@/lib/group-store";
import { getAllEvents as getFileEvents, getEventById as getFileEventById, updateEvent as updateFileEvent, addEvent as addFileEvent, deleteEvent as deleteFileEvent } from "@/lib/event-store";

// 타입 정의 (user-store와 일치)
export interface User {
  id: string;
  name: string;
  email: string;
  phone?: string;
  bio?: string;
  created_at: string;
  updated_at: string;
}

export interface Group {
  id: string;
  name: string;
  description: string;
  max_members: number;
  owner_id: string;
  member_count?: number;
  next_event_title?: string;
  next_event_at?: string;
  created_at: string;
  updated_at: string;
}

export interface Event {
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
  created_at: string;
  updated_at: string;
}

// 사용자 함수
export async function getAllUsers(): Promise<User[]> {
  return getFileUsers();
}

export async function getUserById(userId: string): Promise<User | null> {
  return getFileUserById(userId) || null;
}

export async function getUserByEmailAsync(email: string): Promise<User | null> {
  return getUserByEmail(email) || null;
}

export async function createUser(user: Omit<User, "created_at" | "updated_at">): Promise<User | null> {
  const newUser: User = {
    ...user,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  };
  return addFileUser(newUser);
}

export async function updateUser(
  userId: string,
  updates: Partial<Omit<User, "id" | "created_at" | "updated_at">>
): Promise<User | null> {
  return updateFileUser(userId, updates) || null;
}

export async function deleteUser(userId: string): Promise<boolean> {
  // 파일 저장소에서는 삭제 함수가 없으므로, 향후 추가
  console.warn("사용자 삭제는 아직 구현되지 않았습니다");
  return false;
}

// 모임 함수
export async function getAllGroups(): Promise<Group[]> {
  return getFileGroups();
}

export async function getGroupById(groupId: string): Promise<Group | null> {
  return getFileGroupById(groupId) || null;
}

export async function createGroup(
  group: Omit<Group, "created_at" | "updated_at">
): Promise<Group | null> {
  const newGroup: Group = {
    ...group,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  };
  return addFileGroup(newGroup);
}

export async function updateGroup(
  groupId: string,
  updates: Partial<Omit<Group, "id" | "created_at" | "updated_at">>
): Promise<Group | null> {
  return updateFileGroup(groupId, updates) || null;
}

export async function deleteGroup(groupId: string): Promise<boolean> {
  return deleteFileGroup(groupId);
}

// 이벤트 함수
export async function getAllEvents(): Promise<Event[]> {
  return getFileEvents();
}

export async function getEventById(eventId: string): Promise<Event | null> {
  return getFileEventById(eventId) || null;
}

export async function getEventsByGroupId(groupId: string): Promise<Event[]> {
  return getFileEvents().filter((e) => e.group_id === groupId);
}

export async function createEvent(
  event: Omit<Event, "created_at" | "updated_at" | "participant_count" | "waiting_count">
): Promise<Event | null> {
  const newEvent: Event = {
    ...event,
    participant_count: 0,
    waiting_count: 0,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  };
  return addFileEvent(newEvent);
}

export async function updateEvent(
  eventId: string,
  updates: Partial<Omit<Event, "id" | "created_at" | "updated_at">>
): Promise<Event | null> {
  const event = getFileEventById(eventId);
  if (!event) return null;

  const updatedEvent = { ...event, ...updates, updated_at: new Date().toISOString() };
  return updateFileEvent(eventId, updatedEvent) || null;
}

export async function deleteEvent(eventId: string): Promise<boolean> {
  return deleteFileEvent(eventId);
}

// 참가자 함수 (향후 구현)
export async function getParticipants(eventId: string) {
  console.warn("참가자 조회는 아직 구현되지 않았습니다");
  return [];
}

export async function addParticipant(participant: any) {
  console.warn("참가자 추가는 아직 구현되지 않았습니다");
  return null;
}

export async function removeParticipant(participantId: string): Promise<boolean> {
  console.warn("참가자 제거는 아직 구현되지 않았습니다");
  return false;
}

export async function updateParticipant(participantId: string, updates: any) {
  console.warn("참가자 수정은 아직 구현되지 않았습니다");
  return null;
}
