import { useEffect, useRef, type CSSProperties } from 'react'
import './toss-ongoing.css'

type TossOngoingStyle = CSSProperties & {
  '--toss-progress': number
  '--toss-copy-opacity': number
  '--toss-copy-y': string
  '--toss-card-opacity': number
  '--toss-card-y': string
  '--toss-exit': number
  '--toss-entry-y': string
}

const clamp = (value: number) => Math.min(Math.max(value, 0), 1)
const reveal = (progress: number, start: number, end: number) => clamp((progress - start) / (end - start))
const smoothstep = (value: number) => value * value * (3 - 2 * value)

export default function TossOngoing({ active }: { active: boolean }) {
  const trackRef = useRef<HTMLElement>(null)
  const transitionOverlayRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!active) return
    let animationFrame = 0
    let transitionFrame = 0
    let transitionTimer = 0
    let transitionLocked = false
    let lastPageY = window.scrollY
    let triggerForwardTransition = () => {}
    let triggerReverseTransition = () => {}
    const daangnTrack = document.querySelector<HTMLElement>('.career-daangn')
    const transitionOverlay = transitionOverlayRef.current
    const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    const forwardGateProgress = .76
    const reverseGateProgress = .14

    const update = () => {
      animationFrame = 0
      const nextPageY = window.scrollY
      const scrollingDown = nextPageY > lastPageY + 1
      const scrollingUp = nextPageY < lastPageY - 1
      lastPageY = nextPageY
      const track = trackRef.current
      if (!track) return
      const rect = track.getBoundingClientRect()
      if (rect.bottom < -window.innerHeight || rect.top > window.innerHeight * 3) return

      const distance = Math.max(track.offsetHeight - window.innerHeight, 1)
      const progress = clamp(-rect.top / distance)
      const copyIn = smoothstep(reveal(progress, .04, .18))
      const cardIn = smoothstep(reveal(progress, .12, .3))
      const exit = smoothstep(reveal(progress, .76, .94))
      const entry = smoothstep(reveal(progress, .015, .14))

      track.style.setProperty('--toss-progress', String(progress))
      track.style.setProperty('--toss-copy-opacity', String(Math.min(copyIn, 1 - exit)))
      track.style.setProperty('--toss-copy-y', `${(1 - copyIn) * 46 - exit * 28}px`)
      track.style.setProperty('--toss-card-opacity', String(Math.min(cardIn, 1 - exit * .72)))
      track.style.setProperty('--toss-card-y', `${(1 - cardIn) * 54 - exit * 18}px`)
      track.style.setProperty('--toss-exit', String(exit))
      track.style.setProperty('--toss-entry-y', `${entry * -118}%`)

      if (scrollingDown && daangnTrack && !transitionLocked) {
        const daangnProgress = Number.parseFloat(daangnTrack.style.getPropertyValue('--chapter-progress'))
        const daangnRect = daangnTrack.getBoundingClientRect()
        if (Number.isFinite(daangnProgress) && daangnProgress >= forwardGateProgress && daangnRect.top <= 1 && daangnRect.bottom > 0) {
          triggerForwardTransition()
        }
      }
      if (scrollingUp && progress <= reverseGateProgress && rect.top <= 1 && rect.bottom > 0 && !transitionLocked) {
        triggerReverseTransition()
      }
    }

    const requestUpdate = () => {
      if (!animationFrame) animationFrame = window.requestAnimationFrame(update)
    }

    const overlayStates = [
      'is-ready',
      'is-covering',
      'is-covered',
      'is-revealing',
      'is-reverse-ready',
      'is-reverse-covering',
      'is-reverse-revealing',
    ]
    const setOverlayState = (state?: string) => {
      transitionOverlay?.classList.remove(...overlayStates)
      if (state) transitionOverlay?.classList.add(state)
    }
    const onNextPaint = (callback: () => void) => {
      transitionFrame = window.requestAnimationFrame(() => {
        transitionFrame = window.requestAnimationFrame(callback)
      })
    }
    const scrollToToss = () => {
      const track = trackRef.current
      if (!track) return
      const trackTop = window.scrollY + track.getBoundingClientRect().top
      const distance = Math.max(track.offsetHeight - window.innerHeight, 1)
      const documentRoot = document.documentElement
      const previousScrollBehavior = documentRoot.style.scrollBehavior
      documentRoot.style.scrollBehavior = 'auto'
      window.scrollTo(0, trackTop + distance * .18)
      documentRoot.style.scrollBehavior = previousScrollBehavior
      lastPageY = window.scrollY
      update()
    }
    const scrollToDaangn = () => {
      if (!daangnTrack) return
      const trackTop = window.scrollY + daangnTrack.getBoundingClientRect().top
      const distance = Math.max(daangnTrack.offsetHeight - window.innerHeight, 1)
      const documentRoot = document.documentElement
      const previousScrollBehavior = documentRoot.style.scrollBehavior
      documentRoot.style.scrollBehavior = 'auto'
      window.scrollTo(0, trackTop + distance * .7)
      documentRoot.style.scrollBehavior = previousScrollBehavior
      lastPageY = window.scrollY
    }
    const finishTransition = () => {
      setOverlayState()
      transitionLocked = false
      lastPageY = window.scrollY
    }
    const coverDuration = reducedMotion ? 20 : 480
    const holdDuration = reducedMotion ? 0 : 55
    const revealDuration = reducedMotion ? 20 : 560
    triggerForwardTransition = () => {
      if (transitionLocked || !daangnTrack || !transitionOverlay || !trackRef.current) return
      transitionLocked = true
      setOverlayState('is-ready')
      onNextPaint(() => {
        setOverlayState('is-covering')
        transitionTimer = window.setTimeout(() => {
          setOverlayState('is-covered')
          scrollToToss()
          transitionTimer = window.setTimeout(() => {
            onNextPaint(() => {
              setOverlayState('is-revealing')
              transitionTimer = window.setTimeout(finishTransition, revealDuration)
            })
          }, holdDuration)
        }, coverDuration)
      })
    }
    triggerReverseTransition = () => {
      if (transitionLocked || !daangnTrack || !transitionOverlay || !trackRef.current) return
      transitionLocked = true
      setOverlayState('is-reverse-ready')
      onNextPaint(() => {
        setOverlayState('is-reverse-covering')
        transitionTimer = window.setTimeout(() => {
          setOverlayState('is-covered')
          scrollToDaangn()
          transitionTimer = window.setTimeout(() => {
            onNextPaint(() => {
              setOverlayState('is-reverse-revealing')
              transitionTimer = window.setTimeout(finishTransition, coverDuration)
            })
          }, holdDuration)
        }, revealDuration)
      })
    }

    const daangnWouldCrossForwardGate = (downwardDelta: number) => {
      if (!daangnTrack) return false
      const progress = Number.parseFloat(daangnTrack.style.getPropertyValue('--chapter-progress'))
      const rect = daangnTrack.getBoundingClientRect()
      const distance = Math.max(daangnTrack.offsetHeight - window.innerHeight, 1)
      const projectedProgress = progress + Math.max(downwardDelta, 0) / distance
      return Number.isFinite(progress) && projectedProgress >= forwardGateProgress && rect.top <= 1 && rect.bottom > 0
    }
    const tossWouldCrossReverseGate = (upwardDelta: number) => {
      const track = trackRef.current
      if (!track) return false
      const progress = Number.parseFloat(track.style.getPropertyValue('--toss-progress'))
      const rect = track.getBoundingClientRect()
      const distance = Math.max(track.offsetHeight - window.innerHeight, 1)
      const projectedProgress = progress - Math.max(upwardDelta, 0) / distance
      return Number.isFinite(progress) && projectedProgress <= reverseGateProgress && rect.top <= 1 && rect.bottom > 0
    }
    const onTransitionWheel = (event: WheelEvent) => {
      if (transitionLocked) {
        event.preventDefault()
        return
      }
      if (event.deltaY > 0 && daangnWouldCrossForwardGate(event.deltaY)) {
        event.preventDefault()
        triggerForwardTransition()
        return
      }
      if (event.deltaY < 0 && tossWouldCrossReverseGate(-event.deltaY)) {
        event.preventDefault()
        triggerReverseTransition()
      }
    }
    let touchStartY: number | null = null
    const onTransitionTouchStart = (event: TouchEvent) => {
      touchStartY = event.touches[0]?.clientY ?? null
    }
    const onTransitionTouchMove = (event: TouchEvent) => {
      if (transitionLocked) {
        event.preventDefault()
        return
      }
      const currentY = event.touches[0]?.clientY
      const downwardDelta = touchStartY !== null && currentY !== undefined ? touchStartY - currentY : 0
      if (downwardDelta > 8 && daangnWouldCrossForwardGate(downwardDelta)) {
        event.preventDefault()
        triggerForwardTransition()
        return
      }
      const upwardDelta = touchStartY !== null && currentY !== undefined ? currentY - touchStartY : 0
      if (upwardDelta > 8 && tossWouldCrossReverseGate(upwardDelta)) {
        event.preventDefault()
        triggerReverseTransition()
      }
    }
    const scrollKeys = new Set(['ArrowUp', 'ArrowDown', 'PageUp', 'PageDown', 'Home', 'End', ' '])
    const onTransitionKeyDown = (event: KeyboardEvent) => {
      if (!scrollKeys.has(event.key)) return
      const target = event.target as HTMLElement | null
      if (target?.matches('input, textarea, select, [contenteditable="true"]')) return
      if (transitionLocked) {
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
      if (downwardDelta > 0 && daangnWouldCrossForwardGate(downwardDelta)) {
        event.preventDefault()
        triggerForwardTransition()
        return
      }
      const upwardDelta = event.key === 'Home'
        ? Number.POSITIVE_INFINITY
        : event.key === 'PageUp'
          ? window.innerHeight
          : event.key === 'ArrowUp'
            ? 120
            : 0
      if (upwardDelta > 0 && tossWouldCrossReverseGate(upwardDelta)) {
        event.preventDefault()
        triggerReverseTransition()
      }
    }

    update()
    window.addEventListener('scroll', requestUpdate, { passive: true })
    window.addEventListener('resize', requestUpdate)
    window.addEventListener('wheel', onTransitionWheel, { passive: false })
    window.addEventListener('touchstart', onTransitionTouchStart, { passive: true })
    window.addEventListener('touchmove', onTransitionTouchMove, { passive: false })
    window.addEventListener('keydown', onTransitionKeyDown)
    return () => {
      if (animationFrame) window.cancelAnimationFrame(animationFrame)
      if (transitionFrame) window.cancelAnimationFrame(transitionFrame)
      if (transitionTimer) window.clearTimeout(transitionTimer)
      setOverlayState()
      window.removeEventListener('scroll', requestUpdate)
      window.removeEventListener('resize', requestUpdate)
      window.removeEventListener('wheel', onTransitionWheel)
      window.removeEventListener('touchstart', onTransitionTouchStart)
      window.removeEventListener('touchmove', onTransitionTouchMove)
      window.removeEventListener('keydown', onTransitionKeyDown)
    }
  }, [active])

  return (
    <section
      className="toss-ongoing-track"
      ref={trackRef}
      aria-label="토스와 토스인컴에서 이어지고 있는 현재 경력"
      style={{
        '--toss-progress': 0,
        '--toss-copy-opacity': 0,
        '--toss-copy-y': '46px',
        '--toss-card-opacity': 0,
        '--toss-card-y': '54px',
        '--toss-exit': 0,
        '--toss-entry-y': '0%',
      } as TossOngoingStyle}
    >
      <div className="toss-ongoing-stage">
        <div className="toss-entry-curtain" aria-hidden="true"><i /><span /></div>
        <div className="toss-ambient" aria-hidden="true">
          <i className="toss-orbit toss-orbit-one" />
          <i className="toss-orbit toss-orbit-two" />
          <img className="toss-blue-object" src="/assets/brands/toss-logo-primary.png" alt="" />
        </div>

        <header className="toss-ongoing-meta">
          <span>VIVA REPUBLICA → TOSS INCOME</span>
          <span>2021.11 — NOW</span>
          <strong><i aria-hidden="true" />07</strong>
        </header>

        <div className="toss-ongoing-word" aria-hidden="true">ONGOING</div>

        <article className="toss-ongoing-copy">
          <span>NODE.JS DEVELOPER · CURRENT CHAPTER</span>
          <h2><i>계속,</i><strong>만드는 중입니다.</strong></h2>
          <p>토스에서 시작해 토스인컴으로.<br />다음 이야기는 아직 현재진행형입니다.</p>
        </article>

        <aside className="toss-status-card" aria-label="경력 챕터 작성 상태">
          <header>
            <span>CURRENT STATUS</span>
            <strong><i aria-hidden="true" /> IN PROGRESS</strong>
          </header>
          <dl>
            <div><dt>CAREER</dt><dd>ACTIVE</dd></div>
            <div><dt>STORY</dt><dd>LOADING</dd></div>
            <div><dt>UPDATED</dt><dd>NOW</dd></div>
          </dl>
          <div className="toss-loading" aria-hidden="true"><i /></div>
          <footer><span>2021.11</span><b>NO FINISH LINE</b><span>NOW</span></footer>
        </aside>

        <div className="toss-ongoing-exit">
          <span>THE STORY CONTINUES</span>
          <i aria-hidden="true" />
          <small>SCROLL TO CONTACT</small>
        </div>
      </div>
      <div className="toss-transition-overlay" ref={transitionOverlayRef} aria-hidden="true"><i /><span /></div>
    </section>
  )
}
