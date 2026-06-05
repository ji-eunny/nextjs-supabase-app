# 모임 CRUD 기능 구현 완료

## 📋 구현 사항

### 1. API Routes (백엔드)
✅ **생성된 파일:**
- `app/api/groups/route.ts` - GET (목록), POST (생성)
- `app/api/groups/[id]/route.ts` - GET (상세), PATCH (수정), DELETE (삭제)

**기능:**
- 사용자 인증 확인
- 권한 검증 (소유자만 수정/삭제)
- 에러 처리 및 HTTP 상태 코드 반환

### 2. 페이지 컴포넌트 (프론트엔드)
✅ **생성/수정된 파일:**
- `app/protected/groups/page.tsx` - 모임 목록 (실시간 데이터 연동)
- `app/protected/groups/new/page.tsx` - 새 모임 생성
- `app/protected/groups/[groupId]/page.tsx` - 모임 상세 (수정/삭제 버튼)
- `app/protected/groups/[groupId]/edit/page.tsx` - 모임 정보 수정

**기능:**
- 클라이언트 컴포넌트로 상태 관리
- 폼 검증 및 에러 처리
- 로딩 상태 표시
- 반응형 디자인

### 3. 서비스 함수
✅ **생성된 파일:**
- `lib/services/groups.ts` - Supabase CRUD 함수

**포함 함수:**
- `getGroups()` - 사용자의 모든 모임 조회
- `getGroupById()` - 특정 모임 상세 조회
- `createGroup()` - 새 모임 생성
- `updateGroup()` - 모임 정보 수정
- `deleteGroup()` - 모임 삭제 (관련 멤버도 함께 삭제)
- `getGroupMembers()` - 모임 멤버 조회
- `addGroupMember()` - 멤버 추가
- `removeGroupMember()` - 멤버 제거

### 4. UI 컴포넌트
✅ **생성된 파일:**
- `components/ui/alert-dialog.tsx` - Radix UI 기반 삭제 확인 다이얼로그

### 5. 데이터베이스 스키마
✅ **생성된 파일:**
- `supabase/migrations/20240101000000_create_groups_tables.sql`

**테이블:**
- `groups` - 모임 정보
- `group_members` - 모임 멤버 관계

**보안:**
- Row Level Security (RLS) 설정
- 외래키 CASCADE 삭제
- 인덱스 최적화

### 6. 문서
✅ **생성된 파일:**
- `docs/GROUPS_CRUD.md` - 상세 기술 문서
- `GROUPS_IMPLEMENTATION_SUMMARY.md` - 이 파일

## 🎯 기능 요약

### Create (생성)
```
POST /api/groups
- 모임명, 설명, 최대 멤버 수 입력
- 자동으로 생성자가 owner로 등록
- 201 상태 코드 반환
```

### Read (조회)
```
GET /api/groups - 사용자의 모든 모임 목록
GET /api/groups/[id] - 특정 모임 상세 정보
- 목록 페이지에서 모든 모임 표시
- 상세 페이지에서 그룹 정보 및 이벤트 표시
```

### Update (수정)
```
PATCH /api/groups/[id]
- 소유자만 수정 가능
- 모임명, 설명, 최대 멤버 수 수정
- 수정 페이지 제공
```

### Delete (삭제)
```
DELETE /api/groups/[id]
- 소유자만 삭제 가능
- 삭제 전 확인 다이얼로그 표시
- 관련 멤버 정보도 함께 삭제
```

## 🗄️ 데이터베이스 구조

### groups 테이블
```sql
id              | uuid (PK)
name            | varchar(50) - 모임명
description     | varchar(200) - 설명
max_members     | integer - 최대 멤버 수 (기본값 20)
owner_id        | uuid (FK) - 모임 소유자
created_at      | timestamp - 생성일시
updated_at      | timestamp - 수정일시
```

### group_members 테이블
```sql
id              | uuid (PK)
group_id        | uuid (FK) - 모임
user_id         | uuid (FK) - 사용자
role            | varchar(20) - 역할 (owner/member)
joined_at       | timestamp - 가입일시
```

## 🔒 보안 기능

### 인증
- 모든 API 엔드포인트에서 Supabase 사용자 인증 확인
- 미인증 사용자는 401 Unauthorized 반환

### 권한
- 수정/삭제는 소유자만 가능
- API 레벨에서 권한 재확인 (owner_id 비교)

