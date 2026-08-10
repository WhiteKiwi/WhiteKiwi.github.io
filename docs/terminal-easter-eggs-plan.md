# Terminal easter eggs — 구현 계획

> 2026-08-09 작성, 2026-08-10 갱신.
>
> **0—4단계는 구현 완료.** 확정된 결정과 제약은 `SPEC.md`·`IMPLEMENTATION.md`로 옮겼고,
> 남은 확인 항목은 `TODO.md`에 있다. 이 문서는 5—7단계(`sl`·`matrix`·`vim`)와
> 보류한 것들(§5)의 근거를 남기기 위해 유지한다.
>
> | 단계 | 상태 |
> |---|---|
> | 0. `SPEC.md` 문구 개정 | 완료 |
> | 1. 명령 레지스트리 (`src/terminal-commands.ts`) | 완료 |
> | 2. 텍스트 전용 숨은 명령 (`git log` 포함) | 완료 |
> | 3. 이펙트 레이어 + 입력 잠금 + `lightning` | 완료 |
> | 4. `boom` | 완료 |
> | 5. 프레임 애니메이션 + `kiwisay` / `kiwi` / `hack` / `sl` | 완료 |
> | 6. `matrix` 캔버스 | 완료 |
> | 7. 모드 시스템 + `sudo` 비밀번호 | 완료 (`vim`은 농담 한 줄로 대체) |
>
> §5에서 보류했던 `flip`과 `gravity`는 2026-08-10 사용자 요청으로 구현했다.
> 보류 근거 두 가지가 모두 틀렸다는 점은 그 절에 정정해 두었다.
> `earthquake`는 지속형 대신 스스로 끝나는 길이로 넣었다.

대상은 `src/ContactFinale.tsx`의 Contact 터미널 하나다.
현재 공개 명령은 9개, 숨은 명령은 `iloveyou` 하나뿐이다 (`SPEC.md:141`—`143`).

---

## 0. 결론 먼저

- **텍스트만 출력하는 이스터에그**는 지금 구조에 거의 그대로 얹을 수 있다. 위험 낮음.
- **화면을 다루는 이스터에그**는 얹기 전에 공통 기반 3개(명령 레지스트리 / 이펙트 레이어 / 입력 잠금)를 먼저 만들어야 한다. 없이 바로 넣으면 아래 R1—R4가 재현된다.
- `flip`(do a barrel roll)과 `gravity`는 이 사이트 구조에서 **비용 대비 손해**라고 판단했다. 근거는 §5.
- 선행 리팩터 없이 개별 명령을 하나씩 추가하는 방식은 권하지 않는다. `executeCommand`의 if-else 체인이 이미 `ContactFinale.tsx:579`—`669`로 90줄이다.

---

## 1. 확인된 버그 위험

계획을 세우면서 실제 코드에서 확인한 것들이다. 각 이스터에그 계획은 이 항목들을 참조한다.

### R1. `body`/`html`에 `transform`을 걸면 fixed 전환막이 전부 깨진다

`transform`이 걸린 조상은 `position: fixed` 자손의 containing block이 된다.
이 저장소에는 fixed 전환막이 두 개 있다.

- 05→06 당근 radial iris + 사선 커튼 (`IMPLEMENTATION.md:248`)
- 06↔07 Toss Blue fixed 전환막 (`IMPLEMENTATION.md:80`)

Google `askew`처럼 `body { transform: skew(...) }`를 쓰는 흔한 구현을 그대로 가져오면
이 두 전환이 viewport가 아니라 body 기준으로 잘린다.
**흔들림·회전은 반드시 `.contact-finale-stage` 안쪽 전용 래퍼에만 건다.**

### R2. 전체 화면 오버레이가 wheel을 가로채면 사용자가 07로 튕겨나간다

```ts
// ContactFinale.tsx:438
if (deltaY < 0 && insideTerminal(event.target)) return
if (deltaY < 0 && contactIsActive()) { event.preventDefault(); snapToToss() }
```

