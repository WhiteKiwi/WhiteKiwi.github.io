import { useCallback, useEffect, useMemo, useRef, useState, type CSSProperties, type FormEvent, type KeyboardEvent } from 'react'
import './contact-finale.css'

type ContactStyle = CSSProperties & {
  '--contact-progress'?: number
  '--glow-x'?: string
  '--glow-y'?: string
}

type OutputTone = 'default' | 'muted' | 'accent' | 'error' | 'success'

type TerminalLine = {
  text: string
  tone?: OutputTone
}

type TerminalEntry = {
  id: number
  command: string
  lines: TerminalLine[]
}

const TERMINAL_STORAGE_KEY = 'whitekiwi-contact-terminal-v1'
const githubUrl = 'https://github.com/whitekiwi'
const blogUrl = 'https://blog.whitekiwi.link'
const linkedinUrl = 'https://www.linkedin.com/in/whitekiwi/'
const instagramUrl = 'https://www.instagram.com/whitekiwi_'
const emailUrl = 'mailto:jh145478@gmail.com'
const resumeUrl = '/resume/'

const commandList = [
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

const availableCommands = commandList.map(([command]) => command)

/**
 * `whoami`는 neofetch처럼 아스키 키위를 왼쪽에, 정보를 오른쪽에 둔다.
 * 아트는 저장소의 키위 일러스트를 알파와 밝기 기준으로 변환한 것이다.
 * 좁은 화면에서는 두 열이 들어가지 않아 아트를 위로 쌓는다.
 */
const kiwiArtWide = [
  '      .=*####*=',
  '     -%########%:',
  '    .%#####%%##%#+=-.',
  '    .%########%***#*#*=',
  '     %#########    :=+##=',
  '    +%########%.       -**',
  '  .*############',
  ' -%############%=',
  ':%##############%',
  '*###############%',
  '%###############*',
  '################.',
]

const kiwiArtNarrow = [
  '    :+###*-',
  '   -####%#%+:',
  '   +#######**#+-',
  '   +######:  .-+#:',
  '  -#######*     .=',
  ' +#########-',
  '=##########*',
  '###########*',
  '###########.',
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

/** 한글·CJK는 모노스페이스에서 두 칸을 차지한다. 말풍선 테두리를 맞추려면 칸 수로 세야 한다. */
const cellWidth = (text: string) =>
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

const padCells = (text: string, width: number) => text + ' '.repeat(Math.max(0, width - cellWidth(text)))

const buildWhoami = (): TerminalLine[] => {
  const narrow = window.innerWidth < 760
  const art = narrow ? kiwiArtNarrow : kiwiArtWide
  const artWidth = art.reduce((max, line) => Math.max(max, line.length), 0)
  const bubble = buildBubble(narrow ? 30 : 64)

  if (narrow) {
    return [
      ...bubble,
      ...art.map((line) => ({ text: line, tone: 'accent' as const })),
      { text: '', tone: 'default' as const },
      ...kiwiFacts.map((fact) => ({ text: fact, tone: 'default' as const })),
    ]
  }

  // 정보 블록을 아트 높이의 가운데에 맞춘다.
  const offset = Math.max(0, Math.floor((art.length - kiwiFacts.length) / 2))
  const fetch = art.map((line, index) => {
    const fact = kiwiFacts[index - offset] ?? ''
    return { text: `${line.padEnd(artWidth)}   ${fact}`.trimEnd(), tone: 'default' as const }
  })
  return [...bubble, ...fetch]
}

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

/** 말풍선이 먼저 오고 꼬리가 아래로 내려가 그 아래의 키위를 가리킨다. */
const buildBubble = (max: number): TerminalLine[] => {
  const quote = fortunes[Math.floor(Math.random() * fortunes.length)]
  const rows = wrapCells(quote, max)
  const width = rows.reduce((longest, row) => Math.max(longest, cellWidth(row)), 0)
  return [
    { text: `.${'_'.repeat(width + 2)}.`, tone: 'default' },
    ...rows.map((row) => ({ text: `| ${padCells(row, width)} |`, tone: 'accent' as const })),
    { text: `'${'-'.repeat(width + 2)}'`, tone: 'default' },
    { text: '   \\', tone: 'muted' },
    { text: '    \\', tone: 'muted' },
  ]
}

/** 로컬에서는 짧게 잡아 확인하기 쉽게 한다. */
const IDLE_STROLL_DELAY = import.meta.env.DEV ? 10_000 : 30_000

const loadTerminalEntries = (): TerminalEntry[] => {
  try {
    const saved = window.sessionStorage.getItem(TERMINAL_STORAGE_KEY)
    if (!saved) return []
    const parsed = JSON.parse(saved)
    return Array.isArray(parsed) ? parsed as TerminalEntry[] : []
  } catch {
    return []
  }
}

export default function ContactFinale({ active }: { active: boolean }) {
  const trackRef = useRef<HTMLElement>(null)
  const terminalInputRef = useRef<HTMLInputElement>(null)
  const terminalLogRef = useRef<HTMLDivElement>(null)
  const nextEntryIdRef = useRef(Date.now())
  const hasBootedRef = useRef(false)
  const hasAnimatedRef = useRef(false)
  const [entries, setEntries] = useState<TerminalEntry[]>(loadTerminalEntries)
  const [input, setInput] = useState('')
  const [historyIndex, setHistoryIndex] = useState(-1)
  const [bootCommand, setBootCommand] = useState('')
  const [bootReady, setBootReady] = useState(false)
  const [isStrolling, setIsStrolling] = useState(false)
  // 0이면 DOM에 없다. 재생 중에만 마운트해 장면 전환 때 터미널 없이 노출되지 않게 한다.
  const [peekRun, setPeekRun] = useState(0)
  const notFoundCountRef = useRef(0)

  const commandHistory = useMemo(() => entries.map((entry) => entry.command).filter(Boolean), [entries])

  // 터미널이 준비된 뒤 일정 시간 입력이 없으면 키위가 아래 경계를 한 번 걸어 지나간다.
  useEffect(() => {
    if (!bootReady || isStrolling) return
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return

    let timer = window.setTimeout(() => setIsStrolling(true), IDLE_STROLL_DELAY)
    const restart = () => {
      window.clearTimeout(timer)
      timer = window.setTimeout(() => setIsStrolling(true), IDLE_STROLL_DELAY)
    }

    const terminal = terminalLogRef.current?.closest('.contact-terminal')
    terminal?.addEventListener('keydown', restart)
    terminal?.addEventListener('pointerdown', restart)

    return () => {
      window.clearTimeout(timer)
      terminal?.removeEventListener('keydown', restart)
      terminal?.removeEventListener('pointerdown', restart)
    }
  }, [bootReady, isStrolling, entries, input])

  useEffect(() => {
    try {
      if (entries.length) window.sessionStorage.setItem(TERMINAL_STORAGE_KEY, JSON.stringify(entries.slice(-30)))
      else window.sessionStorage.removeItem(TERMINAL_STORAGE_KEY)
    } catch {
      // The terminal still works when storage is unavailable.
    }
  }, [entries])

  useEffect(() => {
    terminalLogRef.current?.scrollTo({ top: terminalLogRef.current.scrollHeight, behavior: 'smooth' })
  }, [entries, bootReady])

  useEffect(() => {
    if (!active) return
    const track = trackRef.current
    if (!track) return

    const tossTrack = document.querySelector<HTMLElement>('.toss-ongoing-track')
    const documentRoot = document.documentElement
    const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    let revealFrame = 0
    let snapFrame = 0
    let snapSettleTimer = 0
    let snapLocked = false
    let snapSettling = false
    let snapAnchorY: number | null = null
    let previousScrollBehavior: string | null = null
    let lastPageY = window.scrollY
    let touchStartY: number | null = null
    let touchStartX: number | null = null
    let touchFromTerminal = false
    /** 터미널은 자체 스크롤과 가로 스크롤을 가진 위젯이다. 그 안의 제스처를 장면 전환으로 소비하지 않는다. */
    const insideTerminal = (target: EventTarget | null) =>
      Boolean((target as Element | null)?.closest?.('.contact-terminal'))
    const clamp = (value: number) => Math.min(Math.max(value, 0), 1)
    const easeInOut = (value: number) => value < .5
      ? 4 * value * value * value
      : 1 - Math.pow(-2 * value + 2, 3) / 2
    const getTrackProgress = (target: HTMLElement) => {
      const rect = target.getBoundingClientRect()
      const distance = Math.max(target.offsetHeight - window.innerHeight, 1)
      return { progress: clamp(-rect.top / distance), rect, distance }
    }
    const normalizeWheelDelta = (event: WheelEvent) => {
      if (event.deltaMode === WheelEvent.DOM_DELTA_LINE) return event.deltaY * 16
      if (event.deltaMode === WheelEvent.DOM_DELTA_PAGE) return event.deltaY * window.innerHeight
      return event.deltaY
    }
    const snapOwnedElsewhere = () => {
      const owner = documentRoot.dataset.portfolioTransition
      return Boolean(owner && owner !== 'contact')
    }
    const claimSnap = () => {
      if (snapOwnedElsewhere()) return false
      documentRoot.dataset.portfolioTransition = 'contact'
      return true
    }
    const releaseSnap = () => {
      if (documentRoot.dataset.portfolioTransition === 'contact') delete documentRoot.dataset.portfolioTransition
    }
    const restoreScrollBehavior = () => {
      if (previousScrollBehavior === null) return
      documentRoot.style.scrollBehavior = previousScrollBehavior
      previousScrollBehavior = null
    }
    const releaseSnapAfterQuiet = () => {
      if (!snapSettling) return
      if (snapSettleTimer) window.clearTimeout(snapSettleTimer)
      snapSettleTimer = window.setTimeout(() => {
        lastPageY = window.scrollY
        touchStartY = null
        snapLocked = false
        snapSettling = false
        snapAnchorY = null
        restoreScrollBehavior()
        releaseSnap()
        snapSettleTimer = 0
      }, 280)
    }

    const startReveal = () => {
      if (hasAnimatedRef.current) return
      hasAnimatedRef.current = true
      if (reducedMotion) {
        track.style.setProperty('--contact-progress', '1')
        return
      }
      const startedAt = performance.now()
      const duration = 1900
      const animate = (now: number) => {
        const progress = clamp((now - startedAt) / duration)
        const eased = 1 - Math.pow(1 - progress, 3)
        track.style.setProperty('--contact-progress', String(eased))
        if (progress < 1) revealFrame = window.requestAnimationFrame(animate)
        else revealFrame = 0
      }
      revealFrame = window.requestAnimationFrame(animate)
    }
    const resetReveal = () => {
      if (revealFrame) window.cancelAnimationFrame(revealFrame)
      revealFrame = 0
      hasAnimatedRef.current = false
      track.style.setProperty('--contact-progress', '0')
    }
    const getTrackTarget = (target: HTMLElement, progress: number) => {
      const top = window.scrollY + target.getBoundingClientRect().top
      const distance = Math.max(target.offsetHeight - window.innerHeight, 0)
      return top + distance * progress
    }
    const animateScrollTo = (targetY: number, onComplete?: () => void) => {
      if (snapLocked || !claimSnap()) return false
      snapLocked = true
      snapSettling = false
      const startY = window.scrollY
      const distance = targetY - startY
      const duration = reducedMotion ? 20 : 650
      const startedAt = performance.now()
      previousScrollBehavior = documentRoot.style.scrollBehavior
      documentRoot.style.scrollBehavior = 'auto'
      const animate = (now: number) => {
        const progress = clamp((now - startedAt) / duration)
        snapAnchorY = startY + distance * easeInOut(progress)
        window.scrollTo(0, snapAnchorY)
        lastPageY = window.scrollY
        if (progress < 1) snapFrame = window.requestAnimationFrame(animate)
        else {
          snapFrame = 0
          snapAnchorY = targetY
          onComplete?.()
          snapSettling = true
          releaseSnapAfterQuiet()
        }
      }
      snapFrame = window.requestAnimationFrame(animate)
      return true
    }
    const snapToContact = () => animateScrollTo(getTrackTarget(track, 0), startReveal)
    const snapToToss = () => {
      if (!tossTrack || snapLocked || snapOwnedElsewhere()) return
      resetReveal()
      animateScrollTo(getTrackTarget(tossTrack, .72))
    }
    const tossWouldCrossContactGate = (downwardDelta: number) => {
      if (!tossTrack) return false
      const { progress, rect, distance } = getTrackProgress(tossTrack)
      const projectedProgress = progress + Math.max(downwardDelta, 0) / distance
      return projectedProgress >= .86 && rect.top <= 1 && rect.bottom > 0
    }
    const contactIsActive = () => {
      const rect = track.getBoundingClientRect()
      return rect.top <= 1 && rect.top > -window.innerHeight * .16 && rect.bottom > 0
    }
    const onScroll = () => {
      const nextPageY = window.scrollY
      const scrollingDown = nextPageY > lastPageY + 1
      const scrollingUp = nextPageY < lastPageY - 1
      lastPageY = nextPageY
      if (snapLocked) {
        if (snapAnchorY !== null && Math.abs(window.scrollY - snapAnchorY) > 1) {
          window.scrollTo(0, snapAnchorY)
          lastPageY = snapAnchorY
        }
        return
      }
      if (scrollingDown && tossWouldCrossContactGate(0)) snapToContact()
      else if (scrollingUp && contactIsActive()) snapToToss()
    }
    const onWheel = (event: WheelEvent) => {
      if (snapLocked) {
        if (snapSettling) releaseSnapAfterQuiet()
        event.preventDefault()
        return
      }
      const deltaY = normalizeWheelDelta(event)
      if (deltaY > 0 && tossWouldCrossContactGate(deltaY)) {
        event.preventDefault()
        snapToContact()
        return
      }
      if (deltaY < 0 && insideTerminal(event.target)) return
      if (deltaY < 0 && contactIsActive()) {
        event.preventDefault()
        snapToToss()
      }
    }
    const onTouchStart = (event: TouchEvent) => {
      touchStartY = event.touches[0]?.clientY ?? null
      touchStartX = event.touches[0]?.clientX ?? null
      touchFromTerminal = insideTerminal(event.target)
    }
    const onTouchMove = (event: TouchEvent) => {
      if (snapLocked) {
        if (snapSettling) releaseSnapAfterQuiet()
        event.preventDefault()
        return
      }
      if (touchFromTerminal) return

      const currentY = event.touches[0]?.clientY
      const currentX = event.touches[0]?.clientX
      const dy = touchStartY !== null && currentY !== undefined ? currentY - touchStartY : 0
      const dx = touchStartX !== null && currentX !== undefined ? currentX - touchStartX : 0
      // 가로로 쓸어넘기려는 제스처에 섞인 세로 성분을 전환으로 오해하지 않는다.
      if (Math.abs(dy) <= Math.abs(dx)) return

      if (-dy > 8 && tossWouldCrossContactGate(-dy)) {
        event.preventDefault()
        snapToContact()
        return
      }
      if (dy > 8 && contactIsActive()) {
        event.preventDefault()
        snapToToss()
      }
    }
    const scrollKeys = new Set(['ArrowUp', 'ArrowDown', 'PageUp', 'PageDown', 'Home', 'End', ' '])
    const onKeyDown = (event: globalThis.KeyboardEvent) => {
      if (!scrollKeys.has(event.key)) return
      const target = event.target as HTMLElement | null
      if (target?.matches('input, textarea, select, [contenteditable="true"]')) return
      if (snapLocked) {
        if (snapSettling) releaseSnapAfterQuiet()
        event.preventDefault()
        return
      }
      const downwardDelta = event.key === 'End'
        ? Number.POSITIVE_INFINITY
        : event.key === 'PageDown' || event.key === ' '
          ? window.innerHeight
          : event.key === 'ArrowDown'
            ? 120
            : 0
      if (downwardDelta > 0 && tossWouldCrossContactGate(downwardDelta)) {
        event.preventDefault()
        snapToContact()
        return
      }
      const upward = event.key === 'Home' || event.key === 'PageUp' || event.key === 'ArrowUp'
      if (upward && contactIsActive()) {
        event.preventDefault()
        snapToToss()
      }
    }
    const onPointerMove = (event: PointerEvent) => {
      if (event.pointerType === 'touch') return
      const rect = track.getBoundingClientRect()
      track.style.setProperty('--glow-x', `${event.clientX - rect.left}px`)
      track.style.setProperty('--glow-y', `${event.clientY - rect.top}px`)
    }

    const observer = new IntersectionObserver((observations) => {
      const visible = observations.some((observation) => observation.isIntersecting && observation.intersectionRatio >= .6)
      if (visible) startReveal()
    }, { threshold: [.6] })
    observer.observe(track)
    window.addEventListener('scroll', onScroll, { passive: true })
    window.addEventListener('wheel', onWheel, { passive: false })
    window.addEventListener('touchstart', onTouchStart, { passive: true })
    window.addEventListener('touchmove', onTouchMove, { passive: false })
    window.addEventListener('keydown', onKeyDown)
    track.addEventListener('pointermove', onPointerMove, { passive: true })
    return () => {
      observer.disconnect()
      if (revealFrame) window.cancelAnimationFrame(revealFrame)
      if (snapFrame) window.cancelAnimationFrame(snapFrame)
      if (snapSettleTimer) window.clearTimeout(snapSettleTimer)
      snapAnchorY = null
      restoreScrollBehavior()
      releaseSnap()
      window.removeEventListener('scroll', onScroll)
      window.removeEventListener('wheel', onWheel)
      window.removeEventListener('touchstart', onTouchStart)
      window.removeEventListener('touchmove', onTouchMove)
      window.removeEventListener('keydown', onKeyDown)
      track.removeEventListener('pointermove', onPointerMove)
    }
  }, [active])

  useEffect(() => {
    if (!active || hasBootedRef.current || !trackRef.current) return
    const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    const fullCommand = '$ contact --interactive'
    let typeTimer = 0
    let readyTimer = 0

    const startBoot = () => {
      if (hasBootedRef.current) return
      hasBootedRef.current = true
      if (reducedMotion) {
        setBootCommand(fullCommand)
        setBootReady(true)
        return
      }

      let character = 0
      typeTimer = window.setInterval(() => {
        character += 1
        setBootCommand(fullCommand.slice(0, character))
        if (character === fullCommand.length) {
          window.clearInterval(typeTimer)
          readyTimer = window.setTimeout(() => setBootReady(true), 360)
        }
      }, 42)
    }

    const observer = new IntersectionObserver((observations) => {
      if (observations.some((observation) => observation.isIntersecting)) {
        startBoot()
        observer.disconnect()
      }
    }, { threshold: .55 })
    observer.observe(trackRef.current)

    return () => {
      observer.disconnect()
      if (typeTimer) window.clearInterval(typeTimer)
      if (readyTimer) window.clearTimeout(readyTimer)
    }
  }, [active])

  const executeCommand = useCallback((rawCommand: string) => {
    const command = rawCommand.trim().toLowerCase().replace(/\s+/g, ' ')
    if (!command) return

    if (command === 'clear') {
      setEntries([])
      setInput('')
      setHistoryIndex(-1)
      try {
        window.sessionStorage.removeItem(TERMINAL_STORAGE_KEY)
      } catch {
        // Clearing the visible terminal still works when storage is unavailable.
      }
      return
    }

    let lines: TerminalLine[]
    if (command === 'help') {
      lines = [
        { text: 'AVAILABLE COMMANDS', tone: 'accent' },
        ...commandList.map(([command, description]) => ({
          text: `  ${command.padEnd(15)}${description}`,
          tone: 'default' as const,
        })),
        { text: 'Use ↑ and ↓ to revisit command history.', tone: 'muted' },
      ]
    } else if (command === 'whoami') {
      lines = buildWhoami()
    } else if (command === 'iloveyou') {
      lines = [{ text: 'I love you too', tone: 'accent' }]
    } else if (command === 'open') {
      lines = [
        { text: 'usage: open <channel>', tone: 'accent' },
        { text: 'available channels:', tone: 'muted' },
        { text: '  resume', tone: 'default' },
        { text: '  github', tone: 'default' },
        { text: '  blog', tone: 'default' },
        { text: '  linkedin', tone: 'default' },
        { text: '  instagram', tone: 'default' },
        { text: '  email', tone: 'default' },
      ]
    } else if (command === 'open resume') {
      const opened = window.open(resumeUrl, '_blank')
      if (opened) opened.opener = null
      lines = [{ text: opened ? 'Opening the resume in a new tab…' : `Popup blocked. Open manually: ${resumeUrl}`, tone: opened ? 'success' : 'error' }]
    } else if (command === 'open github') {
      const opened = window.open(githubUrl, '_blank')
      if (opened) opened.opener = null
      lines = [{ text: opened ? 'Opening GitHub in a new tab…' : `Popup blocked. Open manually: ${githubUrl}`, tone: opened ? 'success' : 'error' }]
    } else if (command === 'open blog') {
      const opened = window.open(blogUrl, '_blank')
      if (opened) opened.opener = null
      lines = [{ text: opened ? 'Opening Blog in a new tab…' : `Popup blocked. Open manually: ${blogUrl}`, tone: opened ? 'success' : 'error' }]
    } else if (command === 'open linkedin') {
      const opened = window.open(linkedinUrl, '_blank')
      if (opened) opened.opener = null
      lines = [{ text: opened ? 'Opening LinkedIn in a new tab…' : `Popup blocked. Open manually: ${linkedinUrl}`, tone: opened ? 'success' : 'error' }]
    } else if (command === 'open instagram' || command === 'open instargram') {
      const opened = window.open(instagramUrl, '_blank')
      if (opened) opened.opener = null
      lines = [{ text: opened ? 'Opening Instagram in a new tab…' : `Popup blocked. Open manually: ${instagramUrl}`, tone: opened ? 'success' : 'error' }]
    } else if (command === 'open email') {
      lines = [{ text: 'Opening your email client…', tone: 'success' }]
      window.location.href = emailUrl
    } else if (command === 'cd' || command.startsWith('cd ')) {
      const target = command.slice(2).trim() || '~'
      lines = [
        { text: `zsh: cd: ${target}: permission denied`, tone: 'error' },
        { text: 'This journey is read-only. Try `help` instead.', tone: 'muted' },
      ]
    } else if (command.startsWith('open ')) {
      lines = [
        { text: `open: unknown channel: ${command.slice(5)}`, tone: 'error' },
        { text: 'Run `open` to see the available channels.', tone: 'muted' },
      ]
    } else {
      lines = [
        { text: `zsh: command not found: ${command}`, tone: 'error' },
        { text: 'Type `help` to see the commands available here.', tone: 'muted' },
      ]
      // 첫 오답은 그냥 넘기고 두 번째부터 키위가 터미널 뒤에서 빼꼼 올라온다.
      // 한 번 만에 나오면 우연이 아니라 기능처럼 보여서 발견하는 재미가 줄어든다.
      notFoundCountRef.current += 1
      if (notFoundCountRef.current >= 2) setPeekRun((current) => current + 1)
    }

    nextEntryIdRef.current += 1
    setEntries((current) => [...current, { id: nextEntryIdRef.current, command, lines }].slice(-30))
    setInput('')
    setHistoryIndex(-1)
  }, [])

  const submitCommand = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    executeCommand(input)
  }

  const navigateHistory = (event: KeyboardEvent<HTMLInputElement>) => {
    if (event.key !== 'ArrowUp' && event.key !== 'ArrowDown') return
    event.preventDefault()
    if (!commandHistory.length) return

    if (event.key === 'ArrowUp') {
      const nextIndex = historyIndex < 0 ? commandHistory.length - 1 : Math.max(historyIndex - 1, 0)
      setHistoryIndex(nextIndex)
      setInput(commandHistory[nextIndex])
      return
    }

    if (historyIndex < 0) return
    const nextIndex = historyIndex + 1
    if (nextIndex >= commandHistory.length) {
      setHistoryIndex(-1)
      setInput('')
    } else {
      setHistoryIndex(nextIndex)
      setInput(commandHistory[nextIndex])
    }
  }

  return (
    <footer
      className="contact-finale-track"
      ref={trackRef}
      aria-label="장지훈 연락처 터미널"
      style={{ '--contact-progress': 0, '--glow-x': '72vw', '--glow-y': '34vh' } as ContactStyle}
    >
      <div className="contact-finale-stage">
        <div className="contact-glow" aria-hidden="true" />
        <div className="contact-grid" aria-hidden="true" />
        <div className="contact-marquee" aria-hidden="true">
          <span>HELLO · CONTACT · HELLO · CONTACT · </span>
          <span>HELLO · CONTACT · HELLO · CONTACT · </span>
        </div>

        <header className="contact-finale-meta">
          <span>WHITEKIWI / CONTACT</span>
          <span>INTERACTIVE SHELL · KST</span>
          <strong>END</strong>
        </header>

        <div className="contact-finale-copy">
          {/* 문구 없이 프롬프트와 커서만 남긴 장식이다. 의미는 아래 헤드라인이 가진다. */}
          <p className="contact-command" aria-hidden="true"><span>&gt;</span><i /></p>
          <h2><span>LET&apos;S</span><strong>CONNECT.</strong></h2>
          <p>좋은 제품에 관한 흥미로운 이야기라면,<br />언제든 반갑습니다.</p>
        </div>

        {peekRun > 0 && (
          <div
            className="contact-kiwi-peek"
            key={peekRun}
            aria-hidden="true"
            onAnimationEnd={() => setPeekRun(0)}
          >
            <img src="/assets/characters/kiwi-peek.png" alt="" />
          </div>
        )}

        <section className={`contact-terminal ${bootReady ? 'is-ready' : ''}`} aria-label="대화형 연락처 터미널">
          <header className="contact-terminal-bar">
            <span aria-hidden="true"><i /><i /><i /></span>
            <strong>whitekiwi@portfolio — contact</strong>
            <small>zsh</small>
          </header>

          <div className="contact-terminal-log" ref={terminalLogRef} role="log" aria-live="polite" onClick={() => terminalInputRef.current?.focus()}>
            <div className="terminal-boot" aria-hidden="true">
              <p><span className="terminal-prompt-mark">›</span>{bootCommand}<i /></p>
              {bootReady && (
                <div className="terminal-boot-output">
                  <span>[ok] identity loaded: whitekiwi</span>
                  <span>[ok] contact channels mounted</span>
                  <strong>Interactive contact shell is ready.</strong>
                  <small>Type `help` or choose a command below.</small>
                </div>
              )}
            </div>

            {entries.map((entry) => (
              <div className="terminal-entry" key={entry.id}>
                <p className="terminal-entry-command"><span>visitor@portfolio %</span> {entry.command}</p>
                <div className="terminal-entry-output">
                  {entry.lines.map((line, index) => <span className={`is-${line.tone ?? 'default'}`} style={{ '--line-delay': `${index * 45}ms` } as CSSProperties} key={`${line.text}-${index}`}>{line.text}</span>)}
                </div>
              </div>
            ))}
          </div>

          {isStrolling && (
            <div
              className="contact-kiwi-stroll"
              aria-hidden="true"
              onAnimationEnd={() => setIsStrolling(false)}
            >
              <span className="contact-kiwi-sprite">
                <img src="/assets/characters/kiwi-walk-cycle.png" alt="" />
              </span>
            </div>
          )}

          <form className="contact-terminal-form" onSubmit={submitCommand}>
            <label htmlFor="contact-terminal-input">visitor@portfolio %</label>
            <input
              id="contact-terminal-input"
              ref={terminalInputRef}
              value={input}
              onChange={(event) => {
                setInput(event.target.value)
                setHistoryIndex(-1)
              }}
              onKeyDown={navigateHistory}
              autoComplete="off"
              autoCapitalize="none"
              spellCheck={false}
              placeholder={bootReady ? 'type a command…' : 'booting…'}
              disabled={!bootReady}
            />
            <button type="submit" disabled={!bootReady || !input.trim()}>RUN</button>
          </form>

          <div className="contact-terminal-shortcuts" aria-label="명령 바로 실행">
            {availableCommands.map((command) => (
              <button type="button" onClick={() => executeCommand(command)} disabled={!bootReady} key={command}>{command}</button>
            ))}
          </div>
        </section>

        <nav className="contact-link-dock" aria-label="연락처와 외부 링크">
          <div className="contact-link-primary">
            <span>CONTACT</span>
            <a href={emailUrl}>jh145478@gmail.com</a>
          </div>
          <div className="contact-link-list">
            <a className="contact-email-compact" href={emailUrl}>Email <span aria-hidden="true">↗</span></a>
            <a href={githubUrl} target="_blank" rel="noreferrer">GitHub <span aria-hidden="true">↗</span></a>
            <a href={blogUrl} target="_blank" rel="noreferrer">Blog <span aria-hidden="true">↗</span></a>
            <a href={linkedinUrl} target="_blank" rel="noreferrer">LinkedIn <span aria-hidden="true">↗</span></a>
            <a href={instagramUrl} target="_blank" rel="noreferrer">Instagram <span aria-hidden="true">↗</span></a>
          </div>
        </nav>

        <div className="contact-finale-bottom">
          <p>THANKS FOR SCROLLING <span aria-hidden="true">✦</span> PORTFOLIO</p>
          <div>
            <a href="/resume/">RESUME <span aria-hidden="true">↗</span></a>
            <a href="/guidelines/">PORTFOLIO GUIDELINES <span aria-hidden="true">↗</span></a>
            <a href="/">RUN AGAIN <span aria-hidden="true">↺</span></a>
          </div>
        </div>
      </div>
    </footer>
  )
}
