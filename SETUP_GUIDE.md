# Supabase 완전 설정 가이드

## 📋 3단계로 완료하기 (총 10분)

### 1️⃣ **Supabase 테이블 생성** (5분)

#### Step 1: Supabase 대시보드 열기
```
https://app.supabase.com에 로그인
```

#### Step 2: SQL 에디터 열기
1. 좌측 메뉴 → **SQL Editor**
2. **+ New Query** 클릭

#### Step 3: SQL 쿼리 실행
아래의 전체 내용을 복사하여 SQL 에디터에 붙여넣기:

```sql
-- 사용자 테이블
CREATE TABLE IF NOT EXISTS public.users (
  id text PRIMARY KEY,
  name text NOT NULL,
  email text UNIQUE NOT NULL,
  phone text,
  bio text,
  created_at timestamp with time zone DEFAULT now(),
  updated_at timestamp with time zone DEFAULT now()
);

-- 모임 테이블
CREATE TABLE IF NOT EXISTS public.groups (
  id text PRIMARY KEY,
  name text NOT NULL,
  description text NOT NULL,
  max_members integer NOT NULL,
  owner_id text NOT NULL REFERENCES public.users(id),
  member_count integer DEFAULT 0,
  next_event_title text,
  next_event_at timestamp with time zone,
  created_at timestamp with time zone DEFAULT now(),
  updated_at timestamp with time zone DEFAULT now()
);

-- 이벤트 테이블
CREATE TABLE IF NOT EXISTS public.events (
  id text PRIMARY KEY,
  group_id text NOT NULL REFERENCES public.groups(id) ON DELETE CASCADE,
  title text NOT NULL,
  description text NOT NULL,
  date text NOT NULL,
  time text NOT NULL,
  location text NOT NULL,
  max_participants integer NOT NULL,
  participant_count integer DEFAULT 0,
  waiting_count integer DEFAULT 0,
  fee integer DEFAULT 0,
  carpool_enabled boolean DEFAULT false,
  created_at timestamp with time zone DEFAULT now(),
  updated_at timestamp with time zone DEFAULT now()
);

-- 참가자 테이블
CREATE TABLE IF NOT EXISTS public.participants (
  id text PRIMARY KEY,
  event_id text NOT NULL REFERENCES public.events(id) ON DELETE CASCADE,
  user_id text NOT NULL REFERENCES public.users(id),
  status text DEFAULT 'confirmed',
  fee_paid boolean DEFAULT false,
  created_at timestamp with time zone DEFAULT now(),
  updated_at timestamp with time zone DEFAULT now()
);

-- 인덱스 생성
CREATE INDEX IF NOT EXISTS idx_events_group_id ON public.events(group_id);
CREATE INDEX IF NOT EXISTS idx_groups_owner_id ON public.groups(owner_id);
CREATE INDEX IF NOT EXISTS idx_participants_event_id ON public.participants(event_id);
CREATE INDEX IF NOT EXISTS idx_participants_user_id ON public.participants(user_id);

-- RLS 활성화
ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.groups ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.events ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.participants ENABLE ROW LEVEL SECURITY;

-- RLS 정책 (개발 환경: 모든 사용자 접근)
CREATE POLICY "users_public_read" ON public.users FOR SELECT USING (true);
CREATE POLICY "users_public_insert" ON public.users FOR INSERT WITH CHECK (true);
CREATE POLICY "users_public_update" ON public.users FOR UPDATE USING (true);

CREATE POLICY "groups_public_read" ON public.groups FOR SELECT USING (true);
CREATE POLICY "groups_public_insert" ON public.groups FOR INSERT WITH CHECK (true);
CREATE POLICY "groups_public_update" ON public.groups FOR UPDATE USING (true);
CREATE POLICY "groups_public_delete" ON public.groups FOR DELETE USING (true);

CREATE POLICY "events_public_read" ON public.events FOR SELECT USING (true);
CREATE POLICY "events_public_insert" ON public.events FOR INSERT WITH CHECK (true);
CREATE POLICY "events_public_update" ON public.events FOR UPDATE USING (true);
CREATE POLICY "events_public_delete" ON public.events FOR DELETE USING (true);

CREATE POLICY "participants_public_read" ON public.participants FOR SELECT USING (true);
CREATE POLICY "participants_public_insert" ON public.participants FOR INSERT WITH CHECK (true);
CREATE POLICY "participants_public_update" ON public.participants FOR UPDATE USING (true);
CREATE POLICY "participants_public_delete" ON public.participants FOR DELETE USING (true);
```

#### Step 4: 실행
**Command + Enter** (Mac) 또는 **Ctrl + Enter** (Windows)로 실행

✅ 완료! 4개 테이블이 생성됩니다.

---

### 2️⃣ **데이터 마이그레이션** (2분)

#### Step 1: 터미널 열기
```bash
cd C:\Users\KIMJIEUN\Desktop\workspace\nextjs-supabase-app
```

#### Step 2: 마이그레이션 스크립트 실행
```bash
npm run migrate
```

