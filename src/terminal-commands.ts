/**
 * Contact 터미널의 명령 정의.
 *
 * 렌더링과 상태는 `ContactFinale.tsx`가 갖고, 이 파일은 "입력 문자열 → 출력 줄"만 책임진다.
 * 화면 이펙트는 결과에 `effect` 이름만 담아 돌려주고 실제 재생은 컴포넌트가 한다.
 * 이펙트를 출력 줄에 섞으면 `sessionStorage`에 직렬화돼 새로고침 때 되살아난다.
 */

export type OutputTone = 'default' | 'muted' | 'accent' | 'error' | 'success'

export type TerminalLine = {
  text: string
  tone?: OutputTone
  /** 아스키 격자를 정확히 맞춰야 하는 줄. 한글까지 2:1인 고정폭 글꼴로 렌더한다. */
  grid?: boolean
}

/** 화면 전체를 다루는 연출. 컴포넌트가 portal 레이어와 무대 class로 재생한다. */
export type EffectKind = 'lightning' | 'boom' | 'gravity' | 'earthquake' | 'flip'

export type CommandResult = {
  /** 정적 출력, 또는 `frames`가 있으면 첫 프레임. */
  lines: TerminalLine[]
  /**
   * 시간에 따라 entry 하나의 내용을 통째로 교체하는 애니메이션.
   * 줄을 덧붙이는 것도 "누적 프레임"으로 표현해 한 가지 방식만 쓴다.
   */
  frames?: TerminalLine[][]
  frameInterval?: number
  effect?: EffectKind
  /** 빼꼼 키위 트리거 판정에 쓴다. */
  notFound?: boolean
  /** 다음 입력을 비밀번호로 받는다. 값은 통과했을 때 실행할 명령이다. */
  askPassword?: string
  /** 로그 위에 덮는 캔버스 연출. 텍스트 프레임으로는 표현할 수 없는 것만 쓴다. */
  overlay?: 'matrix'
}

export type CommandContext = {
  /** 두 열 아스키가 들어가지 않는 폭. */
  narrow: boolean
  /** `sudo`를 통과해 실행된 명령인지. 권한이 필요한 척하는 명령이 사용한다. */
  root?: boolean
  /** `history`가 사용한다. */
  history: string[]
  /** 소문자로 접기 전 원문. `kiwisay`가 대소문자를 살리는 데 쓴다. */
  raw: string
}

export const githubUrl = 'https://github.com/whitekiwi'
export const blogUrl = 'https://blog.whitekiwi.link'
export const linkedinUrl = 'https://www.linkedin.com/in/whitekiwi/'
export const instagramUrl = 'https://www.instagram.com/whitekiwi_'
export const emailUrl = 'mailto:jh145478@gmail.com'
export const resumeUrl = '/resume/'

/** help 출력과 화면 바로가기를 함께 만든다. 숨은 명령은 여기에 넣지 않는다. */
export const commandList = [
  ['help', 'Show this list'],
  ['whoami', 'Print who is behind this portfolio, with a line worth keeping'],
  ['open resume', 'Open the readable resume page'],
  ['open github', 'Open the GitHub profile'],
  ['open blog', 'Open the blog'],
  ['open linkedin', 'Open the LinkedIn profile'],
  ['open instagram', 'Open the Instagram profile'],
  ['open email', 'Start an email'],
  ['clear', "Clear the screen and this tab's history"],
] as const

export const availableCommands = commandList.map(([command]) => command)

const plain = (text: string): TerminalLine => ({ text })
const muted = (text: string): TerminalLine => ({ text, tone: 'muted' })
const accent = (text: string): TerminalLine => ({ text, tone: 'accent' })
const failure = (text: string): TerminalLine => ({ text, tone: 'error' })
const ok = (text: string): TerminalLine => ({ text, tone: 'success' })
const fixed = (text: string, tone: OutputTone = 'default'): TerminalLine => ({ text, tone, grid: true })

/* ── 폭 계산 ──────────────────────────────────────────── */

/** 한글·CJK는 모노스페이스에서 두 칸을 차지한다. 말풍선 테두리를 맞추려면 칸 수로 세야 한다. */
export const cellWidth = (text: string) =>
  [...text].reduce((total, char) => {
    const code = char.codePointAt(0) ?? 0
    const wide =
      (code >= 0x1100 && code <= 0x115f) ||
      (code >= 0x2e80 && code <= 0xa4cf) ||
      (code >= 0xac00 && code <= 0xd7a3) ||
      (code >= 0xf900 && code <= 0xfaff) ||
      (code >= 0xfe30 && code <= 0xfe6f) ||
      (code >= 0xff00 && code <= 0xff60) ||
      (code >= 0xffe0 && code <= 0xffe6)
    return total + (wide ? 2 : 1)
  }, 0)

export const padCells = (text: string, width: number) => text + ' '.repeat(Math.max(0, width - cellWidth(text)))

/** 칸 수 기준으로 줄을 나눈다. 한글은 두 칸이라 문자 수로 나누면 폭이 들쭉날쭉해진다. */
const wrapCells = (text: string, max: number) => {
  const words = text.split(' ')
  const lines: string[] = []
  let current = ''
  words.forEach((word) => {
    const candidate = current ? `${current} ${word}` : word
    if (cellWidth(candidate) > max && current) {
      lines.push(current)
      current = word
    } else {
      current = candidate
    }
  })
  if (current) lines.push(current)
  return lines
}

/* ── 아스키 키위 ──────────────────────────────────────── */

