# Implementation

> [SPEC.md](./SPEC.md)의 목표를 현재 코드와 앞으로의 구조로 어떻게 구현할지 기록한다.

## Runtime and tooling

- Vite + React + TypeScript
- pnpm 패키지 관리
- `mise.toml`로 Node.js와 pnpm 버전 고정
- CSS/SVG를 기본 렌더링 수단으로 사용
- GSAP과 Three.js는 복잡한 스크롤 연출이나 3D 장면이 실제로 필요할 때 단계적으로 도입
- GitHub Pages 정적 배포

```bash
mise install
pnpm install
pnpm dev
pnpm build
```

## Source layout

- `src/FallIntro.tsx` — 메인 프롤로그와 01 소개 페이지의 상태·스크롤 계산
- `src/fall-intro.css` — 유리 낙하 장면, 01 배경, 캐릭터 보행, 키네틱 타이포, Contact Dock
- `src/EducationJourney.tsx` — 02 학력 페이지의 교정 구성과 스크롤 진행률 계산
- `src/education-journey.css` — CNSA 컬러, 학교 건물, 벚꽃, 학력 타이포와 반응형 표현
- `public/assets/characters/kiwi-walk-cycle.png` — 3-C를 기준으로 만든 4프레임 보행 스프라이트
- `src/EggLab.tsx`, `src/GlassLab.tsx`, `src/BirdLab.tsx` — 시안 비교를 위해 남긴 실험 페이지
- `src/App.tsx` — 메인과 `?view=eggs|glass|birds|journey` 실험 뷰 진입점

## Interaction model

### Egg state machine

1. `idle`: 낙하 루프를 보여주고 첫 하향 제스처를 기다린다.
2. `descending`: 제스처를 한 번의 트리거로 사용해 자동 착지 시퀀스를 실행한다.
3. `landed`: 흔들림과 균열을 재생한다.
4. `ready`: 문서 높이를 확장해 다음 페이지로 실제 스크롤할 수 있게 한다.

스크롤바가 뒤늦게 생겨도 가로 레이아웃이 움직이지 않도록 풀 블리드 장면을 viewport 폭으로 유지하고 문서의 가로 초과분을 잘라낸다. 별도의 흰 scrollbar gutter를 미리 예약하지 않는다.

### Introduction scroll track

- 알 페이지와 소개 페이지를 DOM에서 세로로 바로 연결한다.
- 소개 페이지는 긴 스크롤 트랙 안에서 화면에 고정되고, 트랙 진행률을 `0..1`로 정규화한다.
- 같은 진행률로 다음 값을 계산한다.
  - 키위의 X 위치
  - 4프레임 보행 스프라이트 인덱스, 바운스와 기울기
  - 세 문장의 등장, 블러 해제, 중앙 배치, 축소와 최종 위치
  - 해·구름·언덕의 패럴랙스
  - 하단 진행선과 Contact Dock 노출
- 애니메이션 시간을 독립적으로 흘려보내지 않고 스크롤 값에서 매 프레임을 파생해 멈춤과 역방향 스크롤을 지원한다.
- 데스크톱 최종 위치는 각 문장의 실제 렌더 폭을 기준으로 동일한 간격을 계산한다.
- 모바일에서는 세 문장의 최종 X축을 맞추고 Y축으로 쌓아 긴 영문 직함이 화면 밖으로 나가지 않게 한다.

### Education scroll track

