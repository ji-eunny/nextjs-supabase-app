import fs from "fs";
import path from "path";
import { dummyGroups } from "./dummy-data";

interface Group {
  id: string;
  name: string;
  description: string;
  max_members: number;
  owner_id: string;
  created_at: string;
  updated_at: string;
  member_count?: number;
  next_event_title?: string;
  next_event_at?: string;
}

const GROUPS_FILE = path.join(process.cwd(), ".data", "groups.json");

function ensureDir() {
  const dir = path.dirname(GROUPS_FILE);
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }
}

function loadGroups(): Group[] {
  try {
    ensureDir();
    if (fs.existsSync(GROUPS_FILE)) {
      const data = fs.readFileSync(GROUPS_FILE, "utf-8");
      return JSON.parse(data);
    }
  } catch (error) {
    console.error("그룹 파일 로드 오류:", error);
  }
  // 초기값으로 더미 데이터 사용
  return [...dummyGroups];
}

function saveGroups(groups: Group[]) {
  try {
    ensureDir();
    fs.writeFileSync(GROUPS_FILE, JSON.stringify(groups, null, 2), "utf-8");
  } catch (error) {
    console.error("그룹 파일 저장 오류:", error);
  }
}

let groups: Group[] = loadGroups();

export function getAllGroups() {
  return groups;
}

export function getGroupById(groupId: string) {
  return groups.find((g) => g.id === groupId);
}

export function addGroup(group: Group) {
  groups.push(group);
  saveGroups(groups);
  return group;
}

export function updateGroup(groupId: string, updates: Partial<Group>) {
  const group = groups.find((g) => g.id === groupId);
  if (group) {
    Object.assign(group, updates);
    saveGroups(groups);
    return group;
  }
  return null;
}

export function deleteGroup(groupId: string) {
  const index = groups.findIndex((g) => g.id === groupId);
  if (index !== -1) {
    groups.splice(index, 1);
    saveGroups(groups);
    return true;
  }
  return false;
}