`insideTerminal`은 `event.target.closest('.contact-terminal')`로 판정한다 (`ContactFinale.tsx:291`).
이펙트 오버레이가 터미널 위를 덮으면 `event.target`이 오버레이가 되어 이 가드를 통과하지 못하고,
이펙트 재생 중 위로 스크롤한 사용자가 Toss 챕터로 끌려간다.

→ 오버레이는 항상 `pointer-events: none`. 그리고 §2.3의 입력 잠금을 병행한다.

### R3. 스크롤 소유권을 새로 claim하면 Contact 자신의 snap이 막힌다

```ts
// ContactFinale.tsx:307
const snapOwnedElsewhere = () => {
  const owner = documentRoot.dataset.portfolioTransition
  return Boolean(owner && owner !== 'contact')
}
```

이펙트가 `dataset.portfolioTransition = 'contact-effect'` 같은 새 값을 쓰면
`snapToContact`/`snapToToss`가 영구히 막힌다. 반대로 `'contact'`를 쓰면
`releaseSnapAfterQuiet`가 이펙트와 무관하게 소유권을 풀어버린다.

→ **전환 소유권 시스템을 재사용하지 말고 별도 ref 플래그를 쓴다.** §2.3.

### R4. `entries`는 통째로 sessionStorage에 직렬화된다

```ts
// ContactFinale.tsx:258
window.sessionStorage.setItem(TERMINAL_STORAGE_KEY, JSON.stringify(entries.slice(-30)))
```

`TerminalEntry`에 이펙트 정보를 넣으면 새로고침할 때 조용히 사라지거나(함수)
과거 이펙트가 다시 재생된다. **이펙트는 entry 데이터가 아니라 `executeCommand`의 side effect로만 실행한다.**

### R5. 아스키 아트는 좁은 화면에서 줄이 접혀 무너진다

```css
/* contact-finale.css:221 */
.terminal-entry-output > span { white-space: pre-wrap; word-break: break-word; }
```

`whoami`는 `window.innerWidth < 760` 분기로 좁은 아트를 따로 두어 피했다 (`ContactFinale.tsx:118`).
`sl`, `kiwisay`, `git log --graph`처럼 격자가 필요한 새 출력은 전부 같은 처리가 필요하고,
`grid: true`와 `cellWidth`/`padCells` 헬퍼를 재사용해야 한다 (`ContactFinale.tsx:101`—`115`).

### R6. 줄 등장 지연에 상한이 없다

```tsx
// ContactFinale.tsx:762
style={{ '--line-delay': `${index * 45}ms` }}
```

`git log`가 30줄이면 마지막 줄이 1.35초 뒤에 뜬다. `ls -la`, `top`도 마찬가지다.
→ `Math.min(index, 12) * 45ms` 같은 상한을 둔다.

### R7. 출력이 늘어날 때마다 로그가 smooth scroll된다

`ContactFinale.tsx:267`—`269`. 줄 단위 애니메이션과 겹치면 긴 출력에서 로그가 계속 흔들린다.
긴 출력 명령을 넣기 전에 `behavior`를 조건부로 `auto`로 바꿀지 결정한다.

### R8. 모드 진입형(`vim`)은 탈출 실패가 진짜 버그다

터치 환경에서 `:q`를 못 치는 사용자가 나오면 터미널 전체가 잠긴다.
탈출 경로를 최소 4개 확보한다: `:q` / `Esc` / `clear` / 8초 뒤 힌트 자동 출력.

### R9. `role="log" aria-live="polite"`에 대량 라인을 쏟으면 스크린리더가 전부 읽는다

`ContactFinale.tsx:745`. `matrix`, `hack`처럼 의미 없는 라인은
`aria-hidden` 처리하고 요약 한 줄만 라이브 리전에 남긴다.

### R10. 광과민성

`lightning`, `boom`의 백색 플래시는 WCAG 2.3.1 기준 **초당 3회 이하**로 제한한다.
`prefers-reduced-motion`에서는 플래시 자체를 없애고 텍스트 결과만 남긴다.