/**
 * `whoami`는 neofetch처럼 아스키 키위를 왼쪽에, 정보를 오른쪽에 둔다.
 * 아트는 저장소의 키위 일러스트를 알파와 밝기 기준으로 변환한 것이다.
 * 좁은 화면에서는 두 열이 들어가지 않아 아트를 위로 쌓는다.
 */
const kiwiArtWide = [
  '          .+*##*+.',
  '         .####%##%:',
  '         +#######%##*=-',
  '         #######*  :-=*#=',
  '        :%######*      .=+',
  '      .+########%',
  '     -###########=',
  '    :%###########*',
  '    #############+',
  '   .%############',
  '   :%##########*.',
  '    %########+:',
  '    -+*%+=-:#.',
  '     :+.    .*',
  '    +=       -*',
  '   *:         =+',
  '.:#:           =+   ::',
  '-**=:           **+##:',
  ' -#**:         .+::::',
]

const kiwiArtNarrow = [
  '       =*##+.',
  '      =#####*=-.',
  '      +####+ .-=*:',
  '     =#####*     :',
  '   :#######%.',
  '   #########.',
  '  :########*',
  '  -#######=',
  '   =**=-*',
  '   --    +',
  '  +.     .+',
  '-*.       .+:-=',
  ' **=       +-=:',
]

const kiwiFacts = [
  'name     Jihoon Jang / 장지훈',
  'role     Node.js Developer',
  'since    2020.02',
  'stack    Node.js · TypeScript · NestJS',
  'infra    AWS · Docker · MySQL · Redis',
  'where    Seoul, Korea (KST)',
  'resume   /resume/  (open resume)',
]

/** 실제 인용문 대신 이 포트폴리오의 목소리로 쓴 문장만 사용한다. */
const fortunes = [
  '완성은 상태가 아니라 잠깐 멈춘 지점이다.',
  '읽기 어려운 코드는 대개 결정을 미룬 흔적이다.',
  '고치기 쉬운 코드가 좋은 코드다. 나머지는 취향이다.',
  '버그는 대부분 내가 확신했던 곳에 있다.',
  '느린 쿼리는 언젠가 장애가 된다. 대개 새벽에.',
  '이름을 잘 지으면 주석이 절반으로 준다.',
  '지우는 커밋이 가장 기분 좋은 커밋이다.',
  '재현되지 않는 버그는 아직 이해하지 못한 버그다.',
  '문서는 미래의 나에게 보내는 사과문이다.',
  '테스트가 없으면 리팩터링이 아니라 도박이다.',
  '급한 수정일수록 되돌릴 방법을 먼저 정해둔다.',
  '로그가 없으면 추측만 남는다.',
  '설계는 무엇을 넣을지가 아니라 무엇을 안 넣을지의 문제다.',
  '동작하는 코드와 이해되는 코드는 다르다. 둘 다 필요하다.',
  '측정하지 않은 최적화는 취향의 표현이다.',
  '작게 나눈 커밋은 미래의 나를 구한다.',
  '경계에서 무너지는 코드가 가장 많다.',
  '남의 코드를 욕하기 전에 커밋 로그를 먼저 본다.',
  '재시도는 해결이 아니라 유예다.',
  '가장 오래 남는 코드는 임시로 짠 코드다.',
  'Simple is not the same as easy.',
  'Every abstraction leaks. Pick the one that leaks where you can see it.',
]

const buildBubbleFrom = (quote: string, max: number) => {
  const rows = wrapCells(quote, max)
  const width = rows.reduce((longest, row) => Math.max(longest, cellWidth(row)), 0)
  return [
    `.${'_'.repeat(width + 2)}.`,
    ...rows.map((row) => `| ${padCells(row, width)} |`),
    `'${'-'.repeat(width + 2)}'`,
  ]
}

const buildBubble = (max: number) => buildBubbleFrom(fortunes[Math.floor(Math.random() * fortunes.length)], max)

/**
 * 말하는 키위 패널. `whoami`와 `kiwisay`가 같은 배치를 쓴다.
 *
 * 넓은 화면은 아스키 키위를 왼쪽 고정 폭 열에, 말풍선을 오른쪽에 둔다.
 * 클로즈업 아트의 부리가 오른쪽을 향해 말풍선을 가리키므로 꼬리를 그리지 않는다.
 * 좁은 화면은 두 열이 들어가지 않으므로 말풍선을 위에 쌓고 꼬리를 아래로 내린다.
 *
 * `extra`는 말풍선 아래에 붙는 정보 블록이다. `whoami`만 사용한다.
 */
const buildKiwiPanel = (bubbleRows: string[], extra: string[], narrow: boolean): TerminalLine[] => {
  if (narrow) {
    return [
      ...bubbleRows.map((line) => fixed(line)),
      fixed('   \\', 'muted'),
      fixed('    \\', 'muted'),
      ...kiwiArtNarrow.map((line) => fixed(line, 'accent')),
      ...(extra.length ? [plain(''), ...extra.map((line) => fixed(line))] : []),
    ]
  }

  const art = kiwiArtWide
  const artWidth = art.reduce((max, line) => Math.max(max, line.length), 0)
  const right = extra.length ? [...bubbleRows, '', ...extra] : bubbleRows
  // 아트가 더 길므로 오른쪽 열을 세로 가운데에 맞춰 아래가 비어 보이지 않게 한다.
  const offset = Math.max(1, Math.floor((art.length - right.length) / 2))
  const rows = Math.max(art.length, right.length + offset)

  return Array.from({ length: rows }, (_, index) =>
    fixed(`${(art[index] ?? '').padEnd(artWidth)}   ${right[index - offset] ?? ''}`.trimEnd()),
  )
}

