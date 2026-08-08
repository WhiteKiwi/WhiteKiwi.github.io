import { useEffect, useRef, type CSSProperties, type RefObject } from 'react'
import './career-journey.css'

type IndexedStyle = CSSProperties & { '--index': number }

const whiteblockNotes = [
  ['01', 'TAKEIT', '테이크아웃 주문 앱'],
  ['02', 'DELIVERY', '배달 기능 런칭'],
]

const fetchingNotes = [
  '크롤러 모듈화',
  'Raspberry Pi → Docker / ECS',
  'JavaScript → TypeScript',
  '세션 메모리 누수 해결',
  '쿼리 튜닝 · Sentry / Slack',
]

const aimpactNotes = [
  ['01', 'NestJS', 'PHP·Node GraphQL 레거시 이전'],
  ['02', 'DATA', 'DB 구조·TypeORM 매핑 개선'],
  ['03', 'DELIVERY', 'CI/CD·관측·ECS / ELB 기반'],
]

const daangnNotes = [
  ['FEEDBACK CHAT', '반응이 낮을 매물에 먼저 건넨 피드백'],
  ['MAP VIEW', '부동산 직거래 매물을 지도로 탐색'],
  ['ZERO TO ONE', '신사업 리서치부터 기획·개발까지'],
]

function ChapterMeta({ number, company, period }: { number: string; company: string; period: string }) {
  return (
    <header className="career-meta">
      <span>WHITEKIWI&nbsp; / &nbsp;{company}</span>
      <span>{period}</span>
      <strong>{number}</strong>
    </header>
  )
}

function WhiteblockChapter({ trackRef }: { trackRef: RefObject<HTMLElement | null> }) {
  return (
    <section className="career-track career-whiteblock" ref={trackRef} aria-label="화이트블록 경력">
      <div className="career-stage whiteblock-stage">
        <ChapterMeta number="03" company="WHITEBLOCK" period="2020.02—2020.06" />
        <div className="order-receipt" aria-hidden="true">
          <span>ORDER NO. 0001</span><strong>TAKEIT</strong><i />
          <small>TAKEOUT&nbsp;&nbsp;→&nbsp;&nbsp;DELIVERY</small>
        </div>
        <div className="delivery-city" aria-hidden="true">
          <i /><i /><i /><i /><i />
        </div>
        <div className="delivery-speed-lines" aria-hidden="true">
          {Array.from({ length: 10 }, (_, index) => <i style={{ '--index': index } as IndexedStyle} key={index} />)}
        </div>
        <article className="career-copy whiteblock-copy">
          <span className="career-kicker">BACKEND DEVELOPER · FIRST RIDE</span>
          <h2>첫 배달은,<br /><strong>코드로 출발했습니다</strong></h2>
          <p>테이크아웃 주문 앱 <b>테이킷</b>에<br />배달 기능을 런칭했습니다</p>
        </article>
        <ol className="whiteblock-notes">
          {whiteblockNotes.map(([number, title, body], index) => (
            <li className="career-note" style={{ '--index': index } as IndexedStyle} key={title}>
              <span>{number}</span><strong>{title}</strong><small>{body}</small>
            </li>
          ))}
        </ol>
        <div className="delivery-rider" aria-hidden="true">
          <div className="delivery-rider-shadow" />
          <img src="/assets/characters/kiwi-delivery-rider.png" alt="" />
        </div>
        <div className="delivery-road" aria-hidden="true"><i /><i /><i /><i /></div>
        <div className="career-progress" aria-hidden="true"><i /></div>
      </div>
    </section>
  )
}

