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
- `src/CareerJourney.tsx` — 03 화이트블록부터 06 당근까지 네 경력 트랙의 공통 진행률과 회사별 장면 구조
- `src/career-journey.css` — 배달 도로, 명품 쇼윈도, 성장하는 농장, 동네 지도와 회사별 반응형 모션
- `src/TossOngoing.tsx`, `src/toss-ongoing.css` — 07 Toss·Toss Income을 상세 콘텐츠 전까지 현재진행형 상태로 보여주는 독립 트랙
- `public/assets/brands/toss-symbol-primary.png` — 공식 브랜드 리소스의 Toss 심벌을 화면 표시 크기에 맞게 축소한 무변형 래스터 자산
- `src/ContactFinale.tsx`, `src/contact-finale.css` — 현재 여정 끝의 실제 터미널형 Contact 피날레와 스크롤·포인터 반응
- `public/assets/characters/kiwi-walk-cycle.png` — 3-C를 기준으로 만든 4프레임 보행 스프라이트
- `public/assets/characters/kiwi-graduate-walk-cycle.png` — 기본 보행 실루엣과 프레임 간격을 유지하면서 학사모를 일체화한 Education 전용 4프레임 스프라이트
- `public/assets/characters/kiwi-*.png` — 배달부·패션 큐레이터·농부·동네 탐험가로 변주한 투명 배경 캐릭터
- `public/favicon-*.png`, `public/favicon.ico`, `public/apple-touch-icon.png` — Graphite 팔레트의 `>_` 프롬프트 마크에서 파생한 브라우저·홈 화면 아이콘 세트
- `public/og-image.png` — `$ whoami`, `whitekiwi`, 이름과 역할을 크림색 미니멀 타이포로 구성한 1200×630 소셜 공유 이미지
- `src/EggLab.tsx`, `src/GlassLab.tsx`, `src/BirdLab.tsx` — 시안 비교를 위해 남긴 실험 페이지
- `src/PortfolioGuidelines.tsx`, `src/portfolio-guidelines.css` — 아이덴티티 원칙과 토큰을 보여주는 링크 전용 브랜드 가이드라인 페이지
- `src/App.tsx` — 메인과 `?view=eggs|glass|birds|journey|guidelines` 보조 뷰 진입점

## Interaction model

### Chapter deep links

- 메인 여정의 바로가기는 `#01`부터 `#07`까지 짧은 hash와 `#01-intro` 같은 설명형 alias를 지원한다.
- `#00`과 `#00-prologue`는 검토용 ready 상태로 이동하지 않는다. 해시를 제거하고 `/` 기본 진입과 같은 오프닝 상태로 시작한다.
- 번호를 예약하지 않는 최종 화면용 `#contact` hash도 지원한다. 이후 07 이상 경력 챕터가 추가돼도 Contact 주소는 유지한다.
- 유효한 hash로 처음 진입하면 오프닝·낙하 대기 상태를 건너뛰어 문서 스크롤 잠금을 즉시 해제한다.
- 단순히 긴 track의 시작점에 맞추지 않고 각 챕터의 대표 문구가 보이는 내부 progress로 스크롤해 검토 시간을 줄인다.
- 같은 문서에서 hash가 바뀌는 경우에도 새로고침 없이 목표 챕터로 이동하며 브라우저 history와 직접 공유 가능한 URL은 유지한다.
- 알 수 없는 hash는 무시해 기존 기본 진입 경험에 영향을 주지 않는다.

### Toss ongoing chapter