const buildWhoami = (narrow: boolean) => buildKiwiPanel(buildBubble(narrow ? 30 : 46), kiwiFacts, narrow)

const buildKiwiSay = (message: string, narrow: boolean) =>
  buildKiwiPanel(buildBubbleFrom(message.slice(0, 140), narrow ? 30 : 46), [], narrow)

/* ── git ──────────────────────────────────────────────── */

/**
 * 경력 연표를 커밋 로그로 읽는다. 해시는 고정 상수다.
 * 난수로 만들면 호출할 때마다 달라져서 `sessionStorage`에 남은 과거 출력과 어긋난다.
 * `--graph`의 갈래 문자는 좁은 화면에서 무너지므로 `--oneline` 계열만 쓴다.
 */
const commitLog: Array<{ hash: string; message: string; date: string; head?: boolean }> = [
  { hash: '4c1f9ab', message: 'chore: toss income으로 전적하다', date: '2025-03', head: true },
  { hash: '8e30d72', message: 'feat: 세이브잇 인수와 토스인컴을 만들기 시작하다', date: '2024-05' },
  { hash: 'b57a0c4', message: 'chore: 세무회계 2급을 취득하다', date: '2024' },
  { hash: '19fd6e8', message: 'feat: viva republica에 합류하다', date: '2021-11' },
  { hash: '6a2c85f', message: 'feat: 동네 부동산 직거래에 지도뷰를 붙이다', date: '2021-05' },
  { hash: 'd0b41e3', message: 'refactor: 어레인지 레거시를 nestjs로 옮기다', date: '2021-02' },
  { hash: '71e9c56', message: 'perf: 크롤러 세션을 정리해 메모리 누수를 잡다', date: '2020-08' },
  { hash: '3f8d240', message: 'feat: 건국대학교 컴퓨터공학과에 진학하다', date: '2020-03' },
  { hash: 'a95b1c7', message: 'feat: 테이킷에 배달 기능을 런칭하다', date: '2020-02' },
  { hash: 'c24e8f1', message: 'feat: 정보올림피아드 은상을 받다', date: '2018' },
  { hash: '0000000', message: 'init: hello, world', date: '2017-03' },
]

const buildGitLog = (narrow: boolean): TerminalLine[] => {
  const decorated = commitLog.map((commit) => ({
    ...commit,
    label: commit.head ? `(HEAD -> main) ${commit.message}` : commit.message,
  }))

  // 좁은 화면은 세 열이 들어가지 않는다. 해시와 날짜를 버리고 메시지만 남긴다.
  if (narrow) {
    return [
      ...decorated.map((commit) => fixed(`* ${commit.label}`)),
      plain(''),
      muted(`  ${commitLog.length} commits. the working tree is never clean.`),
    ]
  }

  const width = decorated.reduce((longest, commit) => Math.max(longest, cellWidth(commit.label)), 0)
  return [
    ...decorated.map((commit) => fixed(`* ${commit.hash} ${padCells(commit.label, width)}  ${commit.date}`)),
    plain(''),
    muted(`  ${commitLog.length} commits. the working tree is never clean.`),
  ]
}

const gitStatus: TerminalLine[] = [
  plain('On branch main'),
  plain("Your branch is ahead of 'origin/main' by 1 commit."),
  plain(''),
  plain('Changes not staged for commit:'),
  { text: '        modified:   career/toss-income', tone: 'error' },
  { text: '        modified:   portfolio/README.md', tone: 'error' },
  plain(''),
  muted('nothing else to commit, working tree mostly clean'),
]

/* ── man ──────────────────────────────────────────────── */

const buildManKiwi = (narrow: boolean): TerminalLine[] => {
  const header = narrow
    ? fixed('KIWI(1)          Portfolio Manual', 'muted')
    : fixed(`KIWI(1)${' '.repeat(21)}Portfolio Manual${' '.repeat(20)}KIWI(1)`, 'muted')

  return [
    header,
    plain(''),
    accent('NAME'),
    plain('       kiwi - a flightless bird that keeps walking'),
    plain(''),
    accent('SYNOPSIS'),
    plain('       kiwi [--from egg] [--to contact]'),
    plain(''),
    accent('DESCRIPTION'),
    plain('       Starts as an egg, cracks, and walks left to right'),
    plain('       through every company it has worked for. Changes'),
    plain('       props and background per chapter, never identity.'),
    plain(''),
    accent('OPTIONS'),
    plain('       --scroll     advance the story'),
    plain('       --stop       the scene stops with you'),
    plain(''),
    accent('SEE ALSO'),
    plain('       whoami(1), git-log(1)'),
  ]
}

/* ── 프레임 애니메이션 ────────────────────────────────── */

/**
 * `sl`은 `ls` 오타를 노린 유닉스 농담이다. 기차가 다 지나갈 때까지 기다리는 것이 벌이다.
 * 원본 프로그램의 아스키 아트를 옮기지 않고 이 저장소용으로 새로 그렸다.
 */
const trainSmoke = [
  [
    '        ~    ~   ~',
    '      (o)  (o) (o)',
  ],
  [
    '       ~   ~    ~',
    '     (o)  (o)  (o)',
  ],
]

const trainBody = [
  '     _______________',
  '    |   _________   |______________',
  '    |  |         |  |              |',
  ' ___|  |_________|  |______________|___',
  '|_____________________________________|',
  '   (O)   (O)        (O)      (O)',
]

const TRAIN_WIDTH = 39

