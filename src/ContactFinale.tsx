import { useCallback, useEffect, useRef, useState, type CSSProperties } from 'react'
import TerminalWindow, { EFFECT_STAGE_CLASS, type GravityTarget } from './TerminalWindow'
import {
  blogUrl,
  emailUrl,
  githubUrl,
  instagramUrl,
  linkedinUrl,
  type EffectKind,
} from './terminal-commands'
import './contact-finale.css'

type ContactStyle = CSSProperties & {
  '--contact-progress'?: number
  '--glow-x'?: string
  '--glow-y'?: string
}

type BoomCharStyle = CSSProperties & {
  '--i'?: number
  '--r'?: number
}

/**
 * `gravity`가 떨어뜨리는 요소들.
 * `.contact-marquee`는 진행률 기반 가로 transform을 이미 갖고 있어 덮어쓰면 가로로 튄다. 제외한다.
 */
const GRAVITY_TARGETS: GravityTarget[] = [
  { selector: '.contact-finale-meta', drift: -14, spin: -6, delay: 100 },
  { selector: '.contact-finale-copy', drift: -18, spin: -7, delay: 0 },
  { selector: '.contact-terminal', drift: 12, spin: 4, delay: 70 },
  { selector: '.contact-link-dock', drift: -9, spin: -3, delay: 130 },
  { selector: '.contact-finale-bottom', drift: 16, spin: 5, delay: 40 },
]

/** boom에서만 쓰는 글자 분해. `--r`은 좌우로 흩어지는 방향이고 0이면 그대로 떨어진다. */
const boomChars = (text: string, offset: number) =>
  [...text].map((char, index) => (
    <i key={index} style={{ '--i': index + offset, '--r': ((index + offset) % 3) - 1 } as BoomCharStyle}>{char}</i>
  ))

export default function ContactFinale({ active }: { active: boolean }) {
  const trackRef = useRef<HTMLElement>(null)
  const stageRef = useRef<HTMLDivElement>(null)
  const hasAnimatedRef = useRef(false)
  /** 터미널 창의 부팅 시작 신호. 무대가 화면에 들어오면 켠다. */
  const [booted, setBooted] = useState(false)
  const [effectKind, setEffectKind] = useState<EffectKind | null>(null)
  const previousEffectRef = useRef<EffectKind | null>(null)
  /** 이펙트 재생 중 장면 전환을 막는다. 기존 전환 소유권과 섞지 않는다. */
  const effectLockRef = useRef(false)
  const effectReleaseTimerRef = useRef(0)
  /** boom이 끝난 뒤 헤드라인을 다시 불러온다. key는 애니메이션 재시작용이라 늘어나기만 한다. */
  const [headlineRun, setHeadlineRun] = useState(0)
  const [isReturning, setIsReturning] = useState(false)

  /**
   * 터미널 창이 알려주는 재생 상태로 무대 class와 입력 잠금을 함께 움직인다.
   * 잠금을 창 안에 두지 않는 이유는 이것이 Contact의 스크롤 전환에만 필요한 규칙이기 때문이다.
   * 스크롤이 없는 `/terminal/`은 이 콜백에서 아무것도 하지 않는다.
   */
  const handleEffectChange = useCallback((kind: EffectKind | null) => {
    setEffectKind(kind)
    window.clearTimeout(effectReleaseTimerRef.current)

    if (kind) effectLockRef.current = true
    else {
      // 종료 직후 남은 관성 입력이 즉시 전환을 걸지 않도록 잠깐 더 잠근다.
      effectReleaseTimerRef.current = window.setTimeout(() => { effectLockRef.current = false }, 250)
      if (previousEffectRef.current === 'boom') {
        setHeadlineRun((current) => current + 1)
        setIsReturning(true)
      }
    }

    previousEffectRef.current = kind
  }, [])

  useEffect(() => () => window.clearTimeout(effectReleaseTimerRef.current), [])

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
      if (effectLockRef.current) {
        lastPageY = nextPageY
        return
      }
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
      // 이펙트 레이어는 pointer-events가 없어 event.target이 되지 않지만,
      // 재생 중에는 어떤 경로로도 장면이 바뀌지 않아야 한다. 터미널 자체 스크롤만 살린다.
      if (effectLockRef.current) {
        if (!insideTerminal(event.target)) event.preventDefault()
        return
      }
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
      if (effectLockRef.current) {
        if (!touchFromTerminal) event.preventDefault()
        return
      }
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
      // 터미널 입력은 위에서 이미 빠져나갔다. 여기서 막는 것은 페이지 스크롤뿐이다.
      if (effectLockRef.current) {
        event.preventDefault()
        return
      }
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

  // 무대가 화면의 절반 이상 들어오면 터미널이 부팅한다.
  useEffect(() => {
    if (!active || booted || !trackRef.current) return
    const observer = new IntersectionObserver((observations) => {
      if (observations.some((observation) => observation.isIntersecting)) {
        setBooted(true)
        observer.disconnect()
      }
    }, { threshold: .55 })
    observer.observe(trackRef.current)
    return () => observer.disconnect()
  }, [active, booted])

  return (
    <footer
      className="contact-finale-track"
      ref={trackRef}
      aria-label="장지훈 연락처 터미널"
      style={{ '--contact-progress': 0, '--glow-x': '72vw', '--glow-y': '34vh' } as ContactStyle}
    >
      {/* 흔들림은 무대에만 건다. body나 html에 transform을 걸면 05→06 당근 커튼과
          06↔07 Toss 전환막의 fixed containing block이 바뀌어 두 전환이 모두 깨진다. */}
      <div
        className={`contact-finale-stage${effectKind ? ` ${EFFECT_STAGE_CLASS[effectKind]}` : ''}`.trimEnd()}
        ref={stageRef}
      >
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
          {/* boom일 때만 글자로 쪼갠다. 로그 전체를 분해하면 span이 수백 개가 되고
              로그 스크롤 위치까지 깨지므로 헤드라인만 대상으로 한다. */}
          <h2
            key={headlineRun}
            className={isReturning ? 'is-returning' : undefined}
            // 자식 글자의 낙하 애니메이션도 여기까지 버블링되므로 h2 자신의 것만 받는다.
            onAnimationEnd={(event) => { if (event.target === event.currentTarget) setIsReturning(false) }}
            aria-label="LET'S CONNECT."
          >
            {effectKind === 'boom' ? (
              <>
                <span aria-hidden="true">{boomChars("LET'S", 0)}</span>
                <strong aria-hidden="true">{boomChars('CONNECT.', 5)}</strong>
              </>
            ) : (
              <><span>LET&apos;S</span><strong>CONNECT.</strong></>
            )}
          </h2>
          <p>좋은 제품에 관한 흥미로운 이야기라면,<br />언제든 반갑습니다.</p>
        </div>

        <TerminalWindow
          booted={booted}
          stageRef={stageRef}
          gravityTargets={GRAVITY_TARGETS}
          title="whitekiwi@portfolio — contact"
          zoomHref="/terminal/"
          zoomLabel="터미널만 전체화면으로 열기"
          onEffectChange={handleEffectChange}
        />

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