- 06 뒤, Contact 앞에 별도 sticky track으로 배치해 이후 상세 경력 장면으로 확장해도 기존 03—06 상태 계산과 Contact 터미널을 건드리지 않게 한다.
- 진행률은 컴포넌트 내부에서 현재 보이는 트랙만 갱신하고, 큰 헤드라인·상태 카드·Contact 출구의 조립에만 사용한다.
- 공식 색상인 Toss Blue `#0064FF`, Toss Gray `#202632`와 흰색, 큰 타이포와 제품 상태 UI를 중심으로 정체성을 만들고 공식 로고는 우측 상단에만 절제해 노출한다.
- 07 메타의 원형 챕터 배지는 기존처럼 `07`을 표시한다. 장면 내부 우측 상단의 `toss-blue-object`는 워드마크가 없는 공식 심벌 PNG `img`를 기존 포인트 오브젝트와 비슷한 크기로 표시하며 별도 색상·필터·그림자·회전은 적용하지 않는다.
- 로딩 바와 live dot은 반복 ambient motion으로 현재진행형을 표현한다. 모션 감소 환경에서는 반복을 멈추고 정적인 진행 상태로 대체한다.
- 06 후반의 텍스트형 `next-journey`는 제거한다. 하향 wheel·touch·스크롤 키가 장면의 정보가 해체되기 전 임계 progress를 넘으려 하면 입력을 소비하고, fixed Toss Blue 원형 cover를 시간 기반으로 끝까지 재생한다. 완전히 가린 프레임에서 07의 curtain이 사라진 대표 progress로 즉시 이동한 뒤 fixed layer를 위로 퇴장시킨다. 상향 입력도 07 초입 임계점에서 소비하고 같은 fixed layer를 위에서 복귀시킨 뒤 06의 문구·카드·캐릭터가 함께 남아 있는 완성 progress로 위치를 교체하고 원형을 축소한다. 두 방향 모두 시퀀스가 끝날 때까지 추가 입력을 잠근다.
- 06↔07 전환은 document root에 전환 소유권을 표시해 같은 `window` 입력을 구독하는 05↔06 전환기가 동시에 시작되지 않게 한다. reveal이 끝난 뒤에도 짧은 안정화 시간 동안 공통 잠금을 유지해 트랙패드 관성 입력이 인접 경계를 즉시 다시 실행하지 않게 하고, 안정화가 끝날 때 스크롤 기준 위치와 touch 기준점을 함께 초기화한다.
- `#07`, `#07-toss`, `#07-ongoing`은 현재진행형 장면의 대표 상태로 이동한다.

### Contact finale

- Toss ongoing chapter 뒤에 독립 컴포넌트로 붙인다.
- Contact는 한 viewport 높이의 정적 stage로 바꾸고 스크롤 위치와 `--contact-progress` 계산을 분리한다. viewport에 충분히 진입하면 requestAnimationFrame 기반 ease-out 시퀀스로 약 1.9초 동안 progress를 0→1로 진행한다.
- 07→Contact 하향 입력이 Toss 후반 임계 progress를 넘으려 하면 입력을 소비하고 Contact 시작점까지 약 650ms 동안 자동 스크롤한다. Contact 초입의 상향 입력은 같은 방식으로 07의 대표 progress로 돌아가며, 이동 중 추가 wheel·touch·스크롤 키를 잠근다.
- 포인터 입력이 가능한 환경에서는 자동 조립과 별개로 배경의 앰버 글로우만 느리게 따라오게 한다.
- 터미널은 제어된 text input과 submit form으로 구현한다. 공개 명령은 `help`, `whoami`, `open github`, `open blog`, `open linkedin`, `open instagram`, `open email`, `clear`이며 `open instargram`은 사용자 입력 호환 alias로 처리한다.
- 숨은 `iloveyou` 분기는 `I love you too` 한 줄을 반환하지만 공개 명령 배열에는 넣지 않아 help 출력과 shortcut 렌더에서 제외한다.
- `cd`로 시작하는 입력은 `permission denied`, 그 밖의 미지원 입력은 `command not found` 결과를 추가한다. 명령과 출력은 시간순 entry로 렌더하고 `sessionStorage`에 저장하며 위·아래 화살표로 입력 명령 history를 탐색한다.
- `clear`는 entry state, 입력 탐색 위치와 `sessionStorage`를 한 번에 초기화하고, 명령 자체도 비워진 로그에 남기지 않는다.
- `open`만 입력하면 오류 대신 `usage: open <channel>`과 허용 채널을 보여주며, 미지원 `open <channel>`은 일반 명령 오류와 구분한 `unknown channel` 안내를 반환한다.
- GitHub, Blog, LinkedIn과 Instagram은 사용자 submit 이벤트 안에서 새 탭으로 열고 email은 `mailto:`로 연결한다. 화면의 명령 힌트 버튼도 같은 실행 경로를 직접 호출한다.
- 터미널이 viewport의 절반 이상 들어오면 Contact 자동 조립과 함께 부팅 행을 순차적으로 보여준다. 강제 포커스로 모바일 키보드를 열지는 않으며 stage나 input을 직접 선택하면 입력할 수 있다.
- 터미널 아래에는 Introduction과 같은 순서의 Email·GitHub·Blog·LinkedIn·Instagram 실제 앵커를 두고, 재시작은 `/`로 이동해 오프닝을 처음부터 실행한다.
- 하단의 `Portfolio Guidelines` 링크는 `?view=guidelines`로 이동하며 이것이 메인 여정의 유일한 Guidelines 진입점이다.
- 모바일에서는 헤드라인과 터미널을 세로로 재배치하고 히스토리 영역에 독립적인 세로 스크롤을 허용한다. 모션 감소 환경에서는 포인터 추적, 자동 타이핑 지연과 반복 커서 모션을 끈다.