### R11. 히든 명령이 help와 shortcut에 새어나가면 안 된다

`commandList` 하나가 help 출력(`ContactFinale.tsx:599`)과 하단 shortcut 버튼(`ContactFinale.tsx:801`)을
동시에 만든다. 히든 명령은 반드시 별도 배열이거나 `hidden` 플래그를 가져야 한다.

### R12. rAF·타이머 정리

이펙트마다 `useEffect` cleanup에서 rAF와 타이머를 취소한다.
`ContactFinale`은 `active={phase === 'ready'}`로 계속 마운트되어 있지만 (`FallIntro.tsx:526`),
이펙트 자체는 짧은 수명이라 언마운트 경로가 자주 생긴다.

---

## 2. 선행 리팩터 (공통 기반)

화면 이펙트를 하나라도 넣으려면 이게 먼저다. 이 단계만으로는 사용자에게 보이는 변화가 없다.

### 2.1 명령 레지스트리

`executeCommand`의 if-else 체인을 테이블로 바꾼다.

```ts
type CommandResult = {
  lines: TerminalLine[]
  effect?: EffectKind      // 화면 이펙트. entry에 저장하지 않는다 (R4)
  mode?: TerminalMode      // vim 같은 모드 진입
}

type CommandDef = {
  name: string
  aliases?: string[]
  description?: string     // 없으면 help에서 숨김 (R11)
  hidden?: boolean
  run: (args: string[], ctx: CommandContext) => CommandResult | void
}
```

- 기존 9개 공개 명령과 `iloveyou`를 그대로 이 테이블로 옮긴다. **동작 변화 0을 목표로 한다.**
- `open <channel>`은 서브커맨드 테이블로 분리하고, 현재의 `open` 단독 usage와
  `unknown channel` 분기(`ContactFinale.tsx:649`)를 유지한다.
- `open instargram` alias(`ContactFinale.tsx:636`)는 `aliases`로 옮긴다.
- help 출력은 `description`이 있는 항목만, shortcut 버튼도 같은 필터를 쓴다.

검증: 리팩터 전후로 기존 10개 명령의 출력이 문자열 단위로 동일한지 확인.

### 2.2 이펙트 레이어

```tsx
// document.body로 portal. .contact-finale-stage의 overflow:hidden(css:20)에
// 잘리지 않고, 조상에 transform이 생겨도 containing block이 흔들리지 않는다.
createPortal(<TerminalEffectLayer kind={effect.kind} onDone={...} />, document.body)
```

- `position: fixed; inset: 0; z-index: 90; pointer-events: none;` (R2)
- `peekRun` 패턴을 그대로 재사용한다 (`ContactFinale.tsx:231`, `727`).
  `run` 카운터를 올려 remount → `onAnimationEnd`에서 0으로 되돌려 unmount.
  같은 명령을 연속 입력해도 다시 재생된다.
- 흔들림·회전이 필요한 이펙트는 오버레이가 아니라 `.contact-finale-stage` 안쪽에
  새로 넣을 `.contact-finale-shake` 래퍼에 클래스를 붙인다 (R1).
  stage가 `overflow: hidden`이므로 흔들 때 가장자리가 비지 않도록 `scale(1.03)`을 함께 준다.
- `prefers-reduced-motion`이면 레이어를 아예 마운트하지 않고 텍스트 결과만 남긴다.

### 2.3 입력 잠금

```ts
const effectLockRef = useRef(false)
```

- `onWheel` / `onTouchMove` / `onKeyDown`의 **최상단**에서 확인하고
  `event.preventDefault()` 후 반환한다.
- 기존 `snapLocked`나 `dataset.portfolioTransition`을 재사용하지 않는다 (R3).
- 이펙트 종료 후 250ms 무입력이 지나야 해제한다. 관성 입력이 남아 있으면
  종료 직후 `snapToToss`가 즉시 걸린다.
- 잠금 중에도 터미널 입력(키보드)은 살려둔다. 잠그는 것은 **페이지 스크롤 전환**뿐이다.