- 01 바로 아래에 별도의 긴 트랙과 sticky 무대를 배치해 실제 문서 스크롤 흐름을 유지한다.
- CNSA 공식 UI의 `CNSA Navy #005DAA`, `CNSA Blue #007DC3`, `CNSA Sky #13B5EA`를 학교 장면의 기준색으로 사용한다.
- 교정은 코드로 만든 2D 건물, 운동장 경계, 캠퍼스 길과 벚나무 실루엣으로 구성해 외부 이미지 로딩에 의존하지 않는다.
- 학교 입학·IT 과정·프로젝트·대학 진학 문구는 진행률 구간별로 등장, 정착, 퇴장한다.
- 벚꽃잎은 각 꽃잎의 고정 seed와 현재 진행률로 X/Y/회전값을 계산해 역방향 스크롤에서도 같은 상태로 돌아간다.
- 4프레임 키위 보행 스프라이트를 재사용하되 학교 배경과의 대비를 위해 크기와 그림자를 장면별로 조정한다.
- 모바일에서는 학교 건물을 단순화하고 큰 문구를 세로로 재배치하며, 꽃잎 수와 레이어 크기를 줄이지 않고 화면 밖 overflow만 잘라 밀도를 유지한다.

## Visual system

### Prologue

- CSS gradient, blur, backdrop filter와 SVG를 조합해 유리 하늘·구름·지면을 표현한다.
- 알은 Milk Glass의 불투명한 흰색과 내부 하이라이트를 유지한다.
- 낙하 이펙트는 착지 과정에서 단계적으로 사라지고 균열은 평범한 회색 선으로 남는다.

### 2D journey

- 따뜻한 종이색, 옅은 민트 하늘, 낮은 채도의 언덕을 기본 무대로 사용한다.
- 3-C의 키 큰 측면형 키위를 일관된 기본 외형으로 사용한다.
- 캐릭터 외형을 경력마다 다시 만들기보다 보행 리그를 재사용하고 소품·행동·색상·배경을 교체한다.
- Manrope와 DM Mono를 조합해 큰 키네틱 문장과 작은 에디토리얼 메타 정보를 구분한다.
- 장면마다 팔레트와 배경 문법은 바꾸되 동일한 보행 방향, 챕터 번호, 진행선으로 하나의 여정임을 유지한다.

## Chapter extension strategy

경력 챕터는 공통 `scroll track + sticky stage + progress-derived motion` 패턴을 사용한다.

각 챕터가 제공해야 할 데이터는 다음과 같다.

- 회사와 기간
- 역할
- 한 문장 요약
- 대표 프로젝트 또는 기여
- 장면 테마와 배경 팔레트
- 키위의 소품과 행동
- 다음 챕터로 이동하는 출구 동작

화이트블록에서는 바이크 배달, FETCHING에서는 명품 아이템과 크롤링/수집의 움직임을 첫 재사용 사례로 만든다.

## Accessibility and performance

- 의미 있는 섹션에는 한국어 `aria-label`을 제공한다.
- 장식 요소는 `aria-hidden`으로 제외한다.
- Contact Dock은 실제 앵커와 `mailto:`를 사용한다.
- `prefers-reduced-motion`에서 긴 자동 루프를 줄이거나 정적인 대표 상태를 제공해야 한다.
- 생성 이미지와 큰 실험용 번들은 실제 메인 경로에 필요한 범위만 로드한다.

## Build and deployment

- 소스 브랜치: `develop`
- 배포 브랜치: `master`
- `develop` push 시 pnpm lockfile 기준으로 설치하고 `pnpm build`를 실행한다.
- Vite 산출물인 `dist/`만 `master`에 게시한다.
- `master`는 생성물 전용이므로 직접 수정하지 않는다.
- `.github/workflows/auto-publish.yml`에서 `actions/checkout@v6`과 `jdx/mise-action@v4.2.4`로 `mise.toml`의 도구 버전을 설치한다.
- `peaceiris/actions-gh-pages@v4`가 `dist/`를 orphan `master`로 게시하고 `.nojekyll`을 생성한다.
- workflow는 `contents: write`만 요청하고, 동시 배포가 발생하면 이전 실행을 취소한다.

## Verification

변경 위험에 따라 다음을 수행한다.

1. `pnpm build`
2. `git diff --check`
3. 데스크톱과 모바일 실제 렌더 캡처
4. 스크롤 주요 진행률별 캐릭터·문구 위치 확인
5. 외부 링크와 키보드 접근 확인
6. 배포 변경 시 workflow 구문과 GitHub Pages 결과 확인
