import { useCallback, useEffect, useRef, useState, type CSSProperties, type FormEvent, type KeyboardEvent, type RefObject } from 'react'
import { createPortal } from 'react-dom'
import {
  availableCommands,
  runCommand,
  SUDO_PASSWORD,
  type CommandContext,
  type CommandResult,
  type EffectKind,
  type TerminalLine,
} from './terminal-commands'
// 창의 레이아웃·로그·연출 규칙은 아직 contact-finale.css에 있다.
// 호스트가 이미 불러오지만, 이 컴포넌트가 실제로 의존하므로 여기서도 선언한다.
import './contact-finale.css'
import './terminal-window.css'

/**
 * Contact 피날레와 `/terminal/`이 함께 쓰는 터미널 창.
 *
 * 두 화면이 같은 컴포넌트를 렌더하므로 명령·부팅·히스토리·저장·화면 연출이 갈라지지 않는다.
 * 무대마다 다른 것은 props로만 받는다. 이펙트 재생 상태는 `onEffectChange`로 올려 보내고,
 * 무대 class 합성과 입력 잠금은 각 호스트가 자기 방식으로 처리한다.
 *
 * fragment를 돌려주는 이유는 빼꼼 키위다. 창보다 낮은 z-index로 창 뒤에 숨어야 하므로
 * 창의 자식이 될 수 없고 무대의 형제로 나와야 한다.
 */

type EffectStyle = CSSProperties & {
  '--fx-x'?: string
  '--fx-y'?: string
}

type TerminalEntry = {
  id: number
  command: string
  lines: TerminalLine[]
  /**
   * 프레임 애니메이션 entry. 줄 등장 애니메이션을 끈다.
   * 프레임마다 줄 내용이 바뀌면 React가 매번 새 노드로 갈아끼워 등장 모션이 계속 재생된다.
   */
  instant?: boolean
}

/** 재생 중인 화면 연출. `run`은 같은 명령을 연속 입력해도 다시 재생되게 하는 remount key다. */
type ActiveEffect = {
  kind: EffectKind
  run: number
  x: number
  y: number
}

/**
 * `gravity`가 떨어뜨릴 요소. 낙하 거리는 무대 바닥까지 재는 것이 기본이다.
 * 창이 화면을 거의 채우는 `/terminal/`처럼 잴 거리가 없는 무대는 `fallRatio`로 직접 넘긴다.
 */
export type GravityTarget = {
  selector: string
  drift: number
  spin: number
  delay: number
  /** viewport 높이에 대한 비율. 주면 실측 대신 이 값을 쓴다. */
  fallRatio?: number
}

export type TerminalWindowProps = {
  /** true가 되면 부팅 시퀀스를 시작한다. 한 번 시작하면 다시 돌아가지 않는다. */
  booted: boolean
  /** 흔들림·낙하·회전이 걸릴 무대. 이펙트 좌표와 낙하 거리 측정에도 쓴다. */
  stageRef: RefObject<HTMLElement | null>
  gravityTargets: GravityTarget[]
  /** 타이틀바 가운데 문구. */
  title: string
  /** 초록 버튼. Contact는 `/terminal/`로, `/terminal/`은 Contact로 돌아간다. */
  zoomHref: string
  zoomLabel: string
  /** 재생이 시작되면 kind, 끝나면 null. 호스트가 무대 class와 입력 잠금에 쓴다. */
  onEffectChange?: (kind: EffectKind | null) => void
}

/** 무대에 붙는 class. portal 레이어를 쓰지 않는 연출은 여기서만 동작한다. */
export const EFFECT_STAGE_CLASS: Record<EffectKind, string> = {
  lightning: '',
  boom: 'is-booming',
  gravity: 'is-gravity',
  earthquake: 'is-quaking',
  flip: 'is-flipping',
}

/** 두 화면이 같은 키를 쓴다. 전체화면은 새 세션이 아니라 같은 셸의 다른 창이다. */
const TERMINAL_STORAGE_KEY = 'whitekiwi-contact-terminal-v1'
const HISTORY_STORAGE_KEY = 'whitekiwi-contact-history-v1'