### 2.4 모드 시스템 (`vim` 계열이 채택될 때만)

```ts
type TerminalMode = { kind: 'vim'; enteredAt: number } | null
```

- 모드가 있으면 `executeCommand`가 먼저 모드 핸들러로 라우팅한다.
- 프롬프트 label(`ContactFinale.tsx:781`)과 placeholder를 모드에 맞게 바꾼다.
- 탈출 경로 4개를 반드시 구현한다 (R8).

---

## 3. 텍스트 전용 이스터에그 (1단계 · 저위험)

전부 §2.1 레지스트리만 있으면 된다. 화면을 건드리지 않는다.

| 명령 | 출력 | 비고 |
|---|---|---|
| `git log` | 경력 연표를 커밋 로그 형식으로 | §3.1 |
| `sudo` / `sudo <cmd>` | `visitor is not in the sudoers file. This incident will be reported.` | 3회 반복 시 실제 실행 |
| `sudo make me a sandwich` | `Okay.` | xkcd 149. 위 분기보다 먼저 매칭 |
| `rm -rf /` | 가짜 삭제 진행 후 `nothing here is deletable.` | 진행바는 줄 단위 지연으로만 (R6) |
| `ping` | `PING portfolio.whitekiwi.link ... time=0.42ms` 4줄 + 통계 | 고정 값. 난수 금지 (R4) |
| `uptime` | `up N years, M days` | 기준 날짜는 `resume-data.ts` 방식대로 상수로 |
| `pwd` | `/portfolio/whitekiwi/contact` | |
| `ls` / `ls -la` | 챕터를 파일처럼. `.secrets` 히든 파일 포함 | §3.2 |
| `cat .secrets` | 발견한 사람만 보는 히든 명령 인덱스 | §3.2 |
| `man kiwi` | man page 포맷 | 폭 주의 (R5) |
| `whitekiwi` | 닉네임 유래 한 문단 | **사용자 확인 필요** — 내가 지어낼 수 없음 |
| `why nodejs` | 진지한 한 문단 | **사용자 확인 필요** |
| `coffee` / `brew` | `418 I'm a teapot` | |
| `exit` / `logout` | `Connection to whitekiwi closed.` + 입력 비활성 | 재개는 아무 키. 저위험 모드 |
| `history` | 기존 `commandHistory` 출력 | 이미 상태로 있음 (`ContactFinale.tsx:234`) |
| `emacs` | `vim is that way →` | |

### 3.1 `git log` 상세

가장 좋은 아이디어라고 보는데, 데이터가 반쯤 없다.

