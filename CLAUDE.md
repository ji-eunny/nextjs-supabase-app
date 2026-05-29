# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## 프로젝트 개요

Next.js와 Supabase를 기반으로 한 풀스택 스타터 킷입니다. Next.js 13+ App Router, Supabase Auth, Tailwind CSS, shadcn/ui를 포함합니다.

## 자주 사용하는 명령어

```bash
# 개발 서버 시작 (http://localhost:3000)
npm run dev

# 프로덕션 빌드
npm run build

# 프로덕션 서버 실행
npm run start

# ESLint 실행
npm run lint
```

## 환경 설정

프로젝트 실행 전에 Supabase 환경 변수를 설정해야 합니다:

1. `.env.example`을 `.env.local`로 복사
2. 다음 변수들을 입력:
   - `NEXT_PUBLIC_SUPABASE_URL`: Supabase 프로젝트 URL
   - `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY`: Supabase 공개 키 (publishable 또는 legacy anon 키 모두 사용 가능)

## 아키텍처

### 디렉토리 구조

```
app/                    # Next.js App Router
├── auth/               # 인증 관련 페이지 (login, sign-up, forgot-password 등)
├── protected/          # 인증 필요한 보호 페이지
├── page.tsx            # 홈 페이지
└── layout.tsx          # 루트 레이아웃 (ThemeProvider, 메타데이터)

components/            # React 컴포넌트
├── auth-button.tsx     # 인증 버튼 (로그인/로그아웃)
├── ui/                 # shadcn/ui 컴포넌트 (button, card, input 등)
└── tutorial/           # 튜토리얼 관련 컴포넌트

lib/                   # 유틸리티 함수
├── supabase/           # Supabase 클라이언트 설정
│   ├── client.ts       # 브라우저 클라이언트 (createBrowserClient)
│   ├── server.ts       # 서버 클라이언트 (createServerClient with cookies)
│   └── proxy.ts        # Route Handler 프록시
└── utils.ts            # 클래스명 병합 등 유틸

types/                 # TypeScript 타입 정의
```

### Supabase 클라이언트 아키텍처

프로젝트는 실행 환경에 따라 다른 클라이언트를 사용합니다:

- **Client Components** (`lib/supabase/client.ts`): `createBrowserClient` 사용
- **Server Components & Route Handlers** (`lib/supabase/server.ts`): `createServerClient` 사용 (쿠키 기반)
- **Middleware & 특수 케이스** (`lib/supabase/proxy.ts`): Route Handler 프록시 사용

⚠️ **중요**: 서버 컴포넌트에서 매번 `createClient()`를 호출해야 합니다. 전역 변수에 저장하면 Fluid Compute 환경에서 문제가 발생할 수 있습니다.

### 인증 흐름

1. **로그인/회원가입**: `components/login-form.tsx`, `components/sign-up-form.tsx`
2. **인증 콜백**: `app/auth/confirm/route.ts` (OAuth/메일 링크 확인)
3. **에러 처리**: `app/auth/error/page.tsx`
4. **보호된 페이지**: `app/protected/layout.tsx`에서 세션 확인

### UI 프레임워크

- **Tailwind CSS**: 스타일링
- **shadcn/ui**: 컴포넌트 라이브러리 (Radix UI 기반)
- **next-themes**: 다크 모드 지원 (`ThemeProvider` in `app/layout.tsx`)

## TypeScript 설정

- 엄격한 타입 체크 활성화 (`strict: true`)
- 경로 별칭: `@/*` → 프로젝트 루트
- 명확한 파일명 정렬: `forceConsistentCasingInFileNames: true`

## 주요 의존성

| 패키지 | 목적 |
|--------|------|
| `@supabase/ssr` | 쿠키 기반 Supabase 인증 |
| `@supabase/supabase-js` | Supabase 클라이언트 SDK |
| `next-themes` | 다크 모드 관리 |
| `@radix-ui/*` | 접근성 높은 UI 프리미티브 |
| `tailwindcss` | CSS 유틸리티 프레임워크 |
| `lucide-react` | SVG 아이콘 라이브러리 |

## 일반적인 개발 작업

### 새로운 보호된 페이지 추가

1. `app/protected/` 아래에 새 디렉토리 생성
2. 레이아웃에서 세션 확인 로직 적용 (기존 `app/protected/layout.tsx` 참고)
3. 서버 컴포넌트에서 필요시 `lib/supabase/server.ts`의 `createClient()` 사용

### UI 컴포넌트 추가

shadcn/ui에서 제공하는 컴포넌트 추가:

```bash
npx shadcn-ui@latest add button
```

`components.json` 설정으로 스타일 커스터마이징 가능합니다.

### Supabase 데이터 조회

서버 컴포넌트:
```typescript
const supabase = await createClient();
const { data, error } = await supabase.from('table').select();
```

클라이언트 컴포넌트: `lib/supabase/client.ts`의 `createClient()` 사용 후 동일

## 배포

**Vercel 배포** (권장):
- Supabase Vercel Integration 사용
- 환경 변수 자동 설정

**일반 배포**:
- 수동으로 `NEXT_PUBLIC_SUPABASE_URL`과 `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY` 설정
- `npm run build && npm run start` 실행

## 로컬 개발 팁

Supabase를 로컬에서 실행하려면:

```bash
npx supabase start
```

[Supabase 로컬 개발 가이드](https://supabase.com/docs/guides/getting-started/local-development) 참고