/** 음수 오프셋은 왼쪽이 화면 밖으로 나간 상태다. 잘라내지 않으면 줄이 오른쪽으로 밀린다. */
const clipShift = (line: string, x: number, max: number) =>
  (x >= 0 ? ' '.repeat(x) + line : line.slice(-x)).slice(0, max).trimEnd()

const buildSteamLocomotive = (narrow: boolean): { lines: TerminalLine[]; frames: TerminalLine[][] } => {
  const columns = narrow ? 48 : 78
  const step = 4
  const frames: TerminalLine[][] = []

  // 실제 `sl`처럼 오른쪽에서 들어와 왼쪽으로 빠진다. 키위의 진행 방향과 반대다.
  for (let x = columns; x > -TRAIN_WIDTH; x -= step) {
    const art = [...trainSmoke[frames.length % 2], ...trainBody]
    frames.push(art.map((line) => fixed(clipShift(line, x, columns), 'accent')))
  }

  frames.push([
    ...Array.from({ length: trainSmoke[0].length + trainBody.length - 1 }, () => fixed('')),
    muted('you typed `sl`. the train does not take Ctrl-C.'),
  ])

  return { lines: frames[0], frames }
}

/**
 * 아스키 키위가 로그를 왼쪽에서 오른쪽으로 걸어 지나간다.
 * 모든 프레임의 줄 수를 같게 유지해야 재생 중 로그 높이가 출렁이지 않는다.
 * 한 칸 위아래로 흔드는 bob은 앞뒤 빈 줄의 위치를 바꿔 만든다.
 */
const buildKiwiWalk = (narrow: boolean): { lines: TerminalLine[]; frames: TerminalLine[][] } => {
  const art = kiwiArtNarrow
  const travel = narrow ? 22 : 44
  const step = 2
  const frames: TerminalLine[][] = []

  for (let x = 0; x <= travel; x += step) {
    const body = art.map((line) => fixed(' '.repeat(x) + line, 'accent'))
    const bob = (x / step) % 2 === 1
    frames.push(bob ? [fixed(''), ...body] : [...body, fixed('')])
  }

  // 화면 밖으로 나가고 발자국만 남는다. 줄 수는 그대로 유지한다.
  frames.push([
    ...Array.from({ length: art.length - 1 }, () => fixed('')),
    fixed(`  ${'. '.repeat(Math.floor(travel / 2)).trimEnd()}`, 'muted'),
    muted('the kiwi has left the terminal. it usually does.'),
  ])

  return { lines: frames[0], frames }
}

/**
 * 가짜 침입 로그. 실제로 하는 일은 없고 마지막에 스스로 실토한다.
 * 점은 직접 세지 않고 채운다. 손으로 세면 상태 열이 한두 칸씩 어긋난다.
 */
const HACK_STATUS_COLUMN = 34

const hackSteps: Array<{ time: string; label: string; status?: string; tone?: OutputTone }> = [
  { time: '0.000', label: 'initializing exploit framework', tone: 'muted' },
  { time: '0.104', label: 'target: portfolio.whitekiwi.link' },
  { time: '0.331', label: 'found 7 chapters, 1 terminal, 1 bird' },
  { time: '0.508', label: 'bypassing scroll listener', status: 'ok' },
  { time: '0.702', label: 'injecting payload into kiwi.walk', status: 'ok' },
  { time: '0.913', label: 'escalating privileges', status: 'ok' },
  { time: '1.140', label: 'mounting /career', status: 'ok' },
  { time: '1.402', label: 'decrypting 2020-2026', status: 'ok' },
  { time: '1.688', label: 'extracting salary expectations', status: '??' },
  { time: '2.004', label: 'ERROR: field is negotiable', tone: 'error' },
  { time: '2.210', label: 'retrying', status: 'failed' },
  { time: '2.455', label: 'falling back to social engineering' },
  { time: '2.701', label: 'sending friendly email', status: 'ok' },
]

const hackScript: TerminalLine[] = [
  ...hackSteps.map(({ time, label, status, tone }) => {
    const body = status
      ? `${label} ${'.'.repeat(Math.max(1, HACK_STATUS_COLUMN - label.length - 1))} ${status}`
      : label
    return { text: `[ ${time} ] ${body}`, tone: tone ?? 'default', grid: true } satisfies TerminalLine
  }),
  plain(''),
  failure('ACCESS DENIED'),
  muted('just kidding. `open resume` works and takes one second.'),
]

const buildHack = (): { lines: TerminalLine[]; frames: TerminalLine[][] } => {
  const frames = hackScript.map((_, index) => hackScript.slice(0, index + 1))
  return { lines: frames[0], frames }
}

/* ── whitekiwi ────────────────────────────────────────── */

/**
 * 유래는 시시하다. 그래서 두 번에 나눈다.
 *
 * 처음에는 되묻기만 하고 두 번째부터 실토한다. 감추기만 하면 얄밉고, 바로 말하면 김이 샌다.
 * 셋업 뒤에 오는 김빠짐이라야 농담이 된다. 되물을 때 안내를 붙이지 않는 이유는,
 * 되묻는 문장 자체가 한 번 더 쳐보게 만들기 때문이다. 설명하면 그 힘이 사라진다.
 * 새로고침하면 처음으로 돌아간다. 방문자마다 이 두 박자를 처음부터 겪는 편이 맞다.
 */
let whitekiwiAsked = 0

const buildWhitekiwi = (): TerminalLine[] => {
  whitekiwiAsked += 1

  if (whitekiwiAsked === 1) return [accent('whitekiwi'), plain('  why this name?')]

  return [
    accent('whitekiwi'),
    plain('  someone said a colour plus a fruit makes a good handle.'),
    plain('  so: a colour, and a fruit. that is the whole story.'),
    plain(''),
    muted('  the flightless bird that keeps walking came free with it.'),
  ]
}

