# AGENTS.md

이 저장소에서 작업하는 모든 에이전트는 구현 전에 프로젝트 문서를 먼저 정리하고, 구현 후 현실과 문서의 차이를 다시 반영한다.

## Canonical documents

1. [SPEC.md](./SPEC.md) — 제품의 목적, 사용자 경험, 이야기와 품질 기준
2. [IMPLEMENTATION.md](./IMPLEMENTATION.md) — SPEC을 달성하기 위한 현재 기술 구조와 구현 전략
3. [TODO.md](./TODO.md) — 목표와 실제 구현 사이의 미해결 차이
4. [CONTEXT.md](./CONTEXT.md) — 인물 정보, 대화 맥락, 결정 이력, 레퍼런스와 열린 질문

문서가 충돌하면 사용자 최신 지시가 가장 우선하며, 그다음 `SPEC → IMPLEMENTATION → TODO → CONTEXT` 순서로 해석한다.

## Required workflow

### Before implementation

1. `AGENTS.md`와 요청에 관련된 네 문서를 읽는다.
2. 최신 사용자 요청이 기존 목표나 사실을 바꾸는지 확인한다.
3. 목표가 바뀌면 코드보다 먼저 `SPEC.md`를 수정한다.
4. 구현 전략이 바뀌면 코드보다 먼저 `IMPLEMENTATION.md`를 수정한다.
5. 새 사실, 레퍼런스, 디자인 선호가 생기면 `CONTEXT.md`에 기록한다.
6. 현재 구현이 목표를 만족하지 못하는 부분은 `TODO.md`에 추가하거나 우선순위를 바꾼다.
7. 문서 정리가 끝난 뒤 작업 범위와 검증 방법을 정하고 구현을 시작한다.

문구 수정처럼 목표나 구조에 영향을 주지 않는 작은 변경은 관련 문서의 사실이 틀려지는 경우에만 선행 수정한다.

### During implementation

- `SPEC.md`에는 코드, 클래스명, 타이밍 상수 같은 구현 디테일을 넣지 않는다.
- 구현 중 발견한 제약이나 브라우저 차이는 `TODO.md`에 기록한다.
- 사용자가 제공한 사실과 중요한 선택 이유는 `CONTEXT.md`에 남긴다.
- 구현이 문서와 달라져야 한다면 조용히 우회하지 말고 관련 문서를 먼저 갱신한다.

### After implementation

1. 변경 위험에 맞는 빌드, 정적 검사, 실제 렌더 검증을 수행한다.
2. 완료된 괴리는 `TODO.md`에서 제거하거나 완료 처리한다.
3. 실제 구조가 달라졌다면 `IMPLEMENTATION.md`를 현재 상태로 고친다.
4. 새 결정과 후속 질문은 `CONTEXT.md`에 추가한다.
5. 최종 응답에 변경 내용, 검증 결과, 커밋을 간결하게 남긴다.

## Document ownership

- 목적과 경험이 바뀜 → `SPEC.md`
- 코드 구조, 상태 흐름, 배포 방법이 바뀜 → `IMPLEMENTATION.md`
- 아직 못 했거나 검증되지 않음 → `TODO.md`
- 작업에 도움이 되는 원자료와 결정 이유 → `CONTEXT.md`

같은 내용을 네 문서에 복제하지 말고, 필요한 경우 링크로 연결한다.

## Git

- Commit messages must use `{type}: {message}`.
- Keep the `type` lowercase and concise.
- Write the `message` as an imperative, specific summary.
- `develop`은 소스 브랜치다.
- GitHub Pages는 `develop` push에서 실행되는 GitHub Actions workflow가 `dist/` artifact를 직접 배포한다.
- `master`는 과거 branch 기반 Pages 배포에 쓰인 보존 브랜치다. 현재 배포 소스로 사용하거나 직접 편집·삭제하지 않는다.
- `archive/20260808`은 기존 Gatsby 사이트 보존 브랜치다.

## Tooling

- 패키지 매니저는 pnpm을 사용한다.
- Node.js와 pnpm 버전은 `mise.toml`을 기준으로 한다.
- 기본 검증은 `pnpm build`와 `git diff --check`다.
- 사용자 변경을 덮어쓰거나 관련 없는 dirty worktree 파일을 수정하지 않는다.