function FetchingChapter({ trackRef }: { trackRef: RefObject<HTMLElement | null> }) {
  return (
    <section className="career-track career-fetching" ref={trackRef} aria-label="FETCHING 경력">
      <div className="career-stage fetching-stage">
        <ChapterMeta number="04" company="FETCHING" period="2020.08—2021.02" />
        <div className="boutique-curtain" aria-hidden="true"><i /><strong>PRIVATE<br />VIEW</strong><i /></div>
        <div className="showcase-grid" aria-hidden="true">
          <div className="showcase showcase-bag"><span /><small>01 / BAG</small></div>
          <div className="showcase showcase-watch"><span /><small>02 / WATCH</small></div>
          <div className="showcase showcase-shoe"><span /><small>03 / SHOES</small></div>
        </div>
        <div className="boutique-scanner" aria-hidden="true"><span>FETCHING ITEM DATA</span></div>
        <article className="career-copy fetching-copy">
          <span className="career-kicker">BACKEND DEVELOPER · CURATED SYSTEMS</span>
          <h2>흩어진 명품을,<br /><strong>하나의 흐름으로</strong></h2>
          <p>명품 편집숍의 상품을 수집하는<br /><b>크롤러 시스템</b>을 만들고 운영했습니다</p>
        </article>
        <div className="fetching-ledger">
          <span>COLLECT</span><i />
          <span>NORMALIZE</span><i />
          <span>OPERATE</span>
        </div>
        <ol className="fetching-notes">
          {fetchingNotes.map((note, index) => (
            <li className="career-note" style={{ '--index': index } as IndexedStyle} key={note}>
              <span>{String(index + 1).padStart(2, '0')}</span><strong>{note}</strong>
            </li>
          ))}
        </ol>
        <div className="fashion-curator" aria-hidden="true">
          <img src="/assets/characters/kiwi-fashion-curator.png" alt="" />
        </div>
        <div className="career-progress" aria-hidden="true"><i /></div>
      </div>
    </section>
  )
}

function AimpactChapter({ trackRef }: { trackRef: RefObject<HTMLElement | null> }) {
  return (
    <section className="career-track career-aimpact" ref={trackRef} aria-label="에이임팩트 경력">
      <div className="career-stage aimpact-stage">
        <ChapterMeta number="05" company="AIMPACT · ARRANGE" period="2021.02—2021.05" />
        <div className="seed-packet" aria-hidden="true">
          <span>ARRANGE</span><strong>BETTER<br />GROUND</strong><i>SEEDS / 2021</i>
        </div>
        <div className="farm-sun" aria-hidden="true" />
        <div className="farm-cloud farm-cloud-one" aria-hidden="true" />
        <div className="farm-cloud farm-cloud-two" aria-hidden="true" />
        <article className="career-copy aimpact-copy">
          <span className="career-kicker">BACKEND DEVELOPER · REPLANT THE SYSTEM</span>
          <h2>서비스의 기반을,<br /><strong>다시 심었습니다</strong></h2>
          <p>농부가 쓰는 주문 관리 서비스 <b>어레인지</b>의<br />오래된 기반을 걷어내고 다시 만들었습니다</p>
        </article>
        <div className="farm-field" aria-hidden="true">
          {Array.from({ length: 10 }, (_, index) => (
            <span className={`crop crop-${index % 3}`} style={{ '--index': index } as IndexedStyle} key={index}>
              <i /><b /><em />
            </span>
          ))}
        </div>
        <ol className="aimpact-notes">
          {aimpactNotes.map(([number, title, body], index) => (
            <li className="career-note" style={{ '--index': index } as IndexedStyle} key={title}>
              <span>{number}</span><strong>{title}</strong><small>{body}</small>
            </li>
          ))}
        </ol>
        <div className="kiwi-farmer" aria-hidden="true">
          <div className="water-stream"><i /><i /><i /><i /><i /></div>
          <img src="/assets/characters/kiwi-farmer.png" alt="" />
        </div>
        <div className="farm-soil" aria-hidden="true"><i /><i /><i /></div>
        <div className="career-progress" aria-hidden="true"><i /></div>
      </div>
    </section>
  )
}