/* ── beer ─────────────────────────────────────────────── */

/**
 * `sudo make me a sandwich`와 짝이 되는 명령. 그냥 실행하면 권한이 없고,
 * `sudo`로 통과해야 교환권이 나온다. 권한 오류 자체가 `sudo`를 발견하게 하는 단서다.
 */
const beerMug = [
  '  ______',
  ' ( ~~~~ )___',
  ' |::::::|   |',
  ' |::::::|   |',
  ' |::::::|___|',
  ' |______|',
]

const buildBeerVoucher = (narrow: boolean): TerminalLine[] => {
  const rows = [
    'BEER VOUCHER                 #001',
    '',
    'issued to    visitor',
    'signed       whitekiwi',
    'expires      never',
    '',
    'Show this screen to 장지훈.',
    'One beer. He already agreed.',
  ]
  const width = rows.reduce((longest, row) => Math.max(longest, cellWidth(row)), 0)
  const card = [
    `.${'-'.repeat(width + 2)}.`,
    ...rows.map((row) => `| ${padCells(row, width)} |`),
    `'${'-'.repeat(width + 2)}'`,
  ]

  // 좁은 화면에서는 두 열이 들어가지 않아 잔을 위에 쌓는다. `whoami`와 같은 규칙이다.
  if (narrow) {
    return [
      ...beerMug.map((line) => fixed(line, 'accent')),
      plain(''),
      ...card.map((line) => fixed(line)),
    ]
  }

  const mugWidth = beerMug.reduce((longest, line) => Math.max(longest, line.length), 0)
  const offset = Math.max(0, Math.floor((card.length - beerMug.length) / 2))
  return Array.from({ length: Math.max(card.length, beerMug.length + offset) }, (_, index) =>
    fixed(`${(beerMug[index - offset] ?? '').padEnd(mugWidth)}   ${card[index] ?? ''}`.trimEnd()),
  )
}

/* ── 그 밖의 고정 출력 ────────────────────────────────── */

const chapterEntries = [
  '00-prologue/',
  '01-introduction/',
  '02-education/',
  '03-whiteblock/',
  '04-fetching/',
  '05-aimpact/',
  '06-daangn/',
  '07-toss/',
]

const listing = [
  ...chapterEntries.map((name) => ({ name, detail: name, mode: 'drwxr-xr-x', hidden: false })),
  { name: 'resume.pdf', detail: 'resume.pdf -> /resume/', mode: '-rw-r--r--', hidden: false },
  { name: '.secrets', detail: '.secrets', mode: '-rw-------', hidden: true },
]

/** 실제 `ls`처럼 `-a`가 숨김 파일을, `-l`이 상세 형식을 켠다. 둘은 독립이다. */
const buildLs = (all: boolean, long: boolean, narrow: boolean): TerminalLine[] => {
  const visible = listing.filter((entry) => all || !entry.hidden)

  if (long) {
    return [
      muted(`total ${visible.length}`),
      ...visible.map((entry) => fixed(`${entry.mode}   ${entry.detail}`)),
    ]
  }

  // 한 줄로 이으면 130칸이 넘어 데스크톱에서도 접힌다. 실제 `ls`처럼 열로 나눈다.
  const perRow = narrow ? 2 : 4
  const columnWidth = visible.reduce((longest, entry) => Math.max(longest, entry.name.length), 0) + 3
  return Array.from({ length: Math.ceil(visible.length / perRow) }, (_, row) =>
    fixed(visible.slice(row * perRow, row * perRow + perRow).map((entry) => padCells(entry.name, columnWidth)).join('').trimEnd()),
  )
}

const LS_FLAGS = 'al'

const runLs = (args: string, narrow: boolean): CommandResult => {
  const tokens = args.split(' ').filter(Boolean)
  const flags = tokens.filter((token) => token.startsWith('-'))
  const paths = tokens.filter((token) => !token.startsWith('-'))

  for (const flag of flags) {
    // 실제 `ls`는 글자 단위로 읽다가 처음 만난 모르는 옵션에서 멈춘다.
    const unknown = [...flag.slice(1)].find((character) => !LS_FLAGS.includes(character))
    if (unknown || flag === '-') {
      return {
        lines: [
          failure(`ls: illegal option -- ${unknown ?? '-'}`),
          muted('usage: ls [-la] [file ...]'),
        ],
      }
    }
  }

  if (paths.length) return { lines: [failure(`ls: ${paths[0]}: No such file or directory`)] }

  const joined = flags.join('')
  return { lines: buildLs(joined.includes('a'), joined.includes('l'), narrow) }
}

/**
 * 하나를 찾으면 다음을 찾을 수 있게 남기는 목록.
 *
 * 전부 적지는 않는다. 개인적인 명령과 셸을 아는 사람이 습관으로 쳐볼 것들은 뺀다.
 * 대신 화면을 다루는 연출은 하나도 빠뜨리지 않는다. 이 층은 여기 말고는 발견할 단서가 없다.
 * 명령이 늘면 이 목록도 같이 늘려야 한다. 새 명령을 넣고 여기를 잊으면 아무도 못 찾는다.
 */