### Portfolio Guidelines document

- `?view=guidelines` query에서만 lazy-load하며 메인 포트폴리오에서는 Contact 피날레 하단 링크 하나만 제공한다.
- 넓은 화면에서는 고정 목차와 스크롤 문서를 나란히 두고, 모바일에서는 목차를 상단 가로 스크롤로 전환한다.
- 섹션 anchor를 사용해 아이덴티티, 마크, 색상, 타이포, 보이스, 모션, 일러스트와 소셜 자산으로 바로 이동한다.
- 색상 swatch는 실제 버튼으로 구현해 hex 값을 clipboard에 복사하고, 성공 여부를 텍스트 상태로 알린다.
- 기존 favicon과 OG 이미지를 문서 안의 실제 배포 예시로 재사용하고 별도의 무거운 이미지 자산은 추가하지 않는다.
- 문서 진입 시 브라우저 title과 theme color를 가이드라인 문맥에 맞게 바꾸고, 다른 뷰로 이탈하면 원래 값을 복원한다.

### Egg state machine

1. `opening`: SVG stroke로 `Hello, world`를 그리고 `o`를 Milk Glass 알 실루엣으로 응축한다.
2. `idle`: 낙하 루프를 보여주고 첫 하향 제스처 또는 알 버튼 활성화를 기다린다.
3. `descending`: 스크롤·터치·키보드·알 클릭 중 하나를 한 번의 트리거로 사용해 자동 착지 시퀀스를 실행한다.
4. `landed`: 흔들림과 균열을 재생한다.
5. `ready`: 문서 높이를 확장해 다음 페이지로 실제 스크롤할 수 있게 한다.