**형식** — `--oneline` 계열로 좁게 간다. `--graph`의 `|`/`\` 문자는 좁은 화면에서 무너진다 (R5).

```
* a1f4c2e (HEAD -> main) chore: toss income으로 전적            2025-03
* 7b9e013 feat: 세이브잇 인수, 토스인컴 합류                     2024-05
* 3c8d5a1 feat: viva republica 입사                            2021-11
* e42fb90 feat: 당근 부동산 직거래 지도뷰                        2021-05
* 9d1a7c4 refactor: 어레인지 레거시를 nestjs로 이전              2021-02
* 5f0b3e8 perf: fetching 크롤러 메모리 누수 해결                 2020-08
* 2e7c916 feat: 테이킷 배달 기능 런칭                           2020-02
* 0a3d182 feat: 건국대학교 컴퓨터공학과 진학                     2020-03
* 6c9f4b7 feat: 정보올림피아드 은상                             2018
* 0000000 init: hello, world                                  2017-03
```

**구현**
- 해시는 **고정 상수**로 둔다. `Math.random()`으로 만들면 호출할 때마다 달라지고,
  sessionStorage에 저장된 과거 출력과 어긋난다 (R4).
- 커밋 메시지는 저장소 커밋 컨벤션(`{type}: {message}`)을 그대로 따른다. 그게 농담의 핵심이다.
- 데이터는 `resume-data.ts`에서 파생할 수 있는지 먼저 확인한다. 중복 정의를 만들지 않는다.
- 날짜 열 정렬은 `padCells` 사용, 줄은 `grid: true` (R5).
- 좁은 화면(<760px)에서는 날짜 열을 버리고 메시지만 남긴다.

**열린 질문**
- 루트 커밋을 무엇으로 둘지. 생년은 알 수 없고 넣고 싶은지도 모른다.
  현재 초안은 고등학교 입학(2017-03)을 `init`으로 뒀다.
- `git log` 외에 `git status`(→ `nothing to commit, working tree clean` / `On branch main`),
  `git blame`(→ `always me`)까지 갈지.

### 3.2 `ls` / `cat .secrets` — 발견의 층

히든 명령을 20개 넣어도 아무도 못 찾는다. 인덱스를 하나 숨겨둔다.

```
$ ls -la
drwxr-xr-x  00-prologue/
drwxr-xr-x  01-introduction/
...
drwxr-xr-x  07-toss/
-rw-------  .secrets
```

`cat .secrets`가 히든 명령 목록의 **일부만** 보여준다.
전부 보여주면 발견의 재미가 없어지므로 `boom`, `lightning` 같은 화면 이펙트는
목록에 넣고 `iloveyou`나 개인적인 것들은 빼둔다.

---

## 4. 화면 이펙트 (요청하신 것 · 상세 계획)

### 4.1 `lightning` — 먼저 만든다

가장 싸고, §2.2 이펙트 레이어를 실전 검증하는 용도로 적합하다.

**동작**
1. 0—80ms: 화면 전체 백색 오버레이 `opacity: 0 → .85`
2. 80—160ms: `.12`로 감쇠
3. 160—220ms: 2차 플래시 `.6` (총 2회. 3Hz 이하 유지 — R10)
4. 동시에 SVG 번개 path 하나를 `stroke-dasharray` 드로잉으로 그리고 300ms 뒤 페이드
5. 종료 후 stage 전체에 400ms짜리 색 복귀 (`filter: brightness()` 감쇠)

**구현**
- 오버레이 portal 안에서 전부 CSS `@keyframes`로 처리. rAF 불필요.
- 번개 path는 고정 좌표 3—4개 시안을 배열로 두고 `run % n`으로 고른다.
  `Math.random()`을 쓰면 매 렌더 달라진다.
- `filter: brightness()`는 `.contact-finale-stage`에 건다.
  **주의: `filter`도 fixed containing block을 만든다.** 이펙트 오버레이가 portal이라 영향 없지만,
  stage 안에 fixed 자손이 생기면 그때 깨진다. 지금은 없음을 확인했다.

**출력 라인** — `zsh: segmentation fault (core dumped)` 같은 한 줄을 남겨 터미널 맥락을 유지한다.

**reduced motion** — 플래시 없이 텍스트 한 줄만.

**검증** — 이펙트 중 위로 휠 → Toss로 안 튕기는지 (R2/R3). 종료 직후 관성 휠도 확인.

### 4.2 `boom` — 본편

**동작 3단계**

| 단계 | 시간 | 내용 |
|---|---|---|
| 1. 충격 | 0—140ms | 터미널 중심에서 링 1개가 viewport 밖까지 확대. 백색 플래시 1회 |
| 2. 흔들림 | 140—900ms | `.contact-finale-shake`에 감쇠 진동. 진폭 14px → 0 |
| 3. 낙하 | 200—1600ms | 헤드라인 글자가 하나씩 떨어짐 |
| 4. 복구 | 1600—2100ms | 글자가 제자리로 복귀 |

**3단계 낙하를 무엇으로 할지 — 세 가지 후보**

- ~~A. 터미널 로그 전체를 글자 단위 span으로 분해~~
  수백 개 span + 레이아웃 리플로우. 로그 스크롤 위치도 깨진다. **기각.**
- ~~B. `html2canvas`로 화면 스냅샷 후 캔버스 파편화~~
  외부 의존성 추가. `IMPLEMENTATION.md:12`의 "필요할 때만 도입" 원칙과 어긋나고
  backdrop-filter를 제대로 못 찍는다. **기각.**
- **C. 헤드라인만 글자 단위로 떨어뜨린다. ← 채택**
  `.contact-finale-copy h2`는 `<span>LET'S</span><strong>CONNECT.</strong>` 두 조각뿐이다
  (`ContactFinale.tsx:723`). 글자 12개로 분해하면 충분하고, 원복이 쉽다.
  "화면이 터진다"의 인상은 흔들림 + 충격파가 대부분 만든다.

