# 모임(Groups) CRUD 기능 구현

## 개요

Next.js + Supabase를 이용한 모임 관리 기능의 완전한 CRUD(Create, Read, Update, Delete) 구현입니다.

## 파일 구조

### API Routes
```
app/api/groups/
├── route.ts          # GET (목록), POST (생성)
└── [id]/
    └── route.ts      # GET (상세), PATCH (수정), DELETE (삭제)
```

### 페이지 컴포넌트
```
app/protected/groups/
├── page.tsx                    # 모임 목록
├── new/
│   └── page.tsx               # 새 모임 생성
└── [groupId]/
    ├── page.tsx               # 모임 상세 (수정/삭제 버튼 포함)
    └── edit/
        └── page.tsx           # 모임 정보 수정
```

### 서비스 함수
```
lib/services/
└── groups.ts                  # Supabase 데이터 접근 로직
```

### UI 컴포넌트
```
components/ui/
└── alert-dialog.tsx           # 삭제 확인 다이얼로그
```

### 데이터베이스
```
supabase/migrations/
└── 20240101000000_create_groups_tables.sql
```

## 주요 기능

### 1. 모임 조회 (Read)
- **목록 조회**: `/protected/groups` - 사용자의 모든 모임 표시
- **상세 조회**: `/protected/groups/[groupId]` - 모임 상세 정보 및 이벤트

**API Endpoint**:
```
GET /api/groups                    # 모임 목록
GET /api/groups/[id]              # 모임 상세
```

### 2. 모임 생성 (Create)
- 새 모임 생성 페이지: `/protected/groups/new`
- 필수 정보: 모임명, 설명, 최대 멤버 수
- 생성 후 자동으로 생성자가 owner 역할로 멤버 추가

**API Endpoint**:
```
POST /api/groups
Content-Type: application/json

{
  "name": "주말 등산 동호회",
  "description": "매주 주말 서울 근처 산 등산",
  "max_members": 20
}
```

### 3. 모임 수정 (Update)
- 수정 페이지: `/protected/groups/[groupId]/edit`
- 소유자만 수정 가능
- 수정 가능한 항목: 모임명, 설명, 최대 멤버 수

**API Endpoint**:
```
PATCH /api/groups/[id]
Content-Type: application/json

{
  "name": "수정된 모임명",
  "description": "수정된 설명",
  "max_members": 25
}
```

### 4. 모임 삭제 (Delete)
- 모임 상세 페이지에서 "삭제" 버튼 클릭
- 소유자만 삭제 가능
- 삭제 전 확인 다이얼로그 표시
- 삭제 시 관련 모든 멤버 정보도 자동 삭제 (CASCADE)

**API Endpoint**:
```
DELETE /api/groups/[id]
```

## 데이터베이스 스키마

### groups 테이블
```sql
CREATE TABLE public.groups (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name varchar(50) NOT NULL,
  description varchar(200) NOT NULL,
  max_members integer NOT NULL DEFAULT 20,
  owner_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  created_at timestamp with time zone DEFAULT NOW(),
  updated_at timestamp with time zone DEFAULT NOW()
);
```

### group_members 테이블
```sql
CREATE TABLE public.group_members (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  group_id uuid NOT NULL REFERENCES public.groups(id) ON DELETE CASCADE,
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  role varchar(20) DEFAULT 'member' NOT NULL,
  joined_at timestamp with time zone DEFAULT NOW(),
  UNIQUE(group_id, user_id)
);
```

## Row Level Security (RLS)

모든 테이블에 RLS가 활성화되어 있습니다:

- **groups**: 누구나 조회 가능, 소유자만 수정/삭제 가능
- **group_members**: 누구나 조회 가능, 소유자만 추가/제거 가능

## 마이그레이션 적용 방법

### 로컬 개발 환경
```bash
# Supabase 로컬 스택 시작
npx supabase start

# 마이그레이션 적용
npx supabase migration up

# 또는 SQL 직접 실행
psql postgresql://postgres:postgres@localhost:54321/postgres < supabase/migrations/20240101000000_create_groups_tables.sql
```

### 원격 Supabase 프로젝트
```bash
# CLI를 통한 마이그레이션
npx supabase db push

# 또는 Supabase 대시보드의 SQL Editor에서 직접 실행
```

## 사용 예제

### 새 모임 생성
```typescript
const response = await fetch("/api/groups", {
  method: "POST",
  headers: { "Content-Type": "application/json" },
  body: JSON.stringify({
    name: "새 모임",
    description: "모임 설명",
    max_members: 20
  })
});
const data = await response.json();
console.log(data.group.id); // 생성된 모임 ID
```

### 모임 목록 조회
```typescript
const response = await fetch("/api/groups");
const data = await response.json();
console.log(data.groups); // 모임 목록
```

### 모임 정보 수정
```typescript
const response = await fetch(`/api/groups/${groupId}`, {
  method: "PATCH",
  headers: { "Content-Type": "application/json" },
  body: JSON.stringify({
    name: "수정된 이름",
    max_members: 25
  })
});
const data = await response.json();
console.log(data.group);
```

### 모임 삭제
```typescript
const response = await fetch(`/api/groups/${groupId}`, {
  method: "DELETE"
});
const data = await response.json();
console.log(data.message); // "모임이 삭제되었습니다"
```

## 에러 처리

모든 API 엔드포인트는 표준 HTTP 상태 코드를 반환합니다:

- `200`: 성공 (조회, 수정)
- `201`: 생성 성공
- `400`: 잘못된 요청 (필드 누락)
- `401`: 인증 필요
- `403`: 접근 권한 없음 (소유자 아님)
- `500`: 서버 오류

## 보안 고려사항

1. **인증**: 모든 API 엔드포인트에서 사용자 인증 확인
2. **권한 확인**: 수정/삭제는 소유자만 가능 (API에서 재확인)
3. **RLS**: 데이터베이스 레벨에서 추가 보안
4. **입력 검증**: 필수 필드 및 길이 제한 확인
5. **CORS**: Next.js 동일 도메인 요청만 허용

## 제한사항 및 향후 개선 사항

### 현재 제한사항
- 더미 데이터와 실제 데이터 혼합 사용
- 모임 멤버 목록 UI 미구현
- 권한별 기능(멤버 관리 등) 미구현

### 향후 개선 계획
- [ ] 모임 멤버 관리 페이지
- [ ] 역할 기반 권한 시스템 (owner, admin, member)
- [ ] 초대 시스템 (초대 코드/링크)
- [ ] 모임 검색 및 필터링
- [ ] 활동 로그
- [ ] 모임 이미지/배너
- [ ] 공지사항 기능

## 환경 변수

필요한 환경 변수는 `.env.local`에 설정합니다:

```env
NEXT_PUBLIC_SUPABASE_URL=your-supabase-url
NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY=your-publishable-key
```

## 테스트

### 수동 테스트 체크리스트
- [ ] 새 모임 생성
- [ ] 모임 목록 조회
- [ ] 모임 상세 조회
- [ ] 모임 정보 수정
- [ ] 모임 삭제 (확인 다이얼로그 포함)
- [ ] 권한 확인 (다른 사용자의 모임 수정 시도)
- [ ] 입력 값 검증 (빈 값, 최대 길이 초과)

## 참고

- [Supabase 공식 문서](https://supabase.com/docs)
- [Next.js API Routes](https://nextjs.org/docs/app/building-your-application/routing/route-handlers)
- [Row Level Security (RLS)](https://supabase.com/docs/guides/auth/row-level-security)