스크롤바가 뒤늦게 생겨도 가로 레이아웃이 움직이지 않도록 풀 블리드 장면을 viewport 폭으로 유지하고 문서의 가로 초과분을 잘라낸다. 별도의 흰 scrollbar gutter를 미리 예약하지 않는다.
`ready` 전에는 `html`과 `body`의 native overflow·overscroll을 잠그고 프롤로그 자체의 `touch-action`을 막는다. 첫 제스처는 상태 전환만 일으키며 실제 문서는 움직이지 않고, 착지가 끝난 뒤 원래 문서 스크롤 속성을 복원한다.
`descending` 진입 시 idle 상태의 상하 부유와 회전 진폭을 짧게 0으로 감쇠시킨다. 메인 카메라 궤적은 초반에 Y축을 고정한 채 scale만 줄여 멀어지는 깊이를 만들고, 실제 낙하가 시작된 뒤에는 착지점까지 한 방향으로만 이동한다. 착지 직전 squash와 이후 wobble은 별도 충격 동작으로 유지한다.
`idle`과 `ready` 상태의 알은 같은 button DOM을 서로 다른 action으로 사용한다. idle에서는 포인터 클릭 또는 Enter·Space가 낙하를 시작하고, ready에서는 01 트랙의 시작점으로 smooth scroll한다. descending·landed 동안에는 버튼을 비활성화해 중복 상태 전이를 막고 모션 감소 설정에서는 각 이동을 즉시 처리한다.
모션 감소 설정에서는 프롤로그의 반복 낙하·회전·펄스를 정지하고, 착지와 균열을 정적인 완료 상태로 즉시 전환한 뒤 스크롤 잠금도 짧게 해제한다. 보조 EggLab의 WebGL 알도 연속 렌더 루프 대신 정적인 한 프레임만 렌더한다.

### Opening title morph

- `Hello, w`와 `rld`, 가운데 `o`를 분리한 SVG stroke로 그려 획이 진행되는 것처럼 나타낸다.
- 글자의 소멸과 알의 등장은 별도 장면 전환이 아니라 `world`의 `o`가 같은 화면 좌표에서 Milk Glass 알로 형태를 바꾸는 매치컷으로 연결한다.
- 글자 크기와 획의 존재감을 충분히 확보하고, 필기 과정을 읽을 수 있도록 기존보다 여유 있는 단일 시퀀스로 구성한다. 재방문·모션 감소 설정의 건너뛰기 상태를 제공한다.

### Introduction scroll track

- 알 페이지와 소개 페이지를 DOM에서 세로로 바로 연결한다.
- 알 클릭 후 사용자 휠·터치·스크롤 키 입력을 2초간 관찰하고 입력이 없을 때만 1회성 scroll cue를 표시한다. 프로그램이 실행한 smooth scroll은 사용자 입력으로 세지 않으며, cue가 표시된 뒤 입력이 들어오면 opacity transition으로 숨긴다.
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
- 트랙 길이는 모바일에서 더 길게 잡아 짧은 플릭의 큰 스크롤 델타가 여러 문장 구간을 한 번에 건너뛰지 않게 한다. 별도 자동 재생 대신 늘어난 물리적 거리로 스크롤과 장면의 직접 대응은 유지한다.

### Education scroll track

