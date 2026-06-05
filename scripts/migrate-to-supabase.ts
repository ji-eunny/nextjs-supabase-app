import * as fs from "fs";
import * as path from "path";
import { createClient } from "@supabase/supabase-js";
import { config } from "dotenv";

// .env.local 파일 로드
config({ path: path.join(process.cwd(), ".env.local") });

// 환경 변수에서 Supabase 설정 읽기
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  console.error("❌ 환경 변수 설정이 필요합니다:");
  console.error("  NEXT_PUBLIC_SUPABASE_URL");
  console.error("  NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY");
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseAnonKey);

async function migrateUsers() {
  console.log("\n📝 사용자 마이그레이션 중...");
  try {
    const usersPath = path.join(process.cwd(), ".data", "users.json");
    const users = JSON.parse(fs.readFileSync(usersPath, "utf-8"));

    for (const user of users) {
      const { error } = await supabase.from("users").insert({
        id: user.id,
        name: user.name,
        email: user.email,
        phone: user.phone || null,
        bio: user.bio || null,
        created_at: user.created_at,
        updated_at: user.updated_at,
      });

      if (error) {
        // 중복 오류는 무시
        if (!error.message.includes("duplicate")) {
          console.error(`  ❌ ${user.id} 오류:`, error.message);
        }
      } else {
        console.log(`  ✅ ${user.id} (${user.name})`);
      }
    }
  } catch (error) {
    console.error("  ❌ 사용자 마이그레이션 실패:", error);
  }
}

async function migrateGroups() {
  console.log("\n📝 모임 마이그레이션 중...");
  try {
    const groupsPath = path.join(process.cwd(), ".data", "groups.json");
    const groups = JSON.parse(fs.readFileSync(groupsPath, "utf-8"));

    for (const group of groups) {
      const { error } = await supabase.from("groups").insert({
        id: group.id,
        name: group.name,
        description: group.description,
        max_members: group.max_members,
        owner_id: group.owner_id,
        member_count: group.member_count || 1,
        next_event_title: group.next_event_title || null,
        next_event_at: group.next_event_at || null,
        created_at: group.created_at,
        updated_at: group.updated_at,
      });

      if (error) {
        if (!error.message.includes("duplicate")) {
          console.error(`  ❌ ${group.id} 오류:`, error.message);
        }
      } else {
        console.log(`  ✅ ${group.id} (${group.name})`);
      }
    }
  } catch (error) {
    console.error("  ❌ 모임 마이그레이션 실패:", error);
  }
}

async function migrateEvents() {
  console.log("\n📝 이벤트 마이그레이션 중...");
  try {
    const eventsPath = path.join(process.cwd(), ".data", "events.json");
    const events = JSON.parse(fs.readFileSync(eventsPath, "utf-8"));

    for (const event of events) {
      const { error } = await supabase.from("events").insert({
        id: event.id,
        group_id: event.group_id,
        title: event.title,
        description: event.description,
        date: event.date,
        time: event.time,
        location: event.location,
        max_participants: event.max_participants,
        participant_count: event.participant_count || 0,
        waiting_count: event.waiting_count || 0,
        fee: event.fee || 0,
        carpool_enabled: event.carpool_enabled || false,
        created_at: event.created_at,
        updated_at: event.updated_at,
      });

      if (error) {
        if (!error.message.includes("duplicate")) {
          console.error(`  ❌ ${event.id} 오류:`, error.message);
        }
      } else {
        console.log(`  ✅ ${event.id} (${event.title})`);
      }
    }
  } catch (error) {
    console.error("  ❌ 이벤트 마이그레이션 실패:", error);
  }
}

async function main() {
  console.log("🚀 Supabase 마이그레이션 시작\n");
  console.log(`📍 Supabase URL: ${supabaseUrl}`);

  // 1. Supabase 연결 테스트
  console.log("\n✅ Supabase 연결 확인 중...");
  try {
    const { data, error } = await supabase.from("users").select("count");
    if (error) {
      console.error("❌ 테이블을 찾을 수 없습니다. 먼저 다음을 실행하세요:");
      console.error("\nSupabase 대시보드 → SQL 에디터 → 다음 쿼리 실행:");
      console.error("\n" + fs.readFileSync("supabase/migrations/001_create_tables.sql", "utf-8"));
      process.exit(1);
    }
    console.log("✅ Supabase 연결 성공!");
  } catch (error) {
    console.error("❌ Supabase 연결 실패:", error);
    process.exit(1);
  }

  // 2. 데이터 마이그레이션
  await migrateUsers();
  await migrateGroups();
  await migrateEvents();

  console.log("\n✅ 마이그레이션 완료!");
  console.log("\n다음 단계:");
  console.log("  1. npm run dev");
  console.log("  2. http://localhost:3000에서 앱 확인");
}

main().catch(console.error);