function DaangnChapter({ trackRef }: { trackRef: RefObject<HTMLElement | null> }) {
  return (
    <section className="career-track career-daangn" ref={trackRef} aria-label="당근 경력">
      <div className="career-stage daangn-stage">
        <ChapterMeta number="06" company="DAANGN" period="2021.05—2021.08" />
        <div className="carrot-portal" aria-hidden="true"><i /></div>
        <div className="neighborhood-map" aria-hidden="true">
          <i className="map-road road-a" /><i className="map-road road-b" /><i className="map-road road-c" />
          {Array.from({ length: 8 }, (_, index) => <span className={`map-house house-${index + 1}`} key={index}><i /></span>)}
          <span className="map-pin pin-one" /><span className="map-pin pin-two" /><span className="map-pin pin-three" />
          <svg className="map-route" viewBox="0 0 1000 700"><path d="M80 600 C230 520 235 320 430 340 S690 530 920 120" /></svg>
        </div>
        <article className="career-copy daangn-copy">
          <span className="career-kicker">BACKEND DEVELOPER · AROUND THE NEIGHBORHOOD</span>
          <h2>동네의 집을,<br /><strong>더 가깝게 찾도록</strong></h2>
          <p>부동산 직거래 경험을<br /><b>대화와 지도</b>로 더 편하게 만들었습니다</p>
        </article>
        <ol className="daangn-notes">
          {daangnNotes.map(([title, body], index) => (
            <li className="career-note" style={{ '--index': index } as IndexedStyle} key={title}>
              <span>0{index + 1}</span><strong>{title}</strong><small>{body}</small>
            </li>
          ))}
        </ol>
        <div className="local-explorer" aria-hidden="true">
          <img src="/assets/characters/kiwi-local-explorer.png" alt="" />
          <span>우리 동네를 탐색하는 중</span>
        </div>
        <div className="daangn-chat" aria-hidden="true">
          <span>이 매물, 사진을 더 추가해보는 건 어때요?</span><i>피드백 보내기&nbsp; →</i>
        </div>
        <div className="next-journey">
          <span>NEXT CHAPTER</span><strong>TOSS</strong><i>곧 이어집니다</i>
        </div>
        <div className="career-progress" aria-hidden="true"><i /></div>
      </div>
    </section>
  )
}

