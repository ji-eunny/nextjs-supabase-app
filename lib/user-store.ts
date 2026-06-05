import fs from "fs";
import path from "path";

interface User {
  id: string;
  name: string;
  email: string;
  phone?: string;
  bio?: string;
  created_at: string;
  updated_at: string;
}

const USERS_FILE = path.join(process.cwd(), ".data", "users.json");

function ensureDir() {
  const dir = path.dirname(USERS_FILE);
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }
}

function loadUsers(): User[] {
  try {
    ensureDir();
    if (fs.existsSync(USERS_FILE)) {
      const data = fs.readFileSync(USERS_FILE, "utf-8");
      return JSON.parse(data);
    }
  } catch (error) {
    console.error("사용자 파일 로드 오류:", error);
  }
  // 초기값으로 더미 사용자 생성
  return [
    {
      id: "dummy-user-id",
      name: "김지은",
      email: "ccomo7071@gmail.com",
      phone: "010-1234-5678",
      bio: "활동적인 사용자입니다",
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    },
  ];
}

function saveUsers(users: User[]) {
  try {
    ensureDir();
    fs.writeFileSync(USERS_FILE, JSON.stringify(users, null, 2), "utf-8");
  } catch (error) {
    console.error("사용자 파일 저장 오류:", error);
  }
}

let users: User[] = loadUsers();

export function getAllUsers() {
  return users;
}

export function getUserById(userId: string) {
  return users.find((u) => u.id === userId);
}

export function getUserByEmail(email: string) {
  return users.find((u) => u.email === email);
}

export function updateUser(userId: string, updates: Partial<User>) {
  const user = users.find((u) => u.id === userId);
  if (user) {
    Object.assign(user, updates, { updated_at: new Date().toISOString() });
    saveUsers(users);
    return user;
  }
  return null;
}

export function addUser(user: User) {
  users.push(user);
  saveUsers(users);
  return user;
}
