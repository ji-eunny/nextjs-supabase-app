# 개발 로드맵 (Development Roadmap)

## 개요

Next.js + Supabase 그룹/이벤트 관리 플랫폼의 단계별 개발 계획입니다.

---

## Phase 1: 기초 구축 및 인증 (완료)

**목표**: 인증 시스템 및 기본 UI 프레임워크 구축

### ✅ Task 001: 프로젝트 초기 설정
- [x] Next.js 프로젝트 생성 (App Router)
- [x] Tailwind CSS 및 shadcn/ui 설정
- [x] TypeScript 설정
- [x] 디렉토리 구조 구축
- **커밋**: `50fdf42`

### ✅ Task 002: Supabase 설정
- [x] Supabase 클라이언트 설정 (client.ts, server.ts)
- [x] 환경 변수 설정 (.env.local)
- [x] Row-Level Security (RLS) 정책 검토
- **커밋**: `b76064f`

### ✅ Task 003: 인증 시스템 구현
- [x] Google OAuth 로그인 기능
- [x] 이메일 기반 회원가입
- [x] 로그인/로그아웃 기능
- [x] 비밀번호 복구 (Forgot Password)
- [x] 비밀번호 변경 (Update Password)
- [x] 보호된 페이지 (Protected Routes)
- [x] 세션 관리 (쿠키 기반)
- **커밋**: `234c890`

### ✅ Task 004: UI 기본 컴포넌트 구축
- [x] 헤더/네비게이션 컴포넌트
- [x] 인증 버튼 컴포넌트
- [x] 로그인/회원가입 폼
- [x] 다크 모드 지원 (next-themes)
- [x] 기본 레이아웃 구성

---

## Phase 2: 그룹/이벤트 관리 기능 (진행 중)

**목표**: 핵심 비즈니스 로직 구현 및 데이터 관리

### ⏳ Task 201: 데이터베이스 스키마 설계
- [ ] Users 테이블 생성
- [ ] Groups 테이블 생성
- [ ] Group Members 테이블 생성
- [ ] Events 테이블 생성
- [ ] Event Attendees 테이블 생성
- [ ] 외래 키 관계 설정
- [ ] RLS 정책 적용
- **예상 기간**: 2-3일
- **담당자**: Backend Developer

### ⏳ Task 202: 그룹 관리 API 구현
- [ ] 그룹 생성 (POST /api/groups)
- [ ] 그룹 목록 조회 (GET /api/groups)
- [ ] 그룹 상세 조회 (GET /api/groups/:id)
- [ ] 그룹 수정 (PUT /api/groups/:id)
- [ ] 그룹 삭제 (DELETE /api/groups/:id)
- [ ] 그룹 멤버 조회 (GET /api/groups/:id/members)
- **예상 기간**: 3-4일
- **담당자**: Backend Developer
- **의존사항**: Task 201

### ⏳ Task 203: 그룹 UI 페이지 구현
- [ ] 그룹 목록 페이지 (`/protected/groups`)
- [ ] 그룹 생성 페이지 (`/protected/groups/new`)
- [ ] 그룹 상세 페이지 (`/protected/groups/:id`)
- [ ] 그룹 멤버 목록 표시
- [ ] 그룹 수정 폼
- [ ] 그룹 삭제 모달
- **예상 기간**: 3-4일
- **담당자**: Frontend Developer
- **의존사항**: Task 202

### ⏳ Task 204: 이벤트 관리 API 구현
- [ ] 이벤트 생성 (POST /api/groups/:groupId/events)
- [ ] 이벤트 목록 조회 (GET /api/groups/:groupId/events)
- [ ] 이벤트 상세 조회 (GET /api/groups/:groupId/events/:id)
- [ ] 이벤트 수정 (PUT /api/groups/:groupId/events/:id)
- [ ] 이벤트 삭제 (DELETE /api/groups/:groupId/events/:id)
- **예상 기간**: 3-4일
- **담당자**: Backend Developer
- **의존사항**: Task 201

### ⏳ Task 205: 이벤트 UI 페이지 구현
- [ ] 이벤트 목록 페이지 (그룹 내)
- [ ] 이벤트 생성 페이지 (`/protected/groups/:id/events/new`)
- [ ] 이벤트 상세 페이지 (`/protected/groups/:id/events/:id`)
- [ ] 이벤트 수정 폼
- [ ] 이벤트 삭제 모달
- [ ] 이벤트 필터링/정렬 기능
- **예상 기간**: 3-4일
- **담당자**: Frontend Developer
- **의존사항**: Task 204

### ⏳ Task 206: 사용자 프로필 페이지
- [ ] 프로필 조회 페이지 (`/protected/profile`)
- [ ] 사용자 정보 표시
- [ ] 프로필 이미지 업로드
- [ ] 프로필 정보 수정 기능
- [ ] 프로필 수정 폼
- **예상 기간**: 2-3일
- **담당자**: Full-stack Developer
- **의존사항**: Task 202

---

## Phase 3: 고급 기능 (계획 중)

**목표**: 사용자 경험 향상 및 협업 기능 추가

