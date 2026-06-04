---
name: smart-commit
description: 변경 사항을 자동으로 분석하고 적절한 커밋 타입을 결정하여 커밋해주는 스킬
---

변경된 파일들을 분석하여 자동으로 적절한 커밋을 생성합니다.

## 지원하는 커밋 타입

### Conventional Commit 형식

| 타입 | 설명 | 예시 |
|------|------|------|
| **feat** | 새로운 기능 추가 | `feat: 사용자 인증 기능 추가` |
| **fix** | 버그 수정 | `fix: 모임 삭제 API 404 에러 해결` |
| **refactor** | 코드 구조 개선 (기능 변화 없음) | `refactor: 컴포넌트 로직 단순화` |
| **style** | 코드 스타일 변경 (포맷, 세미콜론 등) | `style: ESLint 규칙 적용` |
| **docs** | 문서 수정 | `docs: README 업데이트` |
| **test** | 테스트 코드 추가/수정 | `test: 로그인 기능 테스트 추가` |
| **chore** | 의존성, 빌드, CI 설정 등 | `chore: 패키지 업그레이드` |
| **perf** | 성능 개선 | `perf: API 응답 속도 최적화` |

## 커밋 타입 결정 규칙

### 1. **feat** - 새로운 기능
- 새로운 파일 추가 (app/api/*, components/*)
- 새로운 라우트 추가
- 새로운 함수/컴포넌트 구현

### 2. **fix** - 버그 수정
- 에러 처리 추가
- 예기치 않은 동작 수정
- API 응답 코드 수정 (404 → 200 등)
- 로직 오류 수정

### 3. **refactor** - 구조 개선
- 코드 로직 재구성 (기능 동일)
- 중복 코드 제거
- 함수명/변수명 변경
- 컴포넌트 분리

### 4. **style** - 코드 스타일
- 포맷팅 변경
- 들여쓰기, 공백 수정
- Prettier/ESLint 적용

### 5. **docs** - 문서
- CLAUDE.md, README 수정
- 주석 추가
- SKILL.md 등 문서 파일

### 6. **test** - 테스트
- 테스트 파일 추가/수정
- 테스트 케이스 작성

### 7. **chore** - 자잘한 작업
- package.json 버전 업그레이드
- 빌드 설정 변경
- CI/CD 파일 수정
- .gitignore 수정

### 8. **perf** - 성능
- 렌더링 최적화
- 쿼리 최적화
- 번들 크기 축소

## 커밋 메시지 포맷

```
<type>: <subject>

<body>

<footer>
```

### subject (제목)
- 50자 이하
- 명령조로 시작 ("추가" 아닌 "추가해줘" 대신 "추가")
- 마침표 없음
- 한국어 또는 영어

### body (본문, 선택사항)
- 어떻게보다 "무엇"과 "왜"를 설명
- 문단으로 구분
- 한국어로 작성

### footer (바닥글, 선택사항)
- 관련 이슈 참조: `Closes #123`
- Breaking change 기록

## 실행 방법

```bash
/smart-commit
```

또는 구체적인 메시지를 지정:

```bash
/smart-commit "fix: API 에러 처리 개선"
```

## 동작 과정

1. ✅ `git status` 실행으로 변경된 파일 확인
2. ✅ `git diff` 분석으로 변경 내용 파악
3. ✅ 파일 확장자, 위치, 내용으로 커밋 타입 결정
4. ✅ 여러 타입이 섞여있으면 주요 타입으로 통합
5. ✅ 적절한 커밋 메시지 생성
6. ✅ 자동으로 커밋 실행
7. ✅ 커밋 결과 출력

## 예시

### 시나리오 1: 새 기능 추가
```
변경된 파일: app/api/groups/[groupId]/route.ts (새 파일)

→ 타입: feat
→ 메시지: "feat: 모임 조회/수정/삭제 API 엔드포인트 구현"
```

### 시나리오 2: 버그 수정
```
변경된 파일: 
- app/protected/groups/[groupId]/events/new/page.tsx
- app/protected/groups/[groupId]/events/[eventId]/page.tsx

→ 타입: fix
→ 메시지: "fix: 동적 params Promise 처리 및 타입 오류 해결"
```

### 시나리오 3: 버그 수정 + 기능 개선
```
변경된 파일:
- app/protected/groups/[groupId]/edit/page.tsx (기능 추가)
- app/api/groups/[groupId]/route.ts (수정)

→ 주요 타입: fix (DELETE/PATCH API 기능)
→ 메시지: "fix: 모임 수정/삭제 기능 구현 및 API 개선"
```

## 주의사항

- ⚠️ 기존 커밋은 수정하지 않음 (새 커밋 생성)
- ⚠️ 스킬 실행 전 변경 사항 확인 필수
- ⚠️ 민감한 파일 포함 시 경고
- ⚠️ 대규모 변경은 여러 개의 작은 커밋으로 분리 권장
