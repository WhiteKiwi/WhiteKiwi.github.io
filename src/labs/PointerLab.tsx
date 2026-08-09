import { useEffect, useRef, useState } from 'react'
import './pointer-lab.css'

type EffectId = 'glow' | 'trail' | 'spotlight' | 'magnetic' | 'type'

const effects: { id: EffectId; name: string; note: string }[] = [
  { id: 'glow', name: '00 · 글로우 (현재 적용본)', note: '커서를 느리게 따라오는 앰버 발광체. 지금 Resume와 Contact에 들어가 있는 것.' },
  { id: 'trail', name: '01 · 커서 트레일', note: '커서 뒤로 점들이 지연을 두고 따라오며 잔상을 만든다. 02 학력의 벚꽃 바람과 같은 계열.' },
  { id: 'spotlight', name: '02 · 스포트라이트 마스크', note: '배경 그리드를 평소엔 숨기고 커서 주변에서만 드러낸다. 본문 위에 아무것도 얹지 않는다.' },
  { id: 'magnetic', name: '03 · 자성 커서', note: '실제 조작 대상만 커서 쪽으로 끌려온다. 장식이 아니라 행동 유발점 표시.' },
  { id: 'type', name: '04 · 커서 반응 활자', note: '커서와 가까운 글자가 굵어진다. 가변 폰트가 필요하고 읽기를 방해할 수 있다.' },
]

const TRAIL_LENGTH = 18
const MAGNET_RADIUS = 130
const TYPE_RADIUS = 190

// inline-block으로 쪼개면 공백이 접히므로 나눌 때 non-breaking space로 바꾼다.
const sampleHeading = Array.from('만드는 중입니다').map((char) => (char === ' ' ? ' ' : char))

