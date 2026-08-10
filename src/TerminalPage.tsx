import { useEffect, useRef, useState, type CSSProperties } from 'react'
import TerminalWindow, { EFFECT_STAGE_CLASS, type GravityTarget } from './TerminalWindow'
import type { EffectKind } from './terminal-commands'
import './contact-finale.css'
import './terminal-page.css'

type PageStyle = CSSProperties & {
  '--glow-x'?: string
  '--glow-y'?: string
}

/**
 * 창이 화면을 거의 채워 무대 바닥까지 잴 거리가 없다.
 * 실측 대신 고정 비율을 넘겨 화면 아래로 떨어졌다 돌아오게 한다.
 */
const GRAVITY_TARGETS: GravityTarget[] = [
  { selector: '.contact-terminal', drift: 10, spin: 3, delay: 0, fallRatio: .62 },
]

/**
 * `/terminal/` — Contact 피날레의 터미널을 화면 전체로 키운 페이지.
 *
 * 스크롤 트랙도 진입 조립도 없다. 마운트 즉시 부팅하고, 창 하나만 남긴다.
 * `sessionStorage` 키를 Contact와 공유하므로 같은 탭에서는 셸이 그대로 이어진다.
 */
export default function TerminalPage() {
  const pageRef = useRef<HTMLElement>(null)
  const stageRef = useRef<HTMLDivElement>(null)
  const [effectKind, setEffectKind] = useState<EffectKind | null>(null)

  useEffect(() => {
    const page = pageRef.current
    if (!page) return
    const onPointerMove = (event: PointerEvent) => {
      if (event.pointerType === 'touch') return
      page.style.setProperty('--glow-x', `${event.clientX}px`)
      page.style.setProperty('--glow-y', `${event.clientY}px`)
    }
    page.addEventListener('pointermove', onPointerMove, { passive: true })
    return () => page.removeEventListener('pointermove', onPointerMove)
  }, [])

  return (
    <main
      className="terminal-page"
      ref={pageRef}
      aria-label="whitekiwi 터미널"
      style={{ '--glow-x': '62vw', '--glow-y': '30vh' } as PageStyle}
    >
      <div
        className={`contact-finale-stage terminal-page-stage${effectKind ? ` ${EFFECT_STAGE_CLASS[effectKind]}` : ''}`.trimEnd()}
        ref={stageRef}
      >
        <div className="contact-glow" aria-hidden="true" />
        <div className="contact-grid" aria-hidden="true" />

        <TerminalWindow
          booted
          stageRef={stageRef}
          gravityTargets={GRAVITY_TARGETS}
          title="whitekiwi@portfolio — terminal"
          zoomHref="/#contact"
          zoomLabel="Contact 화면으로 돌아가기"
          onEffectChange={setEffectKind}
        />
      </div>
    </main>
  )
}