출력 예시:
```
🚀 Supabase 마이그레이션 시작

📍 Supabase URL: https://btroslssggdzxjtvizkk.supabase.co
✅ Supabase 연결 성공!

📝 사용자 마이그레이션 중...
  ✅ dummy-user-id (김지은99)

📝 모임 마이그레이션 중...
  ✅ group-1 (주말 등산 동호회)
  ✅ group-2 (헬스 운동 모임)
  ✅ group-1780637565278 (987978)

📝 이벤트 마이그레이션 중...
  ✅ event-1 (북한산 등산)
  ✅ event-2 (산악자전거 라이딩)
  ✅ event-1780636407670 (수정된 - 새 이벤트)
  ...

✅ 마이그레이션 완료!

다음 단계:
  1. npm run dev
  2. http://localhost:3000에서 앱 확인
```

✅ 모든 데이터가 Supabase로 이동됩니다!

---

### 3️⃣ **앱 실행 & 테스트** (3분)

#### Step 1: 개발 서버 시작
```bash
npm run dev
```

#### Step 2: 브라우저에서 열기
```
http://localhost:3000
```

#### Step 3: API 테스트

**모임 조회:**
```bash
curl http://localhost:3000/api/groups
```

응답:
```json
{
  "groups": [
    {
      "id": "group-1",
      "name": "주말 등산 동호회",
      "description": "매주 주말 서울 근처 산 등산",
      "member_count": 12,
      "max_members": 20,
      "owner_id": "user-1",
      "created_at": "2026-05-01T00:00:00Z",
      "updated_at": "2026-05-01T00:00:00Z"
    }
  ]
}
```

**이벤트 조회:**
```bash
curl http://localhost:3000/api/events
```

**사용자 조회:**
```bash
curl http://localhost:3000/api/users
```

✅ 모든 API가 Supabase에서 데이터를 가져옵니다!

---

## ✨ 완료 확인

### 터미널에서:
```bash
git log --oneline | head -5
```

출력:
```
eaa9339 feat: Supabase 저장소 완전 구현 및 API 통합
de12d73 chore: 데이터 저장소 및 플레이라이트 로그 업데이트
be99670 docs: Supabase 마이그레이션 가이드 및 구현 요약 문서 추가
f141938 feat: Supabase 호환 저장소 어댑터 및 통합 API 구현
903c19b feat: 파일 기반 저장소 및 사용자 프로필 기능 구현
```

### Supabase 대시보드에서:
- ✅ Table Editor → users, groups, events, participants 4개 테이블
- ✅ 각 테이블에 데이터 포함

---

## 🔧 문제 해결

### 문제: "테이블을 찾을 수 없습니다" 오류

**해결:**
1. Supabase 대시보드로 돌아가기
2. SQL 에디터에서 테이블 생성 SQL 다시 실행
3. `npm run migrate` 다시 실행

### 문제: "연결 오류"

**해결:**
```bash
# 환경 변수 확인
cat .env.local | grep SUPABASE

# 출력:
# NEXT_PUBLIC_SUPABASE_URL=https://btroslssggdzxjtvizkk.supabase.co
# NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY=sb_publishable_yDmJYsrrDNWlESN-n-U1BQ_x7QEz9AY
```

두 값이 모두 있으면 올바릅니다.

### 문제: 마이그레이션 중복 오류

**해결:**
안전합니다! 스크립트가 자동으로 중복을 무시합니다.

---

## 📚 다음 단계

### 즉시 (오늘)
- ✅ Supabase 테이블 생성
- ✅ 데이터 마이그레이션
- ✅ 앱 테스트

### 단기 (1주일)
- [ ] 실시간 동기화 (Supabase Realtime)
- [ ] 사용자 인증 (Supabase Auth)
- [ ] 프로덕션 배포 (Vercel)

### 중기 (1개월)
- [ ] Row Level Security (RLS) 정책 강화
- [ ] 참가자 관리 기능
- [ ] 결제 시스템 (Stripe)

---

## 💡 주요 포인트

### 현재 구조
```
Next.js App Router
  ↓
API Routes (/api/*)
  ↓
Supabase Store (lib/supabase-store.ts)
  ↓
Supabase PostgreSQL 데이터베이스
```

### 데이터 흐름
```
클라이언트 → API Route → Supabase SDK → PostgreSQL ← Supabase 대시보드
```

### 보안
- ✅ RLS (Row Level Security) 활성화
- ✅ 환경 변수 사용
- ⏳ 프로덕션에서 RLS 정책 강화 필요

---

## 📞 도움말

### Supabase 문서
- [공식 가이드](https://supabase.com/docs)
- [SQL 에디터](https://supabase.com/docs/guides/database/sql-editor)
- [Row Level Security](https://supabase.com/docs/guides/auth/row-level-security)

### 프로젝트 문서
- `SUPABASE_MIGRATION.md` - 상세 마이그레이션 가이드
- `CRUD_IMPLEMENTATION_SUMMARY.md` - 구현 요약
- `CLAUDE.md` - 프로젝트 가이드

---

## ✅ 체크리스트

완료 시 체크:

- [ ] Step 1: SQL 테이블 생성
- [ ] Step 2: `npm run migrate` 실행
- [ ] Step 3: `npm run dev` 실행
- [ ] Step 4: http://localhost:3000 확인
- [ ] Step 5: API 테스트 (`curl http://localhost:3000/api/groups`)

**모두 완료되면 축하합니다! 🎉 Supabase 완전 연동이 완료되었습니다!**