- 01 바로 아래에 별도의 긴 트랙과 sticky 무대를 배치해 실제 문서 스크롤 흐름을 유지한다.
- 진입부는 01의 크림색과 같은 종이 레이어, 비정형 하단 mask, 전경의 큰 벚꽃 gust를 조합해 2D 장면 안에서도 카메라가 다음 세계로 이동하는 깊이를 만든다.
- 전환은 트랙 초반 약 20%를 사용하고 smoothstep easing으로 시작·안착 구간을 늦춰 일반 휠 입력에서도 세 단계가 읽히게 한다.
- CNSA 공식 UI의 `CNSA Navy #005DAA`, `CNSA Blue #007DC3`, `CNSA Sky #13B5EA`를 학교 장면의 기준색으로 사용한다.
- 교정은 코드로 만든 2D 건물, 운동장 경계, 캠퍼스 길과 벚나무 실루엣으로 구성해 외부 이미지 로딩에 의존하지 않는다.
- 학교 입학·IT 과정·5개 프로젝트·대학 진학 문구는 진행률 구간별로 등장, 정착, 퇴장한다.
- 프로젝트는 교정 게시판을 닮은 작은 카드들이 벚꽃 사이에서 순차적으로 펼쳐지는 아카이브로 표현한다.
- 벚꽃잎은 고정 seed에서 파생한 시작점·지연·속도·회전값으로 CSS 루프를 실행해 스크롤이 멈춰도 계속 흩날린다. 낙하 transform을 가진 안쪽 꽃잎과 포인터 바람 transform을 가진 바깥 wrapper를 분리하고, 데스크톱 fine pointer 이동 시 속도·방향·꽃잎까지의 거리를 조합해 가까운 wrapper만 국소적으로 민다. 입력이 멈추면 약한 overshoot easing으로 원점에 복귀하며, 모션 감소 환경과 터치 포인터에서는 이 반응을 실행하지 않는다.
- 핵심 서사인 텍스트·프로젝트 카드·키위 보행은 기존처럼 스크롤 진행률에서 파생한다.
- 4프레임 키위 보행 스프라이트를 재사용하되 학교 배경과의 대비를 위해 크기와 그림자를 장면별로 조정한다.
- 모바일에서는 학교 건물을 단순화하고 큰 문구를 세로로 재배치하며, 꽃잎 수와 레이어 크기를 줄이지 않고 화면 밖 overflow만 잘라 밀도를 유지한다.
- 모바일 고정 헤드라인은 어절 내부 분리를 막고 의미 단위로 줄바꿈한다. `봄의 교정으로`는 `봄의 / 교정으로` 두 줄로 고정한다.
- 학력 트랙도 데스크톱보다 모바일 진행 거리를 더 길게 두고, 전환·학교·프로젝트·대학 구간을 한 번의 관성 스크롤로 뛰어넘지 않게 한다.
- Education 전용 4프레임 스프라이트에 학사모를 캐릭터와 같은 선·채색으로 일체화하고, 기존과 같은 스크롤 기반 프레임 인덱스·바운스·기울기를 적용한다.
- 키위는 대학 진학 구간에 들어오면 보행 속도를 낮춰 화면 안에 머물고, 진학 문구가 충분히 읽힌 뒤 다음 챕터로 이동한다.

## Visual system

### Browser identity

- favicon은 아이보리 `>`와 앰버 `_`를 Graphite 배경 위에 배치한 미니멀 프롬프트 마크를 사용한다. 브라우저 title `$ whoami`와 같은 터미널 정체성을 유지한다.
- 작은 브라우저 탭은 16 px·32 px PNG와 multi-size ICO를 제공하고, 홈 화면은 180 px Apple touch icon을 사용한다.
- 선택한 생성 시안은 필요한 크기의 정사각형 PNG와 ICO로 축소해 초기 전송량을 제한하며, 원본 생성 결과는 실제 로딩 경로에서 제외한다.

### Prologue

- CSS gradient, blur, backdrop filter와 SVG를 조합해 유리 하늘·구름·지면을 표현한다.
- 알은 Milk Glass의 불투명한 흰색과 내부 하이라이트를 유지한다.
- 낙하 이펙트는 착지 과정에서 단계적으로 사라지고 균열은 평범한 회색 선으로 남는다. 균열 path는 알 SVG의 맨 위 중앙에 붙여 시작하고 전체 높이의 상단 약 1/3 안에서만 작은 좌우 가지가 순차적으로 퍼지게 제한한다. idle 부유와 자동 낙하의 transform이 동시에 반대 방향으로 움직이지 않게 진폭을 감쇠해 연결한다.

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

### Career chapters 03—06