**구현 주의**
- 헤드라인 분해는 렌더 트리에서 하고(`boomRun > 0`일 때만 글자 span 렌더),
  끝나면 원래 마크업으로 되돌린다. DOM을 직접 조작하지 않는다.
- `h2`는 접근성 트리에 있어야 하므로 분해 상태에서도 원문을 `aria-label`로 유지한다.
- 700px 이하에서는 헤드라인이 터미널 바로 위에 있다 (`contact-finale.css:329`).
  글자가 떨어지면서 터미널을 덮으므로 **모바일은 흔들림 + 충격파만** 하고 낙하는 뺀다.
  `.contact-kiwi-peek`가 같은 이유로 모바일에서 숨겨진 선례가 있다 (`contact-finale.css:446`).
- 흔들림은 `translate`만 쓰고 `rotate`는 넣지 않는다. stage `overflow: hidden` 때문에
  회전하면 모서리가 비고, 안 비게 하려면 배율을 크게 올려야 한다.

**출력 라인** — `boom: 1 explosion staged. no files were harmed.`

### 4.3 `matrix` — 전역이 아니라 터미널 안에서

전체 화면 캔버스보다 터미널 로그 영역 안에서 도는 쪽이 안전하고 더 어울린다.

- `.contact-terminal-log`에 `position: absolute; inset: 0` 캔버스를 얹는다.
  로그가 이미 `position: relative`다 (`contact-finale.css:188`).
- 문자셋에 `키위` / `ㅋ` / `🥝`를 섞는다. 순수 카타카나는 남의 것이다.
- DPR 대응 필수. `canvas.width = clientWidth * devicePixelRatio`.
- `ResizeObserver`로 리사이즈 대응. 안 하면 회전 시 늘어난다.
- 중단: 아무 키 입력 또는 8초 자동 종료. `clear`로도 나가져야 한다.
- rAF는 이펙트 unmount 시 반드시 취소 (R12).
- 라이브 리전에는 요약 한 줄만 (R9).

### 4.4 `sl` / `kiwisay` — 터미널 안 아스키 애니메이션

- `sl`: 아스키 기차가 로그 폭을 가로지른다.
  entry를 계속 추가하면 30개 캡(`ContactFinale.tsx:666`)에 걸리므로
  **entry 하나의 lines를 setInterval로 교체**하는 방식이어야 한다. 이건 현재 구조에 없다.
  → `updateEntry(id, lines)` 헬퍼가 필요하고, 애니메이션 중에는 sessionStorage 저장을 건너뛴다 (R4).
- `kiwisay <text>`: `buildBubble`을 그대로 재사용할 수 있다 (`ContactFinale.tsx:192`).
  `whoami`가 이미 같은 말풍선 + 아스키 키위 조합을 쓰고 있어 정적 출력으로 끝난다. **가장 싼 편.**
  단 사용자 입력 텍스트를 그대로 렌더하므로 길이 상한과 `wrapCells` 처리가 필요하다.

### 4.5 `hack` — 가짜 로그 스트림

- `sl`과 같은 "entry 하나를 갱신"하는 메커니즘이 필요하다. 4.4를 먼저 만들면 거의 공짜.
- 42줄 정도를 60ms 간격으로 흘리고 `ACCESS DENIED` → `just kidding.`
- 라이브 리전 제외 (R9).

---

## 5. 보류했다가 뒤집은 것