/**
 * 화면에 남기는 출력(`entries`)과 위·아래 화살표가 훑는 명령 history는 상한이 다르다.
 * 셸도 스크롤백과 history를 따로 센다. 출력은 이미지·격자까지 들어 있어 30개로 제한하지만,
 * 명령 문자열은 가벼우므로 100개까지 남긴다.
 */
const ENTRY_LIMIT = 30
const COMMAND_HISTORY_LIMIT = 100

/** CSS 애니메이션 길이와 맞춘다. 이 시간이 지나면 레이어를 걷고 입력 잠금을 푼다. */
const EFFECT_DURATION: Record<EffectKind, number> = {
  lightning: 1200,
  boom: 2300,
  gravity: 2800,
  earthquake: 3500,
  flip: 1250,
}

/** 번개 시안. 난수를 쓰면 매 렌더 달라지므로 재생 횟수로 고른다. */
const boltShapes = [
  { main: 'M54 0 L28 80 L52 76 L20 200', branch: 'M40 96 L14 152' },
  { main: 'M44 0 L70 68 L44 64 L74 200', branch: 'M58 90 L88 140' },
]

const prefersReducedMotion = () => window.matchMedia('(prefers-reduced-motion: reduce)').matches

/** 각 요소가 무대 바닥까지 떨어질 거리를 재서 넘긴다. 요소마다 높이가 달라 상수로 둘 수 없다. */
const prepareGravity = (stage: HTMLElement, targets: GravityTarget[]) => {
  const floor = stage.getBoundingClientRect().bottom
  targets.forEach(({ selector, drift, spin, delay, fallRatio }) => {
    const element = stage.querySelector<HTMLElement>(selector)
    if (!element) return
    const fall = fallRatio === undefined
      ? Math.max(0, floor - element.getBoundingClientRect().bottom - 10)
      : window.innerHeight * fallRatio
    element.style.setProperty('--fall', String(fall))
    element.style.setProperty('--drift', String(drift))
    element.style.setProperty('--spin', String(spin))
    element.style.animationDelay = `${delay}ms`
  })
}

const clearGravity = (stage: HTMLElement, targets: GravityTarget[]) => {
  targets.forEach(({ selector }) => {
    const element = stage.querySelector<HTMLElement>(selector)
    if (!element) return
    element.style.removeProperty('--fall')
    element.style.removeProperty('--drift')
    element.style.removeProperty('--spin')
    element.style.removeProperty('animation-delay')
  })
}

/**
 * 화면 연출 레이어.
 *
 * `document.body`로 portal한다. 무대 안에 두면 무대의 `overflow: hidden`에 잘리고,
 * 흔들림 때문에 무대에 걸리는 transform이 fixed 자손의 containing block을 바꾼다.
 * 항상 `pointer-events: none`이어야 한다. 이 레이어가 wheel의 `event.target`이 되면
 * 터미널 내부 제스처 예외를 통과하지 못해 사용자가 Toss 챕터로 튕겨난다.
 */
function TerminalEffectLayer({ effect, onDone }: { effect: ActiveEffect; onDone: () => void }) {
  useEffect(() => {
    const timer = window.setTimeout(onDone, EFFECT_DURATION[effect.kind])
    return () => window.clearTimeout(timer)
  }, [effect.kind, effect.run, onDone])

  const bolt = boltShapes[effect.run % boltShapes.length]

  return (
    <div
      className={`terminal-fx is-${effect.kind}`}
      aria-hidden="true"
      style={{ '--fx-x': `${effect.x}px`, '--fx-y': `${effect.y}px` } as EffectStyle}
    >
      {(effect.kind === 'lightning' || effect.kind === 'boom') && <div className="terminal-fx-flash" />}
      {effect.kind === 'lightning' && (
        <svg className="terminal-fx-bolt" viewBox="0 0 100 200" preserveAspectRatio="xMidYMin meet" fill="none">
          <path d={bolt.main} />
          <path className="is-branch" d={bolt.branch} />
        </svg>
      )}
      {effect.kind === 'boom' && (
        <>
          <div className="terminal-fx-ring" />
          <div className="terminal-fx-ring is-late" />
        </>
      )}
    </div>
  )
}