### ◻️ Task 301: 이벤트 참석자 관리
- [ ] 이벤트 참석자 API 구현
- [ ] 참석 상태 관리 (attending, maybe, not_attending)
- [ ] 이벤트 참석자 목록 UI
- [ ] 참석 상태 변경 기능
- **예상 기간**: 2-3일
- **의존사항**: Task 204

### ◻️ Task 302: 그룹 멤버 초대 기능
- [ ] 그룹 초대 API 구현
- [ ] 초대 링크 생성
- [ ] 초대 상태 관리
- [ ] 멤버 초대 UI
- [ ] 초대 거절/수락 기능
- **예상 기간**: 3-4일
- **의존사항**: Task 202

### ◻️ Task 303: 실시간 알림 기능
- [ ] Supabase Realtime 연동
- [ ] 이벤트 알림 시스템
- [ ] 그룹 알림 시스템
- [ ] 알림 센터 UI
- [ ] 알림 읽음/삭제 기능
- **예상 기간**: 4-5일
- **의존사항**: Task 202, Task 204

### ◻️ Task 304: 검색 및 필터 기능
- [ ] 그룹 검색 기능
- [ ] 이벤트 필터링 (날짜, 위치 등)
- [ ] 고급 검색 UI
- [ ] 검색 성능 최적화
- **예상 기간**: 2-3일
- **의존사항**: Task 203, Task 205

### ◻️ Task 305: 파일 업로드 기능
- [ ] Supabase Storage 연동
- [ ] 이미지 업로드 (프로필, 그룹, 이벤트)
- [ ] 이미지 최적화 (리사이징, 포맷 변환)
- [ ] 업로드 진행률 표시
- [ ] 파일 삭제 기능
- **예상 기간**: 3-4일

### ◻️ Task 306: 소셜 기능
- [ ] 사용자 프로필 공개 기능
- [ ] 팔로우 시스템
- [ ] 공개 그룹 피드
- [ ] 활동 타임라인
- **예상 기간**: 4-5일

---

## Phase 4: 성능 최적화 및 배포 (계획 중)

**목표**: 프로덕션 준비 및 배포

### ◻️ Task 401: 성능 최적화
- [ ] 번들 크기 최적화
- [ ] 이미지 최적화 (Next.js Image)
- [ ] 코드 스플리팅 적용
- [ ] 캐싱 전략 수립
- [ ] 데이터베이스 쿼리 최적화 (인덱스 추가)
- [ ] 로딩 시간 모니터링
- **예상 기간**: 3-4일

### ◻️ Task 402: 테스트 작성
- [ ] Unit 테스트 (Jest)
- [ ] Integration 테스트
- [ ] E2E 테스트 (Playwright/Cypress)
- [ ] API 테스트
- **예상 기간**: 5-7일

### ◻️ Task 403: 보안 강화
- [ ] CORS 설정 검토
- [ ] 환경 변수 보안 확인
- [ ] SQL Injection 방지 (Parameterized Queries)
- [ ] XSS 방지 검토
- [ ] CSRF 토큰 검토
- [ ] Rate Limiting 구현
- **예상 기간**: 2-3일

### ◻️ Task 404: 배포 및 CI/CD
- [ ] GitHub Actions 워크플로우 설정
- [ ] Vercel 배포 자동화
- [ ] 환경별 배포 설정 (.env 분리)
- [ ] 배포 전 체크리스트 구성
- [ ] 롤백 전략 수립
- **예상 기간**: 2-3일

### ◻️ Task 405: 모니터링 및 로깅
- [ ] Sentry 에러 트래킹 설정
- [ ] 성능 모니터링 (Vercel Analytics)
- [ ] 사용자 분석 (Google Analytics)
- [ ] 로그 수집 및 분석
- **예상 기간**: 2일

---

## Phase 5: 추가 기능 및 확장 (백로그)

### 향후 고려 사항
- 모바일 앱 버전 (React Native)
- 캘린더 뷰 (이벤트 캘린더)
- 이메일 알림 통합
- SMS 알림 기능
- 결제 시스템 (프리미엄 기능)
- 그룹 채팅 기능
- 투표/설문 기능
- 지도 통합 (이벤트 위치)
- 다국어 지원 (i18n)
- 접근성 강화 (a11y)

---

## 진행 현황 요약

| Phase | 상태 | 진행률 |
|-------|------|--------|
| Phase 1 | ✅ 완료 | 100% |
| Phase 2 | ⏳ 진행 중 | 5% |
| Phase 3 | ◻️ 계획 중 | 0% |
| Phase 4 | ◻️ 계획 중 | 0% |
| Phase 5 | ◻️ 백로그 | 0% |

---

## 주의사항 및 고려사항

1. **데이터베이스**: Phase 2 시작 전에 데이터베이스 스키마 설계 완료 필수
2. **보안**: 각 Task에서 RLS 정책 및 권한 관리 필수
3. **테스트**: 각 기능 완성 후 테스트 코드 작성
4. **문서화**: API 변경 시 문서 업데이트
5. **성능**: 큰 데이터셋 처리 시 페이지네이션 적용
6. **에러 처리**: 모든 API 호출에 에러 처리 로직 추가

---

## 마지막 업데이트

- **최종 수정**: 2026-06-01
- **작성자**: Development Team
- **버전**: 1.0