- 네 챕터는 각각 `long scroll track + sticky stage`를 사용하되 하나의 scroll listener에서 보이는 트랙의 진행률만 갱신한다.
- 공통 메타 정보와 진행선은 유지하고 무대 팔레트, 주 이동축, 캐릭터 행동, 정보 카드 문법을 바꾼다.
- 03 화이트블록은 현재 도로·영수증·바이크 구조와 기존 크림·딥그린의 화면 균형을 유지한다. 테이킷 레퍼런스의 버터 옐로·네이비·코랄은 주문 전표의 종이·로고·바코드·상단 띠에만 제한해 브랜드를 암시하고, 큰 면적인 도로와 배경에는 사용하지 않는다. 횡방향 도로와 바이크 이동에는 라이더의 미세한 바운스를 더한다. 04 FETCHING은 쇼윈도 깊이·세로 스캐너·유리 반사 glint를 사용한다. 05 에이임팩트는 최초 농부 일러스트의 정적인 물방울을 유지하면서 작물 성장에 잎·구름의 ambient loop를 더하되 별도 물줄기 DOM이나 반복 낙하 애니메이션은 사용하지 않는다. 농장 배경 위 제품 정보 레이어는 공식 사이트의 민트 `#38a080`·화이트·라이트 그레이를 중심으로 구성하고 흙과 당근의 웜 컬러는 보조색으로 제한한다. 데스크톱 포인터 이동 시 각 작물과의 X축 거리에 이동 속도·방향을 곱해 개별 잎의 CSS 각도를 갱신한다. 입력이 멈추면 마지막 국소 각도를 시작값으로 약 1.5초간 감쇠 진동시켜 한두 번의 작은 반동을 남긴 뒤 기본 흔들림으로 복귀시킨다. 06 당근은 대각선 지도 이동과 매물 핀의 작은 부유감을 사용한다.
- 에이임팩트의 본문은 서비스를 농부 전용으로 한정하지 않고 `직거래 주문처리 플랫폼 어레인지`로 설명한다. 비정형 주문메시지 자동처리와 CS 연동 간편결제 주문서의 흐름은 기존 시스템 개선 카드와 정돈된 제품 UI 스타일로 암시한다.
- 에이임팩트 후반에는 밭의 다섯 번째 실제 당근 DOM을 키보드 접근 가능한 버튼으로 유지하되 클릭을 유일한 진입 조건으로 사용하지 않는다. 버튼이 활성화된 뒤 클릭하거나 하향 wheel·touch·스크롤 키의 예상 진행률이 경계에 닿으면 같은 시간 기반 radial iris를 시작한다. 경계에서 대기시키는 클릭 전용 gate는 제거하고, 전환이 시작된 뒤의 추가 입력만 시퀀스 종료까지 소비한다. stage에는 낮은 고정 배율의 push-in만 적용해 당근의 픽셀 형태를 과도하게 늘리지 않는다.
- track 바깥의 단일 fixed transition overlay는 실제 당근 뿌리 중심을 CSS custom property로 공유한다. 정방향에서는 `clip-path: circle()`을 viewport 전체까지 확대한 뒤, 문서의 smooth-scroll을 일시적으로 무시하는 즉시 위치 변경으로 당근 진행률과 모든 style을 확정하고, fixed overlay 전체를 왼쪽으로 퇴장시켜 화면 오른쪽부터 지도를 드러낸다. overlay 폭을 viewport 오른쪽 밖까지 조금 연장하고 퇴장 transform에 낮은 `skewX`를 함께 적용해 오른쪽 trailing edge만 사선으로 만든다. 퇴장 위치는 단순 `-100%`가 아니라 뷰포트 비례 오버런을 더해 사선과 가장자리 음영까지 왼쪽 화면 밖으로 완전히 빠지게 한다. 역방향에서는 같은 오버런 transform을 되감아 왼쪽 밖의 사선 커튼을 화면 안으로 복귀시키고, 가려진 상태에서 에이임팩트 완성 progress로 즉시 이동·동기 계산한 다음 full circle을 실제 당근 뿌리로 축소한다. 빠져나가는 커튼 가장자리에는 짧은 음영을 두며 opacity crossfade는 섞지 않는다. 종료·중단 시 fixed 레이어와 push-in class를 한 번에 초기화하고 `prefers-reduced-motion`에서는 지연을 최소화한다.
- 챕터 경계에는 `앞 장면의 마지막 오브젝트 → 다음 장면의 첫 오브젝트` 매치컷을 배치한다.
  - 학교 기록 카드 → 배달 주문 전표
  - 배달 박스 → 명품 쇼윈도 박스
  - 상품 태그 → 씨앗 봉투
  - 밭에 박힌 당근 → 화면을 채운 주황색 표면 → 걷히는 막 아래의 동네 지도