### 데이터베이스
- Row Level Security (RLS) 활성화
- 삭제 시 CASCADE로 관련 데이터 정리

### 입력 검증
- 필수 필드 검증 (name, description, max_members)
- 필드 길이 제한 (name: 50자, description: 200자)
- 정수 범위 검증 (max_members: 1~1000)

## 🚀 사용 방법

### 1. 마이그레이션 적용

#### 로컬 개발
```bash
npx supabase start
npx supabase migration up
```

#### 원격 Supabase
```bash
npx supabase db push
```

### 2. 개발 서버 실행
```bash
npm run dev
```

### 3. 기능 테스트

#### 새 모임 생성
1. 로그인 후 `/protected/groups/new` 접속
2. 모임명, 설명, 최대 멤버 수 입력
3. "만들기" 버튼 클릭
4. 자동으로 상세 페이지로 이동

#### 모임 목록 조회
1. `/protected/groups` 접속
2. 생성된 모임 카드 표시

#### 모임 정보 수정
1. 모임 상세 페이지 접속
2. "수정" 버튼 클릭
3. 정보 수정 후 "저장" 클릭

#### 모임 삭제
1. 모임 상세 페이지 접속
2. "삭제" 버튼 클릭
3. 확인 다이얼로그에서 "삭제" 클릭

## 📦 의존성

### 새로 추가된 패키지
```json
"@radix-ui/react-alert-dialog": "^1.1.2"
```

### 기존 의존성 활용
- Next.js (라우팅, API Routes)
- React 19 (상태 관리)
- Supabase (인증, DB)
- Tailwind CSS (스타일링)
- shadcn/ui (UI 컴포넌트)

## ⚙️ 환경 설정

필수 환경 변수 (`.env.local`):
```env
NEXT_PUBLIC_SUPABASE_URL=your-supabase-url
NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY=your-publishable-key
```

## 🔄 플로우 다이어그램

### 생성 플로우
```
사용자 입력
    ↓
/protected/groups/new 페이지
    ↓
POST /api/groups
    ↓
Supabase 저장 (groups, group_members)
    ↓
상세 페이지로 리다이렉트
```

### 수정 플로우
```
사용자 클릭 (수정)
    ↓
/protected/groups/[id]/edit 페이지 (데이터 로드)
    ↓
PATCH /api/groups/[id]
    ↓
권한 확인 → Supabase 업데이트
    ↓
상세 페이지로 리다이렉트
```

### 삭제 플로우
```
사용자 클릭 (삭제)
    ↓
삭제 확인 다이얼로그
    ↓
DELETE /api/groups/[id]
    ↓
권한 확인 → Supabase 삭제 (CASCADE)
    ↓
목록 페이지로 리다이렉트
```

## 📝 추가 구현 필요 사항

### 현재 미구현 기능
- [ ] 실제 회원 멤버 수 조회 (현재는 max_members만 표시)
- [ ] 모임 멤버 관리 페이지
- [ ] 초대 시스템
- [ ] 역할 기반 권한 (owner/admin/member 세분화)
- [ ] 모임 검색 및 필터링

### 테스트 체크리스트
- [ ] 새 모임 생성 후 목록에 표시 확인
- [ ] 모임 정보 수정 확인
- [ ] 모임 삭제 시 확인 다이얼로그 표시
- [ ] 다른 사용자의 모임 수정 시도 → 403 에러
- [ ] 인증 없이 API 접근 시도 → 401 에러
- [ ] 빈 입력값 → 400 에러

## 📚 참고 자료

- [Supabase 공식 문서](https://supabase.com/docs)
- [Next.js App Router](https://nextjs.org/docs/app)
- [Radix UI](https://www.radix-ui.com/)
- [Row Level Security](https://supabase.com/docs/guides/auth/row-level-security)

## ✨ 주요 특징

1. **안전한 권한 관리**: 클라이언트와 API 레벨에서 권한 확인
2. **사용자 친화적 UI**: 로딩 상태, 에러 메시지, 확인 다이얼로그
3. **타입 안정성**: TypeScript로 모든 함수 타입 정의
4. **확장 가능한 구조**: 서비스 함수로 비즈니스 로직 분리
5. **성능 최적화**: 데이터베이스 인덱스, RLS 설정

---

모임 CRUD 기능이 완전히 구현되었습니다. 마이그레이션을 적용하고 개발 서버를 실행하여 테스트할 수 있습니다.