/** 순수 카타카나는 남의 것이다. 이 포트폴리오의 글자를 섞는다. */
const MATRIX_CHARS = '키위ㅋㅇㅁㅂ0123456789<>/\\|$#*+=-_'
const MATRIX_DURATION = 6200

/**
 * 로그 위에 덮는 코드 레인.
 *
 * 전체 화면 대신 터미널 로그 영역 안에서만 돈다. 무대 밖으로 나갈 이유가 없고,
 * 터미널이 잠식당하는 그림이 이 장면에 더 맞는다. grid row 2에 얹어 로그와 정확히 겹친다.
 */
function MatrixRain({ onDone }: { onDone: () => void }) {
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    const canvas = canvasRef.current
    const context = canvas?.getContext('2d')
    if (!canvas || !context) return

    const cell = 15
    // 고해상도 화면에서 backing store가 너무 커지지 않게 상한을 둔다.
    const ratio = Math.min(window.devicePixelRatio || 1, 2)
    let drops: number[] = []
    let columnWidth = cell
    let frame = 0

    const resize = () => {
      const { width, height } = canvas.getBoundingClientRect()
      canvas.width = Math.max(1, Math.round(width * ratio))
      canvas.height = Math.max(1, Math.round(height * ratio))
      context.setTransform(ratio, 0, 0, ratio, 0, 0)
      context.font = `${cell}px 'Nanum Gothic Coding', monospace`
      // 한글은 라틴의 두 배 폭이다. 넓은 쪽을 열 간격으로 잡아야 글자가 겹치지 않는다.
      columnWidth = Math.max(8, context.measureText('키').width)
      const count = Math.max(1, Math.ceil(width / columnWidth))
      drops = Array.from({ length: count }, () => -Math.random() * (height / cell))
    }

    resize()
    const observer = new ResizeObserver(resize)
    observer.observe(canvas)

    const pick = () => MATRIX_CHARS[Math.floor(Math.random() * MATRIX_CHARS.length)]

    const draw = () => {
      const { width, height } = canvas.getBoundingClientRect()
      // 매 프레임 옅게 덮어 잔상 꼬리를 만든다.
      context.fillStyle = 'rgba(10, 12, 11, .15)'
      context.fillRect(0, 0, width, height)
      context.font = `${cell}px 'Nanum Gothic Coding', monospace`

      drops.forEach((row, index) => {
        const x = index * columnWidth
        const y = row * cell
        context.fillStyle = 'rgba(93, 219, 122, .62)'
        context.fillText(pick(), x, y - cell)
        context.fillStyle = '#dcffe8'
        context.fillText(pick(), x, y)
        drops[index] = y > height && Math.random() > .972 ? 0 : row + .58
      })

      frame = window.requestAnimationFrame(draw)
    }

    frame = window.requestAnimationFrame(draw)
    const timer = window.setTimeout(onDone, MATRIX_DURATION)

    return () => {
      window.cancelAnimationFrame(frame)
      window.clearTimeout(timer)
      observer.disconnect()
    }
  }, [onDone])

  return <canvas className="terminal-matrix" ref={canvasRef} aria-hidden="true" />
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

const loadCommandHistory = (): string[] => {
  try {
    const saved = window.sessionStorage.getItem(HISTORY_STORAGE_KEY)
    // history를 따로 저장하기 전에 열어둔 탭에는 이 키가 없다. 남아 있는 출력에서 되살린다.
    if (!saved) return loadTerminalEntries().map((entry) => entry.command).filter(Boolean)
    const parsed = JSON.parse(saved)
    return Array.isArray(parsed) ? parsed.filter((command): command is string => typeof command === 'string') : []
  } catch {
    return []
  }
}