const secretGroups: Array<{ title: string; items: Array<[string, string]> }> = [
  {
    title: 'READ',
    items: [
      ['git log', 'the career as commits'],
      ['man kiwi', 'the manual for the bird'],
      ['whitekiwi', 'why this name'],
      ['why nodejs', 'an honest answer'],
      ['ping', 'is anyone out there'],
      ['uptime', 'how long this has run'],
    ],
  },
  {
    title: 'KIWI',
    items: [
      ['kiwi', 'let it walk through here'],
      ['kiwisay <text>', 'make the kiwi talk'],
    ],
  },
  {
    title: 'LOUD',
    items: [
      ['lightning', '⚡'],
      ['boom', 'do not run this in a call'],
      ['gravity', 'it was off the whole time'],
      ['earthquake', 'hold on'],
      ['flip', 'do a barrel roll'],
      ['matrix', 'wake up, visitor'],
      ['hack', 'not a real intrusion'],
      ['sl', 'a typo you will make'],
    ],
  },
  {
    title: 'ASK',
    items: [
      ['coffee', 'wrong kind of shell'],
      ['iloveyou', 'go on, then'],
    ],
  },
  {
    title: 'LOCKED',
    items: [
      ['beer', 'permission denied, for now'],
      ['make me a sandwich', 'xkcd 149'],
    ],
  },
]

/** 열 맞춤은 손으로 세지 않는다. `make me a sandwich`가 18칸이라 이름 열을 거기 맞춘다. */
const SECRET_NAME_COLUMN = 18

const secrets: TerminalLine[] = [
  muted('# not in `help`. that is the point.'),
  plain(''),
  ...secretGroups.flatMap(({ title, items }) => [
    accent(title),
    ...items.map(([name, note]) => fixed(`  ${name.padEnd(SECRET_NAME_COLUMN)}  ${note}`)),
    plain(''),
  ]),
  muted('there are still a few more. shells are like that.'),
]

const pingHosts = ['portfolio.whitekiwi.link', 'whitekiwi.link', 'blog.whitekiwi.link', 'whitekiwi.github.io', 'localhost']

const pingLines: TerminalLine[] = [
  plain('PING portfolio.whitekiwi.link (185.199.108.153): 56 data bytes'),
  plain('64 bytes from 185.199.108.153: icmp_seq=0 ttl=57 time=0.421 ms'),
  plain('64 bytes from 185.199.108.153: icmp_seq=1 ttl=57 time=0.388 ms'),
  plain('64 bytes from 185.199.108.153: icmp_seq=2 ttl=57 time=0.402 ms'),
  plain(''),
  muted('--- portfolio.whitekiwi.link ping statistics ---'),
  muted('3 packets transmitted, 3 packets received, 0.0% packet loss'),
  muted('round-trip min/avg/max = 0.388/0.404/0.421 ms'),
]

/** 경력 시작(2020-02)을 부팅 시각으로 본다. `/resume/`가 경력 길이를 계산하는 방식과 같다. */
const CAREER_START = new Date(2020, 1, 1)

const buildUptime = (): TerminalLine[] => {
  const now = new Date()
  const months = Math.max(0, (now.getFullYear() - CAREER_START.getFullYear()) * 12 + (now.getMonth() - CAREER_START.getMonth()))
  const clock = now.toTimeString().slice(0, 8)
  return [
    fixed(` ${clock} up ${Math.floor(months / 12)} years, ${months % 12} months,  1 user,  load average: 0.42, 0.31, 0.28`),
    muted(' (measured from the first commit of the first job.)'),
  ]
}

/** 실제 셸처럼 보관 중인 것을 전부 출력한다. 상한은 컴포넌트가 저장 단계에서 건다. */
const buildHistory = (history: string[]): TerminalLine[] => {
  if (!history.length) return [muted('No commands yet.')]
  return history.map((command, index) => fixed(`${String(index + 1).padStart(5)}  ${command}`))
}

/**
 * 진짜 `sudo`처럼 비밀번호를 묻는다.
 *
 * 비밀번호는 프롬프트에서 바로 알려준다. 가려진 입력창만 띄우면 습관적으로 실제 비밀번호를
 * 입력하는 사람이 생긴다. 어디로도 보내지 않고 저장하지도 않지만, 애초에 받지 않는 편이 낫다.
 * 알려줘도 농담은 그대로다. 재미는 셸이 진짜처럼 굴다가 실토하는 데 있다.
 */
export const SUDO_PASSWORD = 'password'

/**
 * 예외 없이 모든 `sudo <command>`가 비밀번호를 묻는다.
 * 실제 sudo의 credential cache를 흉내 내면 두 번째부터 프롬프트가 사라져서
 * 이 명령의 핵심 장면이 한 번만 보인다. 캐시를 두지 않는 편이 낫다.
 */
const buildSudo = (rest: string): CommandResult => {
  const target = rest.replace(/^(sudo\s+)+/, '').trim()
  if (!target) return { lines: [muted('usage: sudo <command>')] }

  return {
    lines: [
      plain('[sudo] password for visitor:'),
      muted(`(it is \`${SUDO_PASSWORD}\`. this is a portfolio, not a bank.)`),
    ],
    askPassword: target,
  }
}

/* ── 디스패치 ─────────────────────────────────────────── */

const openChannels: Record<string, { url: string; label: string; sameTab?: boolean }> = {
  resume: { url: resumeUrl, label: 'the resume' },
  github: { url: githubUrl, label: 'GitHub' },
  blog: { url: blogUrl, label: 'Blog' },
  linkedin: { url: linkedinUrl, label: 'LinkedIn' },
  instagram: { url: instagramUrl, label: 'Instagram' },
  instargram: { url: instagramUrl, label: 'Instagram' },
  email: { url: emailUrl, label: 'your email client', sameTab: true },
}