### ~~`flip` / `do a barrel roll` — 비추천~~ → 구현함. **보류 근거가 틀렸다.**

원래 근거: "`.contact-finale-shake`를 돌리면 stage `overflow` 때문에 모서리가 비고,
안 비게 하려면 `scale(1.45)`가 필요해 헤드라인과 터미널이 크게 잘린다."

틀린 지점: 드러나는 모서리 뒤에 있는 것은 **페이지가 아니라 트랙이고, 트랙 배경은
무대 배경과 같은 `#171918`**이다. 색이 같으니 틈으로 보이지 않는다.
90도 프레임을 고정해 확인했고 등배 회전으로 충분했다.
Google 검색 결과 페이지가 큰 배율을 필요로 하는 것은 그 페이지 배경이 흰색이고
회전하는 요소가 문서 전체이기 때문이다. 우리 구조와 다르다.

### ~~`gravity` — 후순위~~ → 구현함. **비용을 과대평가했다.**

원래 근거: "각 요소의 rect를 읽어 fixed로 복제하고 원본을 숨긴 뒤 원복해야 한다."

틀린 지점: 복제할 이유가 없다. **원본에 `transform`만 걸었다가 class를 떼면 그대로 돌아온다.**
레이아웃은 건드리지 않으므로 복원이 공짜고, 복제본이 없으니 포커스 트랩도 없다.
JS가 하는 일은 요소마다 다른 낙하 거리를 재서 CSS 변수로 넣는 것뿐이다.

주의 하나: 재기 전에 이전 연출이 남긴 인라인 값을 걷어야 한다.
이미 내려간 요소를 다시 재면 바닥까지의 거리가 0이 되어 낙하가 사라진다.
구현 중 실제로 이 상태를 만들어 봤다.

### `earthquake` (지속 진동) → 자동 종료형으로 구현

`stop`을 칠 때까지 흔드는 방식은 그대로 두면 입력 잠금을 무한정 유지하게 되고
`SPEC.md`의 "짧고 스스로 끝난다" 규칙과 충돌한다.
개념은 살리고 3.4초 뒤 스스로 끝나게 했다. boom과 다른 점은 충격 한 번이 아니라
진폭이 커졌다 잦아드는 곡선이라는 것이다.

### `snow` / `rain`

Education의 벚꽃 시스템(`IMPLEMENTATION.md:194`)은 flow trail까지 물려 있어
그대로 떼어 쓸 수 없다. 새로 만들면 그냥 새 파티클 시스템이고 이스터에그치고 비싸다.

---

## 6. 도입 순서

| 단계 | 범위 | 사용자 확인 |
|---|---|---|
| 0 | `SPEC.md:141`의 명령 제한 문구 개정 | **선행 필수** |
| 1 | §2.1 명령 레지스트리 리팩터 (동작 변화 0) | 불필요 |
| 2 | §3 텍스트 전용 — `git log` 포함 | 문구 확인 |
| 3 | §2.2 이펙트 레이어 + §2.3 입력 잠금 + `lightning` | 렌더 확인 |
| 4 | `boom` | 렌더 확인 |
| 5 | §4.4 entry 갱신 메커니즘 + `sl` / `kiwisay` | |
| 6 | `matrix`, `hack` | |
| 7 | §2.4 모드 시스템 + `vim` / `exit` | 탈출 경로 확인 |

3단계 이후는 매번 실기기 확인이 필요하다. 데스크톱 캡처만으로는 R2가 안 잡힌다.

---

## 7. 검증 체크리스트 (화면 이펙트 공통)

