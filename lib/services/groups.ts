import { createClient } from "@/lib/supabase/server";

export interface Group {
  id: string;
  name: string;
  description: string;
  max_members: number;
  owner_id: string;
  created_at: string;
  updated_at: string;
}

export interface GroupWithMemberCount extends Group {
  member_count: number;
  next_event_title?: string;
  next_event_at?: string;
}

export async function getGroups(userId: string) {
  const supabase = await createClient();

  const { data: groups, error: groupsError } = await supabase
    .from("groups")
    .select("*, group_members(count)")
    .eq("owner_id", userId);

  if (groupsError) throw groupsError;

  return groups || [];
}

export async function getGroupById(groupId: string) {
  const supabase = await createClient();

  const { data: group, error } = await supabase
    .from("groups")
    .select("*")
    .eq("id", groupId)
    .single();

  if (error) throw error;

  return group;
}

export async function createGroup(
  userId: string,
  data: {
    name: string;
    description: string;
    max_members: number;
  }
) {
  const supabase = await createClient();

  const { data: group, error: createError } = await supabase
    .from("groups")
    .insert({
      name: data.name,
      description: data.description,
      max_members: data.max_members,
      owner_id: userId,
    })
    .select()
    .single();

  if (createError) throw createError;

  // 그룹 생성 후 소유자를 멤버로 추가
  const { error: memberError } = await supabase.from("group_members").insert({
    group_id: group.id,
    user_id: userId,
    role: "owner",
  });

  if (memberError) throw memberError;

  return group;
}

export async function updateGroup(
  groupId: string,
  data: {
    name?: string;
    description?: string;
    max_members?: number;
  }
) {
  const supabase = await createClient();

  const { data: group, error } = await supabase
    .from("groups")
    .update(data)
    .eq("id", groupId)
    .select()
    .single();

  if (error) throw error;

  return group;
}

export async function deleteGroup(groupId: string) {
  const supabase = await createClient();

  // 먼저 멤버 삭제
  const { error: memberError } = await supabase
    .from("group_members")
    .delete()
    .eq("group_id", groupId);

  if (memberError) throw memberError;

  // 그룹 삭제
  const { error: groupError } = await supabase
    .from("groups")
    .delete()
    .eq("id", groupId);

  if (groupError) throw groupError;
}

export async function getGroupMembers(groupId: string) {
  const supabase = await createClient();

  const { data: members, error } = await supabase
    .from("group_members")
    .select("*")
    .eq("group_id", groupId);

  if (error) throw error;

  return members || [];
}

export async function addGroupMember(
  groupId: string,
  userId: string,
  role: string = "member"
) {
  const supabase = await createClient();

  const { data: member, error } = await supabase
    .from("group_members")
    .insert({
      group_id: groupId,
      user_id: userId,
      role,
    })
    .select()
    .single();

  if (error) throw error;

  return member;
}

export async function removeGroupMember(groupId: string, userId: string) {
  const supabase = await createClient();

  const { error } = await supabase
    .from("group_members")
    .delete()
    .eq("group_id", groupId)
    .eq("user_id", userId);

  if (error) throw error;
}
