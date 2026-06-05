# Supabase 마이그레이션 가이드

## 현재 상태

### 데이터 저장소
- **현재**: 파일 기반 저장소 (`.data/*.json`)
- **어댑터**: `lib/supabase-store-adapter.ts` (Supabase 호환 인터페이스 제공)
- **API**: 모든 API 라우트는 어댑터를 통해 작동

### 데이터 구조
```
users/
├── id: string
├── name: string
├── email: string
├── phone?: string
├── bio?: string
├── created_at: string (ISO 8601)
├── updated_at: string (ISO 8601)

groups/
├── id: string
├── name: string
├── description: string
├── max_members: number
├── owner_id: string (FK: users.id)
├── member_count?: number
├── next_event_title?: string
├── next_event_at?: string
├── created_at: string
├── updated_at: string

events/
├── id: string
├── group_id: string (FK: groups.id)
├── title: string
├── description: string
├── date: string (YYYY-MM-DD)
├── time: string (HH:mm)
├── location: string
├── max_participants: number
├── participant_count: number
├── waiting_count: number
├── fee: number
├── carpool_enabled: boolean
├── created_at: string
├── updated_at: string

participants/
├── id: string (예정)
├── event_id: string (FK: events.id)
├── user_id: string (FK: users.id)
├── status: string (confirmed, waiting, cancelled)
├── fee_paid: boolean
├── created_at: string
├── updated_at: string
```

## 마이그레이션 단계

### 1단계: Supabase 데이터베이스 생성

Supabase 대시보드의 SQL 에디터에서 `supabase/migrations/001_create_tables.sql` 실행:

```sql
-- supabase/migrations/001_create_tables.sql의 내용 복사 붙여넣기
```

또는 CLI 사용:

```bash
supabase migration up
```

### 2단계: 파일 저장소 → Supabase 데이터 이동

```typescript
// lib/migration-script.ts (임시 파일)
import * as fs from 'fs';
import { createClient } from '@/lib/supabase/server';

async function migrateData() {
  const supabase = await createClient();

  // 1. 사용자 마이그레이션
  const users = JSON.parse(fs.readFileSync('.data/users.json', 'utf-8'));
  for (const user of users) {
    await supabase.from('users').insert(user);
  }

  // 2. 모임 마이그레이션
  const groups = JSON.parse(fs.readFileSync('.data/groups.json', 'utf-8'));
  for (const group of groups) {
    await supabase.from('groups').insert(group);
  }

  // 3. 이벤트 마이그레이션
  const events = JSON.parse(fs.readFileSync('.data/events.json', 'utf-8'));
  for (const event of events) {
    await supabase.from('events').insert(event);
  }

  console.log('✓ 마이그레이션 완료');
}
```

### 3단계: 저장소 어댑터 업데이트

`lib/supabase-store-adapter.ts`의 구현을 실제 Supabase 호출로 변경:

```typescript
// Before: 파일 저장소 사용
import { getAllUsers as getFileUsers } from '@/lib/user-store';

export async function getAllUsers() {
  return getFileUsers();
}

// After: Supabase 직접 호출
import { createClient } from '@/lib/supabase/server';

export async function getAllUsers() {
  const supabase = await createClient();
  const { data, error } = await supabase.from('users').select('*');
  if (error) throw error;
  return data || [];
}
```

### 4단계: RLS (Row Level Security) 정책 설정

개발 환경에서는 PUBLIC 접근 허용:

```sql
CREATE POLICY "Allow public read" ON users FOR SELECT TO public USING (true);
CREATE POLICY "Allow public insert" ON users FOR INSERT TO public WITH CHECK (true);
-- ... (다른 테이블도 동일하게)
```

프로덕션에서는 인증 기반 정책:

```sql
CREATE POLICY "Users can see their own data"
  ON users FOR SELECT
  USING (auth.uid() = id);
```

## API 호환성

### 현재 API 엔드포인트

```
GET    /api/users                    모든 사용자 조회
GET    /api/users/[userId]           특정 사용자 조회
PATCH  /api/users/[userId]           사용자 수정
DELETE /api/users/[userId]           사용자 삭제
POST   /api/users                    사용자 생성

GET    /api/groups                   모든 모임 조회
GET    /api/groups/[groupId]         특정 모임 조회
PATCH  /api/groups/[groupId]         모임 수정
DELETE /api/groups/[groupId]         모임 삭제
POST   /api/groups                   모임 생성

GET    /api/events                   모든 이벤트 조회 (groupId 쿼리 가능)
GET    /api/events/[eventId]         특정 이벤트 조회
PATCH  /api/events/[eventId]         이벤트 수정
DELETE /api/events/[eventId]         이벤트 삭제
POST   /api/events                   이벤트 생성

GET    /api/users/[userId]/events    사용자가 참가한 이벤트
```

## 마이그레이션 후 테스트

```bash
# 1. 타입 체크
npm run build

# 2. 개발 서버 실행
npm run dev

# 3. API 테스트
curl http://localhost:3000/api/users
curl http://localhost:3000/api/groups
curl http://localhost:3000/api/events

# 4. 통합 테스트
npm run test
```

## 주의사항

### 1. 타임스탐프
모든 데이터에 `created_at`과 `updated_at` 필드 필수

### 2. 외래 키
- `groups.owner_id` → `users.id`
- `events.group_id` → `groups.id`
- `participants.event_id` → `events.id`
- `participants.user_id` → `users.id`

### 3. 동시성 문제
파일 저장소는 동시 쓰기 처리 불가능
→ Supabase는 자동으로 처리

### 4. 트랜잭션
여러 테이블 업데이트 시 트랜잭션 사용 필수

```typescript
const { error } = await supabase
  .from('events')
  .update({ participant_count: newCount })
  .eq('id', eventId);
```

## 향후 개선

### 1. 실시간 동기화
```typescript
const subscription = supabase
  .on('postgres_changes', 
    { event: '*', schema: 'public', table: 'events' },
    (payload) => {
      // 실시간 업데이트
    }
  )
  .subscribe();
```

### 2. 인증 통합
Supabase Auth와 연동하여 RLS 정책 활성화

### 3. 파일 저장소 제거
마이그레이션 후 `.data/` 디렉토리 삭제 및 파일 저장소 라이브러리 제거

```bash
rm -rf .data/
rm lib/user-store.ts lib/group-store.ts lib/event-store.ts
```