const runOpen = (channel: string): CommandResult => {
  const target = openChannels[channel]
  if (!target) {
    return {
      lines: [
        failure(`open: unknown channel: ${channel}`),
        muted('Run `open` to see the available channels.'),
      ],
    }
  }

  if (target.sameTab) {
    window.location.href = target.url
    return { lines: [ok('Opening your email client…')] }
  }

  const opened = window.open(target.url, '_blank')
  if (opened) opened.opener = null
  return {
    lines: [
      opened
        ? ok(`Opening ${target.label} in a new tab…`)
        : failure(`Popup blocked. Open manually: ${target.url}`),
    ],
  }
}

/** 인자를 받지 않는 명령. 뒤에 무언가 붙으면 셸다운 인자 오류를 낸다. */
const NO_ARG_COMMANDS = new Set([
  'whoami', 'pwd', 'history', 'uptime', 'clear', 'iloveyou', 'whitekiwi',
  'coffee', 'brew', 'emacs', 'vim', 'vi', 'exit', 'logout', 'close',
  'boom', 'lightning', 'gravity', 'earthquake', 'flip', 'hack', 'kiwi', 'sl', 'matrix', 'beer',
])

const buildHelp = (): TerminalLine[] => [
  accent('AVAILABLE COMMANDS'),
  ...commandList.map(([command, description]) => plain(`  ${command.padEnd(15)}${description}`)),
  muted('Use ↑ and ↓ to revisit command history.'),
]

/**
 * `command`는 컴포넌트가 이미 trim·소문자·공백 정규화한 문자열이다.
 * 원문 대소문자가 필요하면 `ctx.raw`를 쓴다.
 */
