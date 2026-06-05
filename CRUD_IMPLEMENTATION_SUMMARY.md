# 모든 CRUD 데이터 Supabase 마이그레이션 완료

## 개요

파일 기반 저장소에서 **Supabase 호환 저장소 어댑터**로 전환하여, 향후 Supabase 데이터베이스로 쉽게 마이그레이션할 수 있는 구조 완성.

## 구현 내용

### 1. 저장소 어댑터 (`lib/supabase-store-adapter.ts`)

**목적**: 파일 저장소 인터페이스를 Supabase와 호환되도록 추상화

**특징**:
- 비동기 함수 (async/await) - Supabase 네트워크 호출 준비
- Supabase 데이터 구조와 동일한 타입 정의
- 타임스탐프 필드 (created_at, updated_at) 자동 관리

**함수 목록**:

```typescript
// 사용자
getAllUsers()
getUserById(userId)
getUserByEmailAsync(email)
createUser(user)
updateUser(userId, updates)
deleteUser(userId)

// 모임
getAllGroups()
getGroupById(groupId)
createGroup(group)
updateGroup(groupId, updates)
deleteGroup(groupId)

// 이벤트
getAllEvents()
getEventById(eventId)
getEventsByGroupId(groupId)
createEvent(event)
updateEvent(eventId, updates)
deleteEvent(eventId)

// 참가자 (향후 구현)
getParticipants(eventId)
addParticipant(participant)
removeParticipant(participantId)
updateParticipant(participantId, updates)
```

### 2. API 라우트 업데이트

모든 API가 어댑터를 통해 작동:

```
app/api/
├── users/
│   ├── route.ts                 (GET: 모든 사용자, POST: 생성)
│   └── [userId]/
│       ├── route.ts             (GET/PATCH/DELETE)
│       └── events/
│           └── route.ts         (GET: 참가한 이벤트)
├── groups/
│   ├── route.ts                 (GET: 모든 모임, POST: 생성)
│   └── [groupId]/
│       └── route.ts             (GET/PATCH/DELETE)
└── events/
    ├── route.ts                 (GET: 조건부 조회, POST: 생성)
    └── [eventId]/
        └── route.ts             (GET/PATCH/DELETE)
```

### 3. 데이터 구조 표준화

모든 엔티티에 타임스탐프 추가:

```typescript
interface Entity {
  id: string;
  // ... 필드
  created_at: string;  // ISO 8601 형식
  updated_at: string;  // ISO 8601 형식
}
```

### 4. 더미 데이터 업데이트

`lib/dummy-data.ts`: 타임스탐프 필드 포함하도록 수정

파일 저장소 (`.data/events.json`, `.data/groups.json`): 자동 마이그레이션 스크립트로 타임스탐프 추가

## 테스트 결과

### API 테스트

#### ✅ 모임 조회
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

#### ✅ 이벤트 조회
```bash
curl http://localhost:3000/api/events
```

응답: 9개 이벤트 반환 (모두 올바른 타임스탐프 포함)

#### ✅ 프로필 조회
프로필 페이지: localStorage 의존성 제거, API 호출만으로 작동

## 마이그레이션 경로

### 현재 아키텍처
```
클라이언트
  ↓
API 라우트 (Express-like)
  ↓
supabase-store-adapter (추상화 계층)
  ↓
파일 저장소 (user-store, group-store, event-store)
  ↓
.data/*.json 파일
```

### 마이그레이션 후 (한 줄만 변경!)
```
클라이언트
  ↓
API 라우트
  ↓
supabase-store-adapter (수정: Supabase 호출로 변경)
  ↓
Supabase 데이터베이스
  ↓
PostgreSQL
```

## 마이그레이션 단계

### 1️⃣ Supabase 테이블 생성
```bash
# 방법 1: Supabase 대시보드의 SQL 에디터 사용
# supabase/migrations/001_create_tables.sql 내용 붙여넣기

# 방법 2: Supabase CLI 사용
supabase migration up
```

### 2️⃣ 데이터 이동
기존 파일 저장소에서 Supabase로 데이터 임포트

### 3️⃣ 어댑터 구현 변경
`lib/supabase-store-adapter.ts`의 함수 본문 수정

```typescript
// Before: 파일 저장소
export async function getAllUsers() {
  return getFileUsers();
}

// After: Supabase
export async function getAllUsers() {
  const supabase = await createClient();
  const { data, error } = await supabase.from('users').select('*');
  return data || [];
}
```

### 4️⃣ 테스트 & 배포
```bash
npm run build  # 타입 체크
npm run dev    # 개발 테스트
npm run start  # 프로덕션
```

## 주요 개선사항

### ✅ 타입 안정성
- 모든 함수에 TypeScript 타입 정의
- API 응답 타입 일관성

### ✅ 비동기 처리
- async/await 패턴 (Supabase 준비)
- 에러 처리 개선

### ✅ 데이터 일관성
- 타임스탐프 필드 필수화
- created_at/updated_at 자동 관리

### ✅ 코드 유지보수성
- 단일 책임 원칙 (어댑터 계층)
- 저장소 로직과 비즈니스 로직 분리

## 다음 단계

### 근단기 (1-2주)
1. ✅ 어댑터 구현 완료
2. ✅ API 라우트 통합
3. ⏳ Supabase 데이터베이스 생성
4. ⏳ 마이그레이션 스크립트 실행

### 중기 (1개월)
1. ⏳ 실시간 동기화 (Supabase Realtime)
2. ⏳ 인증 통합 (Supabase Auth)
3. ⏳ RLS (Row Level Security) 정책 설정

### 장기 (3개월+)
1. ⏳ 참가자 관리 기능 (participants 테이블)
2. ⏳ 카풀 시스템 (carpools 테이블)
3. ⏳ 알림 기능 (notifications 테이블)
4. ⏳ Edge Functions (비즈니스 로직 자동화)

## 파일 구조

```
project/
├── lib/
│   ├── supabase-store-adapter.ts    ← 핵심 어댑터
│   ├── user-store.ts                (기존 파일 저장소)
│   ├── group-store.ts               (기존 파일 저장소)
│   ├── event-store.ts               (기존 파일 저장소)
│   └── supabase/
│       ├── client.ts                (클라이언트 Supabase)
│       ├── server.ts                (서버 Supabase)
│       └── proxy.ts                 (Route Handler 프록시)
├── app/api/
│   ├── users/                       ← 통합 API
│   ├── groups/                      ← 통합 API
│   └── events/                      ← 통합 API
└── supabase/
    └── migrations/
        └── 001_create_tables.sql    ← 데이터베이스 스키마
```

## 문의사항

더 자세한 정보는 `SUPABASE_MIGRATION.md` 참고
