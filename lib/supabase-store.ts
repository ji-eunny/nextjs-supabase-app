// Supabase 기반 저장소 구현
// 파일 저장소에서 마이그레이션 완료

import { createClient } from "@/lib/supabase/server";

// 타입 정의
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
  participant_count?: number;
  waiting_count?: number;
  fee?: number;
  carpool_enabled?: boolean;
  created_at: string;
  updated_at: string;
}

export interface Participant {
  id: string;
  event_id: string;
  user_id: string;
  status: string;
  fee_paid?: boolean;
  created_at: string;
  updated_at: string;
}

// 사용자 함수
export async function getAllUsers(): Promise<User[]> {
  try {
    const supabase = await createClient();
    const { data, error } = await supabase
      .from("users")
      .select("*")
      .order("created_at", { ascending: false });

    if (error) {
      console.error("사용자 조회 오류:", error);
      return [];
    }

    return data || [];
  } catch (error) {
    console.error("사용자 조회 실패:", error);
    return [];
  }
}

export async function getUserById(userId: string): Promise<User | null> {
  try {
    const supabase = await createClient();
    const { data, error } = await supabase
      .from("users")
      .select("*")
      .eq("id", userId)
      .single();

    if (error) {
      console.error("사용자 조회 오류:", error);
      return null;
    }

    return data;
  } catch (error) {
    console.error("사용자 조회 실패:", error);
    return null;
  }
}

export async function getUserByEmail(email: string): Promise<User | null> {
  try {
    const supabase = await createClient();
    const { data, error } = await supabase
      .from("users")
      .select("*")
      .eq("email", email)
      .single();

    if (error) {
      console.error("사용자 조회 오류:", error);
      return null;
    }

    return data;
  } catch (error) {
    console.error("사용자 조회 실패:", error);
    return null;
  }
}

export async function createUser(user: Omit<User, "created_at" | "updated_at">): Promise<User | null> {
  try {
    const supabase = await createClient();
    const now = new Date().toISOString();

    const { data, error } = await supabase
      .from("users")
      .insert({
        ...user,
        created_at: now,
        updated_at: now,
      })
      .select()
      .single();

    if (error) {
      console.error("사용자 생성 오류:", error);
      return null;
    }

    return data;
  } catch (error) {
    console.error("사용자 생성 실패:", error);
    return null;
  }
}

export async function updateUser(
  userId: string,
  updates: Partial<Omit<User, "id" | "created_at" | "updated_at">>
): Promise<User | null> {
  try {
    const supabase = await createClient();
    const now = new Date().toISOString();

    const { data, error } = await supabase
      .from("users")
      .update({
        ...updates,
        updated_at: now,
      })
      .eq("id", userId)
      .select()
      .single();

    if (error) {
      console.error("사용자 수정 오류:", error);
      return null;
    }

    return data;
  } catch (error) {
    console.error("사용자 수정 실패:", error);
    return null;
  }
}

export async function deleteUser(userId: string): Promise<boolean> {
  try {
    const supabase = await createClient();
    const { error } = await supabase
      .from("users")
      .delete()
      .eq("id", userId);

    if (error) {
      console.error("사용자 삭제 오류:", error);
      return false;
    }

    return true;
  } catch (error) {
    console.error("사용자 삭제 실패:", error);
    return false;
  }
}

// 모임 함수
export async function getAllGroups(): Promise<Group[]> {
  try {
    const supabase = await createClient();
    const { data, error } = await supabase
      .from("groups")
      .select("*")
      .order("created_at", { ascending: false });

    if (error) {
      console.error("모임 조회 오류:", error);
      return [];
    }

    return data || [];
  } catch (error) {
    console.error("모임 조회 실패:", error);
    return [];
  }
}

export async function getGroupById(groupId: string): Promise<Group | null> {
  try {
    const supabase = await createClient();
    const { data, error } = await supabase
      .from("groups")
      .select("*")
      .eq("id", groupId)
      .single();

    if (error) {
      console.error("모임 조회 오류:", error);
      return null;
    }

    return data;
  } catch (error) {
    console.error("모임 조회 실패:", error);
    return null;
  }
}

export async function createGroup(
  group: Omit<Group, "created_at" | "updated_at" | "member_count">
): Promise<Group | null> {
  try {
    const supabase = await createClient();
    const now = new Date().toISOString();

    const { data, error } = await supabase
      .from("groups")
      .insert({
        ...group,
        member_count: 1,
        created_at: now,
        updated_at: now,
      })
      .select()
      .single();

    if (error) {
      console.error("모임 생성 오류:", error);
      return null;
    }

    return data;
  } catch (error) {
    console.error("모임 생성 실패:", error);
    return null;
  }
}

export async function updateGroup(
  groupId: string,
  updates: Partial<Omit<Group, "id" | "created_at" | "updated_at">>
): Promise<Group | null> {
  try {
    const supabase = await createClient();
    const now = new Date().toISOString();

    const { data, error } = await supabase
      .from("groups")
      .update({
        ...updates,
        updated_at: now,
      })
      .eq("id", groupId)
      .select()
      .single();

    if (error) {
      console.error("모임 수정 오류:", error);
      return null;
    }

    return data;
  } catch (error) {
    console.error("모임 수정 실패:", error);
    return null;
  }
}