export default function CareerJourney({ active }: { active: boolean }) {
  const trackRefs = [
    useRef<HTMLElement>(null),
    useRef<HTMLElement>(null),
    useRef<HTMLElement>(null),
    useRef<HTMLElement>(null),
  ]

  useEffect(() => {
    if (!active) return
    let animationFrame = 0
    const clamp = (value: number) => Math.min(Math.max(value, 0), 1)
    const reveal = (progress: number, start: number, end: number) => clamp((progress - start) / (end - start))
    const smoothstep = (value: number) => value * value * (3 - 2 * value)
    const visibility = (progress: number, enterStart: number, enterEnd: number, exitStart: number, exitEnd: number) => (
      Math.min(reveal(progress, enterStart, enterEnd), 1 - reveal(progress, exitStart, exitEnd))
    )

    const updateTrack = (track: HTMLElement, index: number) => {
      const rect = track.getBoundingClientRect()
      const distance = Math.max(track.offsetHeight - window.innerHeight, 1)
      const progress = clamp(-rect.top / distance)
      const copyOpacity = visibility(progress, .11, .2, .68, .78)
      track.style.setProperty('--chapter-progress', String(progress))
      track.style.setProperty('--chapter-copy-opacity', String(copyOpacity))
      track.style.setProperty('--chapter-copy-y', `${(1 - copyOpacity) * 40 - reveal(progress, .68, .78) * 22}px`)
      track.style.setProperty('--chapter-progress-scale', String(progress))

      const notes = Array.from(track.querySelectorAll<HTMLElement>('.career-note'))
      notes.forEach((note, noteIndex) => {
        const start = index === 2 ? .34 + noteIndex * .105 : .36 + noteIndex * .065
        const shown = smoothstep(reveal(progress, start, start + .09))
        const gone = reveal(progress, .76 + noteIndex * .012, .86 + noteIndex * .012)
        note.style.opacity = String(Math.min(shown, 1 - gone))
        note.style.transform = `translate3d(${(1 - shown) * 42}px, ${(1 - shown) * 26 - gone * 18}px, 0)`
      })

      if (index === 0) {
        const receipt = 1 - smoothstep(reveal(progress, .015, .16))
        track.style.setProperty('--receipt-opacity', String(receipt))
        track.style.setProperty('--receipt-y', `${smoothstep(reveal(progress, .015, .16)) * -112}%`)
        track.style.setProperty('--rider-x', `${-28 + progress * 155}vw`)
        track.style.setProperty('--road-shift', `${progress * -28}vw`)
        track.style.setProperty('--speed-opacity', String(visibility(progress, .1, .2, .74, .84)))
      } else if (index === 1) {
        const curtain = 1 - smoothstep(reveal(progress, .01, .16))
        track.style.setProperty('--curtain-scale', String(curtain))
        track.style.setProperty('--scanner-x', `${7 + progress * 87}%`)
        track.style.setProperty('--scanner-opacity', String(visibility(progress, .17, .24, .7, .8)))
        track.style.setProperty('--showcase-shift', `${(progress - .5) * -8}vw`)
        track.style.setProperty('--curator-y', `${(1 - reveal(progress, .16, .3)) * 35}px`)
        track.style.setProperty('--curator-opacity', String(visibility(progress, .16, .28, .76, .88)))
      } else if (index === 2) {
        const seed = 1 - smoothstep(reveal(progress, .01, .15))
        const grow = smoothstep(reveal(progress, .23, .68))
        track.style.setProperty('--seed-opacity', String(seed))
        track.style.setProperty('--seed-turn', `${reveal(progress, .01, .15) * -16}deg`)
        track.style.setProperty('--crop-grow', String(grow))
        track.style.setProperty('--water-opacity', String(visibility(progress, .18, .28, .63, .72)))
        track.style.setProperty('--farmer-opacity', String(visibility(progress, .11, .22, .78, .88)))
        track.style.setProperty('--farm-sun-y', `${progress * 8}vh`)
      } else {
        const portal = smoothstep(reveal(progress, .01, .17))
        track.style.setProperty('--portal-scale', String(portal))
        track.style.setProperty('--map-x', `${(progress - .5) * -10}vw`)
        track.style.setProperty('--map-y', `${(progress - .5) * 8}vh`)
        track.style.setProperty('--explorer-x', `${-12 + progress * 100}vw`)
        track.style.setProperty('--explorer-y', `${56 - progress * 32}vh`)
        track.style.setProperty('--explorer-opacity', String(visibility(progress, .14, .24, .72, .84)))
        track.style.setProperty('--route-progress', String(reveal(progress, .2, .76)))
        track.style.setProperty('--chat-opacity', String(visibility(progress, .46, .56, .73, .82)))
        track.style.setProperty('--next-opacity', String(reveal(progress, .82, .94)))
        track.style.setProperty('--next-y', `${(1 - reveal(progress, .82, .94)) * 30}px`)
      }
    }

    const updateProgress = () => {
      animationFrame = 0
      trackRefs.forEach((ref, index) => {
        if (ref.current) updateTrack(ref.current, index)
      })
    }
    const requestUpdate = () => {
      if (!animationFrame) animationFrame = window.requestAnimationFrame(updateProgress)
    }

    updateProgress()
    window.addEventListener('scroll', requestUpdate, { passive: true })
    window.addEventListener('resize', requestUpdate)
    return () => {
      if (animationFrame) window.cancelAnimationFrame(animationFrame)
      window.removeEventListener('scroll', requestUpdate)
      window.removeEventListener('resize', requestUpdate)
    }
  }, [active])

  return (
    <div className="career-journey">
      <WhiteblockChapter trackRef={trackRefs[0]} />
      <FetchingChapter trackRef={trackRefs[1]} />
      <AimpactChapter trackRef={trackRefs[2]} />
      <DaangnChapter trackRef={trackRefs[3]} />
    </div>
  )
}