- 캐릭터 변형은 3-C의 키 큰 측면 실루엣, 갈색 몸, 긴 부리와 다리를 유지한 래스터 에셋으로 만들고 CSS transform·mask로 움직임을 보강한다.
- 에이임팩트 농부는 최초의 `public/assets/characters/kiwi-farmer.png`를 유지해 일러스트에 포함된 정적인 물방울을 보여준다. 별도 DOM 물줄기와 반복 낙하 애니메이션만 사용하지 않는다.

## Accessibility and performance

- 의미 있는 섹션에는 한국어 `aria-label`을 제공한다.
- 장식 요소는 `aria-hidden`으로 제외한다.
- Contact Dock은 실제 앵커와 `mailto:`를 사용한다.
- `prefers-reduced-motion`에서 긴 자동 루프를 줄이거나 정적인 대표 상태를 제공해야 한다.
- 생성 이미지와 큰 실험용 번들은 실제 메인 경로에 필요한 범위만 로드한다.

## Search and social metadata

- 브라우저 title과 Open Graph·Twitter Card title은 OG 이미지의 명령어 모티프와 같은 `$ whoami`를 사용한다.
- canonical URL과 `og:url`은 HTTPS custom domain인 `https://portfolio.whitekiwi.link/`를 기준으로 한다.
- `og:image`와 `twitter:image`는 절대 URL의 `/og-image.png`를 가리키며, 1200×630 PNG 크기와 대체 텍스트를 함께 명시한다.
- 일반 description과 Open Graph·Twitter Card description은 `Scroll through the work and journey of Jihoon Jang, a Node.js developer.`로 통일한다.

## Analytics

- GA4 측정 ID `G-BD6TDB13LR`의 Google tag를 `index.html` `<head>`에서 비동기로 로드한다.
- Vite의 모든 query view가 같은 HTML 진입점을 사용하므로 메인과 `?view=guidelines`를 포함한 보조 뷰에 기본 `page_view`가 적용된다.
- 현재 별도 consent UI, 사용자 ID와 커스텀 이벤트는 구현하지 않는다. 추가 수집이 필요하면 이벤트 명세와 개인정보 안내 범위를 먼저 정한다.

## Build and deployment

- 소스 브랜치: `develop`
- 배포 브랜치: `master`
- `develop` push 시 pnpm lockfile 기준으로 설치하고 `pnpm build`를 실행한다.
- Vite 산출물인 `dist/`만 `master`에 게시한다.
- `master`는 생성물 전용이므로 직접 수정하지 않는다.
- `.github/workflows/auto-publish.yml`에서 checkout·mise·Pages 배포 action을 검증한 commit SHA로 고정하고, 사람이 읽을 수 있는 버전은 주석으로 남긴다.
- 고정된 `peaceiris/actions-gh-pages` action이 `dist/`를 orphan `master`로 게시하고 `.nojekyll`을 생성한다.
- 배포 action이 `portfolio.whitekiwi.link`를 CNAME으로 함께 게시해 배포마다 custom domain 설정을 유지한다.
- workflow는 `contents: write`만 요청하고, 동시 배포가 발생하면 이전 실행을 취소한다.

## Verification

변경 위험에 따라 다음을 수행한다.

1. `pnpm build`
2. `git diff --check`
3. 데스크톱과 모바일 실제 렌더 캡처
4. 스크롤 주요 진행률별 캐릭터·문구 위치 확인
5. 외부 링크와 키보드 접근 확인
6. 배포 변경 시 workflow 구문과 GitHub Pages 결과 확인