export default function TerminalWindow({
  booted,
  stageRef,
  gravityTargets,
  title,
  zoomHref,
  zoomLabel,
  onEffectChange,
}: TerminalWindowProps) {
  const terminalRef = useRef<HTMLElement>(null)
  const frameTimerRef = useRef(0)
  const terminalInputRef = useRef<HTMLInputElement>(null)
  const terminalLogRef = useRef<HTMLDivElement>(null)
  const nextEntryIdRef = useRef(Date.now())
  const [entries, setEntries] = useState<TerminalEntry[]>(loadTerminalEntries)
  const [input, setInput] = useState('')
  const [historyIndex, setHistoryIndex] = useState(-1)
  const [bootCommand, setBootCommand] = useState('')
  const [bootReady, setBootReady] = useState(false)
  const [isStrolling, setIsStrolling] = useState(false)
  // 0이면 DOM에 없다. 재생 중에만 마운트해 장면 전환 때 터미널 없이 노출되지 않게 한다.
  const [peekRun, setPeekRun] = useState(0)
  const notFoundCountRef = useRef(0)
  const [effect, setEffect] = useState<ActiveEffect | null>(null)
  const effectRunRef = useRef(0)
  const effectKindRef = useRef<EffectKind | null>(null)
  /** 노랑 버튼. 로그에는 아무것도 남기지 않고 창만 잠깐 작아졌다 튕겨 돌아온다. */
  const [isNudging, setIsNudging] = useState(false)
  /** `sudo`가 비밀번호를 기다리는 동안의 상태. 통과하면 `command`를 실행한다. */
  const [passwordPrompt, setPasswordPrompt] = useState<{ command: string; attempts: number } | null>(null)
  /** 0이면 DOM에 없다. 재생 중에만 마운트해 캔버스와 rAF를 남기지 않는다. */
  const [matrixRun, setMatrixRun] = useState(0)
  /** 연속 실행에도 다시 재생되도록 key는 늘어나기만 한다. 같은 값이면 remount되지 않는다. */
  const matrixRunRef = useRef(0)

  // 화면에서 지워진 명령도 화살표로는 계속 꺼낼 수 있어야 하므로 entries에서 파생하지 않는다.
  const [commandHistory, setCommandHistory] = useState<string[]>(loadCommandHistory)

  const startEffect = useCallback((kind: EffectKind) => {
    // 모션 감소 환경에서는 텍스트 결과만 남긴다.
    if (prefersReducedMotion()) return

    const rect = terminalRef.current?.getBoundingClientRect()
    const stage = stageRef.current
    // 이전 연출이 남긴 인라인 값을 먼저 걷는다. 남아 있으면 낙하 거리가 두 번 더해진다.
    if (stage) clearGravity(stage, gravityTargets)
    if (stage && kind === 'gravity') prepareGravity(stage, gravityTargets)
    effectRunRef.current += 1
    effectKindRef.current = kind
    setEffect({
      kind,
      run: effectRunRef.current,
      x: rect ? rect.left + rect.width / 2 : window.innerWidth / 2,
      y: rect ? rect.top + rect.height / 2 : window.innerHeight / 2,
    })
  }, [gravityTargets, stageRef])

  const finishEffect = useCallback(() => {
    if (effectKindRef.current === 'gravity' && stageRef.current) clearGravity(stageRef.current, gravityTargets)
    effectKindRef.current = null
    setEffect(null)
  }, [gravityTargets, stageRef])

  // 무대 class 합성과 입력 잠금은 호스트가 한다. 여기서는 재생 상태만 알린다.
  useEffect(() => {
    onEffectChange?.(effect?.kind ?? null)
  }, [effect, onEffectChange])

  /** 프레임 애니메이션은 entry 하나의 내용을 통째로 갈아끼운다. 새 명령이나 clear가 끊는다. */
  const stopFrames = useCallback(() => {
    window.clearInterval(frameTimerRef.current)
    frameTimerRef.current = 0
  }, [])

  const playFrames = useCallback((entryId: number, frames: TerminalLine[][], interval: number) => {
    stopFrames()
    if (frames.length < 2) return
    // 모션 감소 환경에서는 완성된 마지막 프레임만 보여준다.
    if (prefersReducedMotion()) {
      setEntries((current) => current.map((entry) => entry.id === entryId ? { ...entry, lines: frames[frames.length - 1] } : entry))
      return
    }
    let index = 0
    frameTimerRef.current = window.setInterval(() => {
      index += 1
      setEntries((current) => current.map((entry) => entry.id === entryId ? { ...entry, lines: frames[index] } : entry))
      if (index >= frames.length - 1) stopFrames()
    }, interval)
  }, [stopFrames])

  useEffect(() => stopFrames, [stopFrames])

  const buildContext = useCallback((command: string, raw: string): CommandContext => ({
    narrow: window.innerWidth < 760,
    // 실제 셸의 `history`는 방금 친 명령까지 포함한다.
    history: [...commandHistory, command],
    raw,
  }), [commandHistory])

  /** 명령 결과를 화면에 반영한다. 일반 입력과 비밀번호 통과 후 실행이 같은 경로를 쓴다. */
  const applyResult = useCallback((label: string, result: CommandResult) => {
    if (result.notFound) {
      // 첫 오답은 그냥 넘기고 두 번째부터 키위가 터미널 뒤에서 빼꼼 올라온다.
      // 한 번 만에 나오면 우연이 아니라 기능처럼 보여서 발견하는 재미가 줄어든다.
      notFoundCountRef.current += 1
      if (notFoundCountRef.current >= 2) setPeekRun((current) => current + 1)
    }

    // 이펙트는 entry에 담지 않는다. entry는 sessionStorage에 직렬화되므로
    // 함께 저장하면 새로고침할 때 지난 연출이 되살아난다.
    if (result.effect) startEffect(result.effect)
    if (result.overlay === 'matrix' && !prefersReducedMotion()) {
      matrixRunRef.current += 1
      setMatrixRun(matrixRunRef.current)
    }

    nextEntryIdRef.current += 1
    const entryId = nextEntryIdRef.current
    setEntries((current) => [...current, { id: entryId, command: label, lines: result.lines, instant: Boolean(result.frames) }].slice(-ENTRY_LIMIT))
    setInput('')
    setHistoryIndex(-1)

    if (result.frames) playFrames(entryId, result.frames, result.frameInterval ?? 95)
  }, [playFrames, startEffect])

  /**
   * 비밀번호 입력 처리.
   * 입력값은 어디에도 저장하지 않는다. entry의 명령 자리에는 고정 길이 마스크만 남기고
   * 명령 history에도 넣지 않는다. 실제 셸도 비밀번호를 history에 남기지 않는다.
   */
  const submitPassword = useCallback((value: string) => {
    if (!passwordPrompt) return
    stopFrames()

    if (value === SUDO_PASSWORD) {
      setPasswordPrompt(null)
      // `root: true`가 빠지면 권한이 필요한 명령이 통과 직후에도 스스로 거절한다.
      const context = { ...buildContext(passwordPrompt.command, passwordPrompt.command), root: true }
      applyResult('', runCommand(passwordPrompt.command, context))
      return
    }

    const attempts = passwordPrompt.attempts + 1
    if (attempts >= 3) {
      setPasswordPrompt(null)
      applyResult('', { lines: [{ text: 'sudo: 3 incorrect password attempts', tone: 'error' }] })
      return
    }

    setPasswordPrompt({ command: passwordPrompt.command, attempts })
    applyResult('', { lines: [{ text: 'Sorry, try again.', tone: 'error' }] })
  }, [applyResult, buildContext, passwordPrompt, stopFrames])

  const stopMatrix = useCallback(() => setMatrixRun(0), [])

  const cancelPassword = useCallback(() => {
    if (!passwordPrompt) return
    setPasswordPrompt(null)
    setInput('')
    applyResult('', { lines: [{ text: 'sudo: cancelled', tone: 'muted' }] })
  }, [applyResult, passwordPrompt])

  // 터미널이 준비된 뒤 일정 시간 입력이 없으면 키위가 아래 경계를 한 번 걸어 지나간다.
  useEffect(() => {
    if (!bootReady || isStrolling) return
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return

    let timer = window.setTimeout(() => setIsStrolling(true), IDLE_STROLL_DELAY)
    const restart = () => {
      window.clearTimeout(timer)
      timer = window.setTimeout(() => setIsStrolling(true), IDLE_STROLL_DELAY)
    }

    const terminal = terminalRef.current
    terminal?.addEventListener('keydown', restart)
    terminal?.addEventListener('pointerdown', restart)

    return () => {
      window.clearTimeout(timer)
      terminal?.removeEventListener('keydown', restart)
      terminal?.removeEventListener('pointerdown', restart)
    }
  }, [bootReady, isStrolling, entries, input])

  useEffect(() => {
    // 프레임 재생 중에는 매 프레임 저장하지 않는다. 마지막 프레임에서는 이미 타이머가 꺼져 있어 저장된다.
    if (frameTimerRef.current) return
    try {
      if (entries.length) window.sessionStorage.setItem(TERMINAL_STORAGE_KEY, JSON.stringify(entries.slice(-ENTRY_LIMIT)))
      else window.sessionStorage.removeItem(TERMINAL_STORAGE_KEY)
    } catch {
      // The terminal still works when storage is unavailable.
    }
  }, [entries])

  useEffect(() => {
    try {
      if (commandHistory.length) window.sessionStorage.setItem(HISTORY_STORAGE_KEY, JSON.stringify(commandHistory))
      else window.sessionStorage.removeItem(HISTORY_STORAGE_KEY)
    } catch {
      // The terminal still works when storage is unavailable.
    }
  }, [commandHistory])

  useEffect(() => {
    const log = terminalLogRef.current
    if (!log) return
    // 긴 출력은 줄 단위 등장 애니메이션과 smooth 스크롤이 겹쳐 로그가 계속 흔들린다.
    // 프레임 애니메이션도 마찬가지다. 매 프레임 시작된 smooth 스크롤이 서로를 끊는다.
    const last = entries[entries.length - 1]
    const instant = Boolean(last?.instant) || (last?.lines.length ?? 0) > 14
    log.scrollTo({ top: log.scrollHeight, behavior: instant ? 'auto' : 'smooth' })
  }, [entries, bootReady])

  // `bootReady`를 의존성에 두면 부팅이 끝난 뒤 다시 실행되며 스스로 빠져나간다.
  // ref 가드를 쓰면 StrictMode의 이중 마운트에서 두 번째 실행이 막혀 부팅이 멈춘 채로 남는다.
  useEffect(() => {
    if (!booted || bootReady) return

    const fullCommand = '$ contact --interactive'
    if (prefersReducedMotion()) {
      setBootCommand(fullCommand)
      setBootReady(true)
      return
    }

    let readyTimer = 0
    let character = 0
    const typeTimer = window.setInterval(() => {
      character += 1
      setBootCommand(fullCommand.slice(0, character))
      if (character === fullCommand.length) {
        window.clearInterval(typeTimer)
        readyTimer = window.setTimeout(() => setBootReady(true), 360)
      }
    }, 42)

    return () => {
      window.clearInterval(typeTimer)
      window.clearTimeout(readyTimer)
    }
  }, [booted, bootReady])

  const executeCommand = useCallback((rawCommand: string) => {
    const command = rawCommand.trim().toLowerCase().replace(/\s+/g, ' ')
    if (!command) return

    // 재생 중인 프레임 애니메이션과 코드 레인은 다음 명령이 들어오면 그 자리에서 멈춘다.
    stopFrames()
    setMatrixRun(0)

    if (command === 'clear') {
      setEntries([])
      setCommandHistory([])
      setPasswordPrompt(null)
      setInput('')
      setHistoryIndex(-1)
      try {
        window.sessionStorage.removeItem(TERMINAL_STORAGE_KEY)
        window.sessionStorage.removeItem(HISTORY_STORAGE_KEY)
      } catch {
        // Clearing the visible terminal still works when storage is unavailable.
      }
      return
    }

    const result = runCommand(command, buildContext(command, rawCommand))
    applyResult(command, result)
    setCommandHistory((current) => [...current, command].slice(-COMMAND_HISTORY_LIMIT))
    // 비밀번호를 받는 동안에는 입력줄이 마스킹 모드로 바뀐다.
    setPasswordPrompt(result.askPassword ? { command: result.askPassword, attempts: 0 } : null)
  }, [applyResult, buildContext, stopFrames])

  const submitCommand = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    if (passwordPrompt) submitPassword(input)
    else executeCommand(input)
  }

  /** 이미 재생 중이어도 다시 눌리게 하려면 한 프레임 껐다 켜야 애니메이션이 처음부터 돈다. */
  const nudgeWindow = () => {
    if (prefersReducedMotion()) return
    setIsNudging(false)
    window.requestAnimationFrame(() => setIsNudging(true))
  }

  const navigateHistory = (event: KeyboardEvent<HTMLInputElement>) => {
    // 코드 레인은 아무 키나 누르면 멈춘다고 안내했으므로 여기서 먼저 걷는다.
    if (matrixRun) setMatrixRun(0)
    if (event.key === 'Escape' && passwordPrompt) {
      event.preventDefault()
      cancelPassword()
      return
    }
    // 비밀번호를 치는 동안 화살표로 과거 명령을 꺼내오면 그대로 제출될 수 있다.
    if (passwordPrompt) return
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
    <>
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

      <section
        className={`contact-terminal${bootReady ? ' is-ready' : ''}${isNudging ? ' is-nudging' : ''}`}
        ref={terminalRef}
        aria-label="대화형 연락처 터미널"
        onAnimationEnd={(event) => {
          if (event.animationName === 'terminal-window-nudge') setIsNudging(false)
        }}
      >
        <header className="contact-terminal-bar">
          {/* 맥 창 버튼을 흉내 낸 장식이 아니라 실제 컨트롤이다.
              초록은 페이지를 이동하므로 앵커, 나머지 둘은 버튼이다. */}
          <span className="contact-terminal-lights">
            <button type="button" className="is-close" onClick={() => executeCommand('close')} aria-label="터미널 닫기" />
            <button type="button" className="is-minimize" onClick={nudgeWindow} aria-label="터미널 창 축소" />
            <a className="is-zoom" href={zoomHref} aria-label={zoomLabel} />
          </span>
          <strong>{title}</strong>
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
            <div className={`terminal-entry${entry.instant ? ' is-instant' : ''}`} key={entry.id}>
              {/* 비밀번호 입력 결과는 명령 자리가 비어 있다. 실제 sudo도 입력을 되비추지 않는다. */}
              {entry.command && <p className="terminal-entry-command"><span>visitor@portfolio %</span> {entry.command}</p>}
              <div className="terminal-entry-output">
                {/* 지연에 상한이 없으면 `git log`처럼 긴 출력의 마지막 줄이 한참 뒤에 뜬다. */}
                {entry.lines.map((line, index) => <span className={`is-${line.tone ?? 'default'}${line.grid ? ' is-grid' : ''}`} style={{ '--line-delay': `${Math.min(index, 12) * 45}ms` } as CSSProperties} key={`${line.text}-${index}`}>{line.text}</span>)}
              </div>
            </div>
          ))}
        </div>

        {matrixRun > 0 && <MatrixRain key={matrixRun} onDone={stopMatrix} />}

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
          <label htmlFor="contact-terminal-input">{passwordPrompt ? 'Password:' : 'visitor@portfolio %'}</label>
          <input
            id="contact-terminal-input"
            ref={terminalInputRef}
            value={input}
            onChange={(event) => {
              setInput(event.target.value)
              setHistoryIndex(-1)
            }}
            onKeyDown={navigateHistory}
            type={passwordPrompt ? 'password' : 'text'}
            autoComplete="off"
            // 가짜 프롬프트다. 비밀번호 관리자가 진짜 자격증명을 채워 넣지 않게 막는다.
            data-1p-ignore
            data-lpignore="true"
            autoCapitalize="none"
            spellCheck={false}
            placeholder={passwordPrompt ? 'esc to cancel' : bootReady ? 'type a command…' : 'booting…'}
            disabled={!bootReady}
          />
          <button type="submit" disabled={!bootReady || (!passwordPrompt && !input.trim())}>
            {passwordPrompt ? 'OK' : 'RUN'}
          </button>
        </form>

        <div className="contact-terminal-shortcuts" aria-label="명령 바로 실행">
          {availableCommands.map((command) => (
            <button type="button" onClick={() => executeCommand(command)} disabled={!bootReady} key={command}>{command}</button>
          ))}
        </div>
      </section>

      {effect && createPortal(
        <TerminalEffectLayer effect={effect} onDone={finishEffect} key={effect.run} />,
        document.body,
      )}
    </>
  )
}