- [ ] `pnpm build`, `git diff --check`
- [ ] 이펙트 재생 중 **위로 휠** → Toss로 튕기지 않는다 (R2)
- [ ] 이펙트 종료 **직후 관성 휠** → 즉시 전환이 걸리지 않는다 (R3)
- [ ] 이펙트 재생 중 05→06, 06→07 전환막이 정상 동작한다 (R1)
- [ ] 같은 명령 연속 2회 → 두 번 다 재생된다 (remount key)
- [ ] 재생 중 새로고침 → 이펙트가 되살아나지 않는다 (R4)
- [ ] `prefers-reduced-motion: reduce` → 텍스트 결과만 나온다
- [ ] 모바일 실기기(iOS Safari / Android Chrome) — 주소창 높이 변화 중 오버레이 정렬
- [ ] 700px 이하에서 헤드라인 낙하가 터미널을 가리지 않는다
- [ ] 스크린리더로 이펙트 출력이 폭주하지 않는다 (R9)
- [ ] `help`와 shortcut 버튼에 히든 명령이 안 보인다 (R11)
- [ ] 아스키 출력이 320px 폭에서 줄바꿈으로 무너지지 않는다 (R5)

---

## 8. 사용자 확인이 필요한 것

1. §6의 0단계 — `SPEC.md`의 "공개 명령 9개 제한" 문구를 어떻게 고칠지.
   히든 명령은 SPEC에 이름을 다 적을지, `iloveyou`처럼 성격만 적을지.
2. `git log`의 루트 커밋을 무엇으로 둘지 (§3.1).
3. `whitekiwi` 닉네임 유래, `why nodejs` 답변 — 내가 지어낼 수 없는 내용이다.
4. `boom`의 흔들림 강도. 14px는 초안이고 실제로 보고 정해야 한다.
5. 채택 범위. §3 전부 + §4.1—4.2 정도가 밀도상 적당하다고 본다.

---

## 9. 레퍼런스

**Google 이스터에그** — `askew`는 root element에 `skew()`, `do a barrel roll`은 CSS `rotate`,
`zerg rush`는 독립 DOM 엘리먼트 + 충돌 판정. 우리 구조에서 앞의 둘을 그대로 쓸 수 없는 이유는 R1.
- [Do a Barrel Roll: Origins, Google Easter Egg, Variants & Meme History](https://contentbase.com/blog/do-a-barrel-roll/)
- [Zerg Rush Easter Egg: How To Play Google's Hidden Game](https://softwareeggs.com/zerg-rush-easter-egg/)
- [More Than Barrel Roll: 7 Fun Google Tricks](https://www.stikkymedia.com/secret-google-tricks/)

**터미널 이스터에그 원본** — `sl`, `cowsay`, `cmatrix`, vim `:help 42`
- [Top 10 Linux Easter Eggs](https://contabo.com/blog/top-10-linux-easter-eggs/)
- [8 open source 'Easter eggs' to have fun with your Linux terminal](https://www.redhat.com/en/blog/open-source-linux-easter-eggs)
- [12 Super Cool Terminal Easter Eggs](https://tinplavec.medium.com/12-super-cool-terminal-easter-eggs-edf6b48eb32c)

**터미널 포트폴리오 선례** — 명령 레지스트리 구조와 히든 명령 배치 참고
- [iamdhakrey/terminal-portfolio](https://github.com/iamdhakrey/terminal-portfolio)
- [navnee1h/terminal-portfolio](https://github.com/navnee1h/terminal-portfolio)
- [terminal-portfolio · GitHub Topics](https://github.com/topics/terminal-portfolio)

**Canvas / rAF** — §4.3 matrix 구현 기준
- [Matrix rain effect — Maarten Hus](https://www.maartenhus.nl/blog/matrix-rain-effect/)
- [Build a Matrix Rain Animation with HTML5 Canvas](https://blog.andreszenteno.com/articles/20241222)
- [Improve Web Performance With requestAnimationFrame — DebugBear](https://www.debugbear.com/blog/requestanimationframe)

**저장소 내부 선례**
- `contact-finale.css:423`—`447` — 재생 중에만 마운트하는 `peek` 패턴. 이펙트 레이어가 그대로 따른다.
- `IMPLEMENTATION.md:248` — 당근 fixed overlay. fixed 레이어를 다루는 기존 방식.
- `ContactFinale.tsx:101`—`115` — `cellWidth`/`padCells`. 모든 아스키 출력이 재사용한다.
