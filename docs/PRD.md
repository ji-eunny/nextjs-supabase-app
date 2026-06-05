# Product Requirements Document (PRD)

## 프로젝트명
Next.js + Supabase 풀스택 스타터 킷 - 그룹/이벤트 관리 플랫폼

## 1. 개요

사용자가 그룹을 생성하고 관리하며, 그룹 내에서 이벤트를 생성 및 조직할 수 있는 풀스택 웹 애플리케이션입니다. Google OAuth를 통한 간단한 인증과 Supabase를 활용한 데이터 관리를 제공합니다.

## 2. 핵심 기능

### 2.1 사용자 인증
- **Google OAuth 로그인**: Google 계정을 통한 빠른 가입/로그인
- **이메일 기반 인증**: 이메일/비밀번호 가입 및 로그인
- **비밀번호 복구**: Forgot password 및 Update password 기능
- **세션 관리**: 쿠키 기반 세션 관리로 보안성 확보

### 2.2 그룹 관리
- **그룹 생성**: 사용자가 새로운 그룹 생성 가능
- **그룹 조회**: 사용자가 속한 모든 그룹 목록 조회
- **그룹 상세 페이지**: 그룹 정보 및 멤버 조회
- **그룹 수정/삭제**: 그룹 소유자의 그룹 관리 기능

### 2.3 이벤트 관리
- **이벤트 생성**: 그룹 내에서 이벤트 생성 가능
- **이벤트 조회**: 그룹별 이벤트 목록 조회
- **이벤트 상세 정보**: 이벤트 세부 정보 및 참석자 확인
- **이벤트 수정/삭제**: 이벤트 관리자 권한으로 관리

### 2.4 사용자 프로필
- **프로필 조회**: 사용자 기본 정보 확인
- **프로필 수정**: 사용자 정보 업데이트 (계획)

### 2.5 UI/UX
- **다크 모드 지원**: 시스템 설정 기반 자동 테마 전환
- **반응형 디자인**: 모바일, 태블릿, 데스크톱 대응
- **shadcn/ui 컴포넌트**: 접근성 높은 UI 컴포넌트 제공

## 3. 사용자 요구사항

### 3.1 주요 사용자 페르소나
- **일반 사용자**: 그룹을 생성하고 이벤트를 관리하고자 하는 개인
- **그룹 리더**: 그룹을 주도적으로 관리하는 사용자
- **이벤트 참석자**: 그룹 내 이벤트에 참석하는 사용자

### 3.2 사용자 시나리오
1. Google 계정으로 빠르게 로그인
2. 새로운 그룹 생성
3. 그룹에 이벤트 추가
4. 그룹 멤버와 이벤트 공유
5. 프로필에서 나의 정보 확인

## 4. 기술 스택

| 항목 | 기술 |
|------|------|
| 프론트엔드 | Next.js 16.2.6, React 19, TypeScript |
| 백엔드 | Next.js App Router, Supabase |
| 인증 | Supabase Auth (Google OAuth, Email) |
| 데이터베이스 | PostgreSQL (Supabase) |
| 스타일링 | Tailwind CSS, shadcn/ui |
| 테마 관리 | next-themes |
| 아이콘 | Lucide React |
| 배포 | Vercel |

## 5. 데이터 모델 (계획)

### 5.1 Users 테이블
```
- id (UUID, PK)
- email (string, unique)
- name (string)
- avatar_url (string, nullable)
- created_at (timestamp)
- updated_at (timestamp)
```

### 5.2 Groups 테이블
```
- id (UUID, PK)
- owner_id (UUID, FK to Users)
- name (string)
- description (string, nullable)
- image_url (string, nullable)
- created_at (timestamp)
- updated_at (timestamp)
```

### 5.3 Group Members 테이블
```
- id (UUID, PK)
- group_id (UUID, FK to Groups)
- user_id (UUID, FK to Users)
- role (enum: admin, member)
- joined_at (timestamp)
```

### 5.4 Events 테이블
```
- id (UUID, PK)
- group_id (UUID, FK to Groups)
- created_by (UUID, FK to Users)
- title (string)
- description (string, nullable)
- event_date (timestamp)
- location (string, nullable)
- max_attendees (integer, nullable)
- created_at (timestamp)
- updated_at (timestamp)
```

### 5.5 Event Attendees 테이블
```
- id (UUID, PK)
- event_id (UUID, FK to Events)
- user_id (UUID, FK to Users)
- status (enum: attending, maybe, not_attending)
- joined_at (timestamp)
```

## 6. API 엔드포인트 (계획)

### 6.1 인증
- `POST /api/auth/login` - 로그인
- `POST /api/auth/signup` - 회원가입
- `POST /api/auth/logout` - 로그아웃
- `POST /api/auth/forgot-password` - 비밀번호 복구

### 6.2 그룹
- `GET /api/groups` - 사용자 그룹 목록 조회
- `POST /api/groups` - 그룹 생성
- `GET /api/groups/:id` - 그룹 상세 조회
- `PUT /api/groups/:id` - 그룹 수정
- `DELETE /api/groups/:id` - 그룹 삭제
- `GET /api/groups/:id/members` - 그룹 멤버 조회

### 6.3 이벤트
- `GET /api/groups/:groupId/events` - 그룹 이벤트 목록 조회
- `POST /api/groups/:groupId/events` - 이벤트 생성
- `GET /api/groups/:groupId/events/:id` - 이벤트 상세 조회
- `PUT /api/groups/:groupId/events/:id` - 이벤트 수정
- `DELETE /api/groups/:groupId/events/:id` - 이벤트 삭제

### 6.4 프로필
- `GET /api/profile` - 사용자 프로필 조회
- `PUT /api/profile` - 사용자 프로필 수정

## 7. 성공 기준

- ✅ Google OAuth 인증 기능 완성
- ✅ 그룹 생성/조회 기능 구현
- ✅ 이벤트 생성/조회 기능 구현
- ✅ 사용자 프로필 페이지 구현
- ⏳ 이벤트 참석자 관리 기능 구현
- ⏳ 그룹 멤버 초대 기능 구현
- ⏳ 실시간 알림 기능 구현
- ⏳ 모바일 앱 버전 출시

## 8. 제약사항 및 고려사항

- Supabase Row-Level Security (RLS) 정책으로 데이터 보안 확보
- 환경 변수 관리 (`.env.local`)를 통한 설정 분리
- Vercel 배포 환경에서의 쿠키 기반 세션 관리
- 다크 모드 지원을 위한 클라이언트/서버 렌더링 조화

## 9. 타임라인

| 단계 | 기간 | 목표 |
|------|------|------|
| Phase 1 | 완료 | 인증 및 기본 UI 구축 |
| Phase 2 | 진행 중 | 그룹/이벤트 관리 기능 |
| Phase 3 | 계획 중 | 고급 기능 (참석자 관리, 초대, 알림) |
| Phase 4 | 계획 중 | 성능 최적화 및 배포 |

## 10. 참고자료

- [Next.js App Router 문서](https://nextjs.org/docs/app)
- [Supabase 공식 문서](https://supabase.com/docs)
- [shadcn/ui 컴포넌트](https://ui.shadcn.com)
- [Tailwind CSS](https://tailwindcss.com)