function PointerLab() {
  const [on, setOn] = useState<Set<EffectId>>(new Set(['glow']))
  const stage = useRef<HTMLDivElement>(null)
  const trailRef = useRef<HTMLDivElement>(null)
  const pointer = useRef({ x: -9999, y: -9999 })

  const toggle = (id: EffectId) =>
    setOn((current) => {
      const next = new Set(current)
      if (next.has(id)) next.delete(id)
      else next.add(id)
      return next
    })

  useEffect(() => {
    const el = stage.current
    if (!el) return

    const onMove = (event: PointerEvent) => {
      if (event.pointerType === 'touch') return
      pointer.current = { x: event.clientX, y: event.clientY }
      el.style.setProperty('--px', `${event.clientX}px`)
      el.style.setProperty('--py', `${event.clientY}px`)
    }

    window.addEventListener('pointermove', onMove, { passive: true })
    return () => window.removeEventListener('pointermove', onMove)
  }, [])

  // 활성화된 효과만 한 루프에서 처리한다.
  useEffect(() => {
    const wantsTrail = on.has('trail')
    const wantsMagnetic = on.has('magnetic')
    const wantsType = on.has('type')
    if (!wantsTrail && !wantsMagnetic && !wantsType) return

    const dots = wantsTrail
      ? Array.from(trailRef.current?.children ?? []) as HTMLElement[]
      : []
    const path = dots.map(() => ({ x: -9999, y: -9999 }))
    const magnets = wantsMagnetic
      ? Array.from(document.querySelectorAll<HTMLElement>('[data-magnetic]'))
      : []
    const letters = wantsType
      ? Array.from(document.querySelectorAll<HTMLElement>('[data-letter]'))
      : []

    let frame = 0
    const tick = () => {
      const { x, y } = pointer.current

      // 앞 점은 커서를, 뒤 점은 바로 앞 점을 쫓아 지연이 누적된다.
      for (let i = 0; i < path.length; i += 1) {
        const target = i === 0 ? { x, y } : path[i - 1]
        path[i].x += (target.x - path[i].x) * .34
        path[i].y += (target.y - path[i].y) * .34
        dots[i].style.transform = `translate3d(${path[i].x}px, ${path[i].y}px, 0)`
      }

      magnets.forEach((el) => {
        const rect = el.getBoundingClientRect()
        const dx = x - (rect.left + rect.width / 2)
        const dy = y - (rect.top + rect.height / 2)
        const distance = Math.hypot(dx, dy)
        const pull = distance < MAGNET_RADIUS ? 1 - distance / MAGNET_RADIUS : 0
        el.style.transform = `translate3d(${dx * pull * .32}px, ${dy * pull * .32}px, 0)`
      })

      letters.forEach((el) => {
        const rect = el.getBoundingClientRect()
        const distance = Math.hypot(x - (rect.left + rect.width / 2), y - (rect.top + rect.height / 2))
        const near = distance < TYPE_RADIUS ? 1 - distance / TYPE_RADIUS : 0
        el.style.fontVariationSettings = `"wght" ${Math.round(300 + near * 560)}`
      })

      frame = window.requestAnimationFrame(tick)
    }

    frame = window.requestAnimationFrame(tick)
    return () => {
      window.cancelAnimationFrame(frame)
      magnets.forEach((el) => { el.style.transform = '' })
      letters.forEach((el) => { el.style.fontVariationSettings = '' })
    }
  }, [on])

  const stageClass = ['pointer-lab', ...Array.from(on).map((id) => `has-${id}`)].join(' ')

  return (
    <div className={stageClass} ref={stage}>
      {on.has('glow') && <div className="pl-glow" aria-hidden="true" />}
      {on.has('spotlight') && <div className="pl-spotlight" aria-hidden="true" />}
      {on.has('trail') && (
        <div className="pl-trail" ref={trailRef} aria-hidden="true">
          {Array.from({ length: TRAIL_LENGTH }, (_, i) => (
            <i key={i} style={{ '--i': i, '--total': TRAIL_LENGTH } as React.CSSProperties} />
          ))}
        </div>
      )}

      <aside className="pl-panel">
        <header>
          <strong>POINTER LAB</strong>
          <small>개발 환경 전용 · 겹쳐서 켤 수 있습니다</small>
        </header>
        <ul>
          {effects.map((effect) => (
            <li key={effect.id}>
              <button
                type="button"
                className={on.has(effect.id) ? 'is-on' : undefined}
                aria-pressed={on.has(effect.id)}
                onClick={() => toggle(effect.id)}
              >
                <span>{effect.name}</span>
                <p>{effect.note}</p>
              </button>
            </li>
          ))}
        </ul>
        <footer>
          <a href="/resume/">/resume/ 로 →</a>
          <a href="/">메인 여정 →</a>
        </footer>
      </aside>

      <main className="pl-sample">
        <p className="pl-eyebrow">가독성 판단용 샘플 · Resume 헤더와 같은 구성</p>

        <h1>
          {sampleHeading.map((char, index) => (
            <span key={`${char}-${index}`} data-letter>{char}</span>
          ))}
        </h1>

        <p className="pl-body">
          매일매일 성장하기 위해 노력하는 개발자입니다. 새로운 것을 시도하고 개발하면서
          문제를 해결하는 것을 좋아합니다. 이 문단은 효과를 켰을 때 본문이 얼마나 잘 읽히는지
          비교하기 위한 것입니다. 글자 위에 무언가 얹히면 여기서 먼저 드러납니다.
        </p>

        <div className="pl-actions">
          <button type="button" data-magnetic>PDF로 저장 ↓</button>
          <button type="button" data-magnetic>KO / EN</button>
          <a href="#none" data-magnetic>github.com/whitekiwi</a>
        </div>

        <dl className="pl-meta">
          <div><dt>EMAIL</dt><dd>jh145478@gmail.com</dd></div>
          <div><dt>ROLE</dt><dd>Node.js Developer</dd></div>
          <div><dt>SINCE</dt><dd>2020.02</dd></div>
        </dl>
      </main>
    </div>
  )
}

export default PointerLab