export async function deleteGroup(groupId: string): Promise<boolean> {
  try {
    const supabase = await createClient();
    const { error } = await supabase
      .from("groups")
      .delete()
      .eq("id", groupId);

    if (error) {
      console.error("모임 삭제 오류:", error);
      return false;
    }

    return true;
  } catch (error) {
    console.error("모임 삭제 실패:", error);
    return false;
  }
}

// 이벤트 함수
export async function getAllEvents(): Promise<Event[]> {
  try {
    const supabase = await createClient();
    const { data, error } = await supabase
      .from("events")
      .select("*")
      .order("date", { ascending: true });

    if (error) {
      console.error("이벤트 조회 오류:", error);
      return [];
    }

    return data || [];
  } catch (error) {
    console.error("이벤트 조회 실패:", error);
    return [];
  }
}

export async function getEventById(eventId: string): Promise<Event | null> {
  try {
    const supabase = await createClient();
    const { data, error } = await supabase
      .from("events")
      .select("*")
      .eq("id", eventId)
      .single();

    if (error) {
      console.error("이벤트 조회 오류:", error);
      return null;
    }

    return data;
  } catch (error) {
    console.error("이벤트 조회 실패:", error);
    return null;
  }
}

export async function getEventsByGroupId(groupId: string): Promise<Event[]> {
  try {
    const supabase = await createClient();
    const { data, error } = await supabase
      .from("events")
      .select("*")
      .eq("group_id", groupId)
      .order("date", { ascending: true });

    if (error) {
      console.error("모임 이벤트 조회 오류:", error);
      return [];
    }

    return data || [];
  } catch (error) {
    console.error("모임 이벤트 조회 실패:", error);
    return [];
  }
}

export async function createEvent(
  event: Omit<Event, "created_at" | "updated_at" | "participant_count" | "waiting_count">
): Promise<Event | null> {
  try {
    const supabase = await createClient();
    const now = new Date().toISOString();

    const { data, error } = await supabase
      .from("events")
      .insert({
        ...event,
        participant_count: 0,
        waiting_count: 0,
        created_at: now,
        updated_at: now,
      })
      .select()
      .single();

    if (error) {
      console.error("이벤트 생성 오류:", error);
      return null;
    }

    return data;
  } catch (error) {
    console.error("이벤트 생성 실패:", error);
    return null;
  }
}

export async function updateEvent(
  eventId: string,
  updates: Partial<Omit<Event, "id" | "created_at" | "updated_at">>
): Promise<Event | null> {
  try {
    const supabase = await createClient();
    const now = new Date().toISOString();

    const { data, error } = await supabase
      .from("events")
      .update({
        ...updates,
        updated_at: now,
      })
      .eq("id", eventId)
      .select()
      .single();

    if (error) {
      console.error("이벤트 수정 오류:", error);
      return null;
    }

    return data;
  } catch (error) {
    console.error("이벤트 수정 실패:", error);
    return null;
  }
}

export async function deleteEvent(eventId: string): Promise<boolean> {
  try {
    const supabase = await createClient();
    const { error } = await supabase
      .from("events")
      .delete()
      .eq("id", eventId);

    if (error) {
      console.error("이벤트 삭제 오류:", error);
      return false;
    }

    return true;
  } catch (error) {
    console.error("이벤트 삭제 실패:", error);
    return false;
  }
}

// 참가자 함수
export async function getParticipants(eventId: string): Promise<Participant[]> {
  try {
    const supabase = await createClient();
    const { data, error } = await supabase
      .from("participants")
      .select("*")
      .eq("event_id", eventId)
      .order("created_at", { ascending: false });

    if (error) {
      console.error("참가자 조회 오류:", error);
      return [];
    }

    return data || [];
  } catch (error) {
    console.error("참가자 조회 실패:", error);
    return [];
  }
}

export async function addParticipant(participant: Omit<Participant, "created_at" | "updated_at">): Promise<Participant | null> {
  try {
    const supabase = await createClient();
    const now = new Date().toISOString();

    const { data, error } = await supabase
      .from("participants")
      .insert({
        ...participant,
        created_at: now,
        updated_at: now,
      })
      .select()
      .single();

    if (error) {
      console.error("참가자 추가 오류:", error);
      return null;
    }

    return data;
  } catch (error) {
    console.error("참가자 추가 실패:", error);
    return null;
  }
}

export async function removeParticipant(participantId: string): Promise<boolean> {
  try {
    const supabase = await createClient();
    const { error } = await supabase
      .from("participants")
      .delete()
      .eq("id", participantId);

    if (error) {
      console.error("참가자 제거 오류:", error);
      return false;
    }

    return true;
  } catch (error) {
    console.error("참가자 제거 실패:", error);
    return false;
  }
}

export async function updateParticipant(
  participantId: string,
  updates: Partial<Omit<Participant, "id" | "created_at" | "updated_at">>
): Promise<Participant | null> {
  try {
    const supabase = await createClient();
    const now = new Date().toISOString();

    const { data, error } = await supabase
      .from("participants")
      .update({
        ...updates,
        updated_at: now,
      })
      .eq("id", participantId)
      .select()
      .single();

    if (error) {
      console.error("참가자 수정 오류:", error);
      return null;
    }

    return data;
  } catch (error) {
    console.error("참가자 수정 실패:", error);
    return null;
  }
}