export const runCommand = (command: string, ctx: CommandContext): CommandResult => {
  const { narrow, history, raw, root } = ctx

  switch (command) {
    case 'help': return { lines: buildHelp() }
    case 'whoami': return { lines: buildWhoami(narrow) }
    case 'iloveyou':
      return {
        lines: [
          accent('I love you too'),
          muted('(the kiwi is blushing. ascii does not carry that.)'),
        ],
      }
    case 'history': return { lines: buildHistory(history) }
    case 'pwd': return { lines: [plain('/portfolio/whitekiwi/contact')] }
    case 'ls': return runLs('', narrow)
    case 'ping': return { lines: pingLines }
    case 'uptime': return { lines: buildUptime() }
    case 'git log': case 'git log --oneline': return { lines: buildGitLog(narrow) }
    case 'git status': return { lines: gitStatus }
    case 'git blame': return { lines: [plain('always me.')] }
    case 'whitekiwi':
      return { lines: buildWhitekiwi() }
    // 면접 답변처럼 셋을 세우고 마지막에 순서를 뒤집는다. 셋 다 진짜 이유이긴 하다.
    case 'why nodejs': case 'why node': case 'why node.js':
      return {
        lines: [
          accent('why nodejs'),
          fixed('  1. one language across the whole stack'),
          fixed('  2. the event loop is genuinely elegant'),
          fixed('  3. it was already installed'),
          plain(''),
          muted('  the honest order is 3, 1, 2.'),
        ],
      }
    case 'why':
      return {
        lines: [
          muted('usage: why <thing>'),
          plain('  only one thing has an answer so far.'),
        ],
      }
    case 'coffee': case 'brew':
      return {
        lines: [
          failure("418 I'm a teapot"),
          muted('This shell brews stories, not coffee.'),
        ],
      }
    case 'emacs':
      return { lines: [plain('emacs: not installed.'), muted('vim is that way →')] }
    case 'vim': case 'vi':
      return {
        lines: [
          plain('vim: no editor in this shell.'),
          muted('and you would never leave anyway.'),
        ],
      }
    // `close`는 터미널 창의 빨간 버튼이 실행한다. 창을 실제로 닫지는 않는다.
    case 'exit': case 'logout': case 'close':
      return {
        lines: [
          plain('logout'),
          plain('Connection to whitekiwi closed.'),
          muted('(the tab is still open. that one is on you.)'),
        ],
      }
    // xkcd 149. root일 때만 통하므로 `sudo`를 거쳐야 하고, 그 경로도 비밀번호를 묻는다.
    case 'make me a sandwich':
      return { lines: root ? [ok('Okay.')] : [plain('What? Make it yourself.')] }
    case 'rm -rf /':
      return {
        lines: [
          failure("rm: it is dangerous to operate recursively on '/'"),
          muted('rm: use --no-preserve-root to override this failsafe'),
        ],
      }
    case 'rm -rf / --no-preserve-root':
      return {
        lines: [
          ...chapterEntries.map((entry) => plain(`removing ${entry} ... done`)),
          plain(''),
          failure('error: could not remove 2017-2026. those already happened.'),
          muted('nothing was harmed. this journey is read-only.'),
        ],
      }
    case 'lightning':
      return {
        lines: [
          failure('zsh: segmentation fault (core dumped)'),
          muted('(kidding. the lights just flickered.)'),
        ],
        effect: 'lightning',
      }
    case 'boom':
      return {
        lines: [
          accent('boom: 1 explosion staged.'),
          muted('no files were harmed. the headline will recover.'),
        ],
        effect: 'boom',
      }
    case 'gravity':
      return {
        lines: [
          accent('gravity: enabled.'),
          muted('it was off this whole time. nobody noticed.'),
        ],
        effect: 'gravity',
      }
    case 'earthquake':
      return {
        lines: [
          failure('seismic event detected. magnitude 4.6.'),
          muted('hold on. it stops by itself.'),
        ],
        effect: 'earthquake',
      }
    case 'flip': case 'do a barrel roll':
      return {
        lines: [accent('do a barrel roll.')],
        effect: 'flip',
      }
    case 'hack':
      return { ...buildHack(), frameInterval: 130 }
    case 'kiwi':
      return { ...buildKiwiWalk(narrow), frameInterval: 95 }
    case 'sl':
      return { ...buildSteamLocomotive(narrow), frameInterval: 75 }
    case 'matrix':
      return {
        lines: [accent('wake up, visitor.'), muted('(press any key to stop.)')],
        overlay: 'matrix',
      }
    // `sudo beer`와 `sudo buy me a beer`는 여기 오지 않는다. sudo 접두사 처리가 먼저 잡아
    // 비밀번호를 물은 뒤 root로 다시 부른다. 여기 exact case를 두면 그 흐름을 건너뛴다.
    case 'beer': case 'buy me a beer':
      if (!root) {
        return {
          lines: [
            failure('beer: permission denied'),
            muted('this one needs elevated privileges. and a human.'),
          ],
        }
      }
      return { lines: buildBeerVoucher(narrow) }
    case 'cat .secrets':
      return { lines: secrets }
    case 'man kiwi': case 'man whitekiwi':
      return { lines: buildManKiwi(narrow) }
    case 'man':
      return { lines: [muted('What manual page do you want?'), plain('  man kiwi')] }
    case 'git':
      return {
        lines: [
          muted('usage: git <command>'),
          plain('  log      the career as a commit history'),
          plain('  status   what is still in progress'),
          plain('  blame    who did this'),
        ],
      }
    case 'cat':
      return {
        lines: [
          muted('usage: cat <file>'),
          plain('  run `ls -la` to see what is here.'),
        ],
      }
    case 'echo':
      return { lines: [plain('')] }
    case 'kiwisay':
      return { lines: [muted('usage: kiwisay <text>')] }
    case 'sudo':
      return { lines: [muted('usage: sudo <command>')] }
    case 'open':
      return {
        lines: [
          accent('usage: open <channel>'),
          muted('available channels:'),
          ...['resume', 'github', 'blog', 'linkedin', 'instagram', 'email'].map((channel) => plain(`  ${channel}`)),
        ],
      }
  }

  if (command === 'ls' || command.startsWith('ls ')) return runLs(command.slice(2).trim(), narrow)
  if (command.startsWith('git log')) return { lines: buildGitLog(narrow) }
  if (command.startsWith('git status')) return { lines: gitStatus }
  if (command.startsWith('git blame')) return { lines: [plain('always me.')] }
  if (command.startsWith('help ')) return { lines: buildHelp() }
  if (command.startsWith('why ')) {
    return { lines: [failure(`why: I have not thought about ${command.slice(4).trim()} that hard.`)] }
  }
  if (command.startsWith('ping ')) {
    const host = command.slice(5).trim()
    if (pingHosts.includes(host)) return { lines: pingLines }
    return { lines: [failure(`ping: cannot resolve ${host}: Unknown host`)] }
  }
  if (command.startsWith('open ')) return runOpen(command.slice(5).trim())
  // 원문 대소문자를 살린다. 정규화된 `command`를 쓰면 입력이 전부 소문자로 되돌아온다.
  if (command.startsWith('echo ')) return { lines: [plain(raw.trim().slice(5).trim().slice(0, 200))] }
  if (command.startsWith('kiwisay ')) return { lines: buildKiwiSay(raw.trim().slice(8).trim(), narrow) }
  if (command.startsWith('sudo ')) return buildSudo(command.slice(5).trim())
  if (command.startsWith('cat ')) {
    const tokens = command.slice(4).trim().split(' ').filter(Boolean)
    const flag = tokens.find((token) => token.startsWith('-'))
    if (flag) {
      return {
        lines: [
          failure(`cat: illegal option -- ${flag.slice(1)[0] ?? '-'}`),
          muted('usage: cat [file ...]'),
        ],
      }
    }
    return { lines: [failure(`cat: ${tokens[0]}: No such file or directory`)] }
  }
  if (command.startsWith('man ')) {
    return { lines: [failure(`No manual entry for ${command.slice(4).trim()}`)] }
  }
  if (command.startsWith('git ')) {
    return { lines: [failure(`git: '${command.slice(4).trim()}' is not a git command. See 'git'.`)] }
  }
  if (command === 'rm' || command.startsWith('rm ')) {
    return { lines: [failure('rm: this journey is read-only.')] }
  }
  if (command === 'cd' || command.startsWith('cd ')) {
    const target = command.slice(2).trim() || '~'
    return {
      lines: [
        failure(`zsh: cd: ${target}: permission denied`),
        muted('This journey is read-only. Try `help` instead.'),
      ],
    }
  }

  /**
   * 아는 명령에 모르는 인자가 붙었을 때 `command not found`를 내면 명령 자체를 모르는 것처럼 읽힌다.
   * 실제 셸은 명령을 찾은 뒤 인자를 파싱하다가 실패한다. 그 순서를 흉내 낸다.
   */
  const [head, ...rest] = command.split(' ')
  if (NO_ARG_COMMANDS.has(head) && rest.length) {
    const flag = rest.find((token) => token.startsWith('-'))
    return {
      lines: flag
        ? [failure(`${head}: illegal option -- ${flag.slice(1)[0] ?? '-'}`), muted(`usage: ${head}`)]
        : [failure(`${head}: too many arguments`), muted(`usage: ${head}`)],
    }
  }

  return {
    lines: [
      failure(`zsh: command not found: ${command}`),
      muted('Type `help` to see the commands available here.'),
    ],
    notFound: true,
  }
}
