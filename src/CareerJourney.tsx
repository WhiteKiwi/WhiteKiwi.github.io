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
  ['USED CAR', '중고차 직거래 리서치 및 초기 셋업'],
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
        <ChapterMeta number="05" company="AIMPACT" period="2021.02—2021.05" />
        <div className="seed-packet" aria-hidden="true">
          <span>ARRANGE</span><strong>BETTER<br />GROUND</strong><i>SEEDS / 2021</i>
        </div>
        <div className="farm-sun" aria-hidden="true" />
        <div className="farm-cloud farm-cloud-one" aria-hidden="true" />
        <div className="farm-cloud farm-cloud-two" aria-hidden="true" />
        <article className="career-copy aimpact-copy">
          <span className="career-kicker">BACKEND DEVELOPER · REPLANT THE SYSTEM</span>
          <h2>서비스의 기반을,<br /><strong>다시 심었습니다</strong></h2>
          <p>직거래 주문처리 플랫폼 <b>어레인지</b>의<br />오래된 기반을 걷어내고 다시 만들었습니다</p>
        </article>
        <div className="farm-field">
          {Array.from({ length: 10 }, (_, index) => index === 4 ? (
            <button className="crop crop-1 crop-transition-source" type="button" style={{ '--index': index } as IndexedStyle} aria-label="당근을 눌러 다음 경력으로 이동" aria-describedby="carrot-action-guide" disabled key={index}>
              <i /><b /><em />
            </button>
          ) : (
            <span className={`crop crop-${index % 3}`} style={{ '--index': index } as IndexedStyle} aria-hidden="true" key={index}>
              <i /><b /><em />
            </span>
          ))}
        </div>
        <div className="carrot-action-guide" id="carrot-action-guide">
          <span>CLICK THE CARROT</span><small>당근을 눌러 다음 장면으로</small><i aria-hidden="true" />
        </div>
        <ol className="aimpact-notes">
          {aimpactNotes.map(([number, title, body], index) => (
            <li className="career-note" style={{ '--index': index } as IndexedStyle} key={title}>
              <span>{number}</span><strong>{title}</strong><small>{body}</small>
            </li>
          ))}
        </ol>
        <div className="kiwi-farmer" aria-hidden="true">
          <img src="/assets/characters/kiwi-farmer.png" alt="" />
        </div>
        <div className="farm-soil" aria-hidden="true"><i /><i /><i /></div>
        <div className="career-progress" aria-hidden="true"><i /></div>
        <div className="carrot-transition-curtain" aria-hidden="true" />
      </div>
    </section>
  )
}

function DaangnChapter({ trackRef }: { trackRef: RefObject<HTMLElement | null> }) {
  return (
    <section className="career-track career-daangn" ref={trackRef} aria-label="당근 경력">
      <div className="career-stage daangn-stage">
        <ChapterMeta number="06" company="DAANGN" period="2021.05—2021.08" />
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
        <div className="carrot-transition-curtain" aria-hidden="true" />
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
    let scrollingUp = false
    let lastPageY = window.scrollY
    let chapterTransitionLocked = false
    let chapterTransitionTimer = 0
    let chapterTransitionFrame = 0
    let triggerReverseTransition = () => {}

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
        const transitionButton = track.querySelector<HTMLButtonElement>('.crop-transition-source')
        if (transitionButton) transitionButton.disabled = progress < .64
        track.style.setProperty('--seed-opacity', String(seed))
        track.style.setProperty('--seed-turn', `${reveal(progress, .01, .15) * -16}deg`)
        track.style.setProperty('--crop-grow', String(grow))
        track.style.setProperty('--farmer-opacity', String(visibility(progress, .11, .22, .78, .88)))
        track.style.setProperty('--farm-sun-y', `${progress * 8}vh`)
        track.style.setProperty('--carrot-guide-opacity', String(visibility(progress, .68, .74, .96, .995)))
      } else {
        track.style.setProperty('--map-x', `${(progress - .5) * -10}vw`)
        track.style.setProperty('--map-y', `${(progress - .5) * 8}vh`)
        track.style.setProperty('--explorer-x', `${-12 + progress * 100}vw`)
        track.style.setProperty('--explorer-y', `${56 - progress * 32}vh`)
        track.style.setProperty('--explorer-opacity', String(visibility(progress, .14, .24, .72, .84)))
        track.style.setProperty('--route-progress', String(reveal(progress, .2, .76)))
        track.style.setProperty('--chat-opacity', String(visibility(progress, .46, .56, .73, .82)))
        track.style.setProperty('--next-opacity', String(reveal(progress, .82, .94)))
        track.style.setProperty('--next-y', `${(1 - reveal(progress, .82, .94)) * 30}px`)
        if (scrollingUp && progress < .075 && rect.top <= 1 && rect.bottom > 0 && !chapterTransitionLocked) {
          triggerReverseTransition()
        }
      }
    }

    const updateProgress = () => {
      animationFrame = 0
      const nextPageY = window.scrollY
      scrollingUp = nextPageY < lastPageY - 1
      lastPageY = nextPageY
      trackRefs.forEach((ref, index) => {
        if (ref.current) updateTrack(ref.current, index)
      })
    }
    const requestUpdate = () => {
      if (!animationFrame) animationFrame = window.requestAnimationFrame(updateProgress)
    }

    const aimpactStage = trackRefs[2].current?.querySelector<HTMLElement>('.aimpact-stage')
    const farmCrops = aimpactStage ? Array.from(aimpactStage.querySelectorAll<HTMLElement>('.crop')) : []
    const aimpactTrack = trackRefs[2].current
    const daangnTrack = trackRefs[3].current
    const carrotButton = aimpactTrack?.querySelector<HTMLButtonElement>('.crop-transition-source')
    const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    let pointerFrame = 0
    let breezeSettleFrame = 0
    let breezeResetTimer = 0
    let lastPointerX: number | null = null
    let lastPointerTime = 0
    let pendingPointerX = 0
    let pendingBreeze = 0
    const currentBreeze = farmCrops.map(() => 0)

    const resetFarmBreeze = () => {
      farmCrops.forEach((crop, index) => {
        currentBreeze[index] = 0
        crop.classList.remove('is-breezy', 'is-settling')
        crop.style.setProperty('--crop-breeze', '0deg')
      })
    }
    const settleFarmBreeze = () => {
      if (breezeSettleFrame) window.cancelAnimationFrame(breezeSettleFrame)
      const startedAt = performance.now()
      const startingBreeze = [...currentBreeze]
      farmCrops.forEach((crop) => {
        crop.classList.remove('is-breezy')
        crop.classList.add('is-settling')
      })

      const settle = (now: number) => {
        const progress = clamp((now - startedAt) / 1550)
        const envelope = Math.exp(-3.4 * progress) * (1 - progress)
        const recoil = Math.cos(progress * Math.PI * 4.2)
        farmCrops.forEach((crop, index) => {
          currentBreeze[index] = startingBreeze[index] * envelope * recoil
          crop.style.setProperty('--crop-breeze', `${currentBreeze[index]}deg`)
        })

        if (progress < 1) breezeSettleFrame = window.requestAnimationFrame(settle)
        else {
          breezeSettleFrame = 0
          resetFarmBreeze()
        }
      }
      breezeSettleFrame = window.requestAnimationFrame(settle)
    }
    const onFarmPointerMove = (event: PointerEvent) => {
      if (reducedMotion || event.pointerType === 'touch') return
      if (breezeSettleFrame) {
        window.cancelAnimationFrame(breezeSettleFrame)
        breezeSettleFrame = 0
      }
      farmCrops.forEach((crop) => crop.classList.remove('is-settling'))
      const now = performance.now()
      if (lastPointerX === null) {
        lastPointerX = event.clientX
        lastPointerTime = now
        return
      }

      const elapsed = Math.max(now - lastPointerTime, 8)
      const velocity = (event.clientX - lastPointerX) * 16 / elapsed
      lastPointerX = event.clientX
      lastPointerTime = now
      pendingPointerX = event.clientX
      pendingBreeze = clamp((velocity / 11 + 1) / 2) * 30 - 15

      if (!pointerFrame) {
        pointerFrame = window.requestAnimationFrame(() => {
          pointerFrame = 0
          const radius = Math.max(190, window.innerWidth * .17)
          farmCrops.forEach((crop, index) => {
            const rect = crop.getBoundingClientRect()
            const proximity = clamp(1 - Math.abs(rect.left + rect.width / 2 - pendingPointerX) / radius)
            currentBreeze[index] = pendingBreeze * proximity
            crop.classList.add('is-breezy')
            crop.style.setProperty('--crop-breeze', `${currentBreeze[index]}deg`)
          })
        })
      }

      if (breezeResetTimer) window.clearTimeout(breezeResetTimer)
      breezeResetTimer = window.setTimeout(settleFarmBreeze, 180)
    }
    const onFarmPointerLeave = () => {
      lastPointerX = null
      if (pointerFrame) {
        window.cancelAnimationFrame(pointerFrame)
        pointerFrame = 0
      }
      if (breezeResetTimer) window.clearTimeout(breezeResetTimer)
      settleFarmBreeze()
    }

    const zoomDuration = reducedMotion ? 20 : 520
    const curtainCoverDuration = reducedMotion ? 20 : 440
    const curtainRevealDuration = reducedMotion ? 20 : 640
    const scrollToTrackProgress = (track: HTMLElement, progress: number) => {
      const trackTop = window.scrollY + track.getBoundingClientRect().top
      const distance = Math.max(track.offsetHeight - window.innerHeight, 1)
      window.scrollTo(0, trackTop + distance * progress)
      lastPageY = window.scrollY
    }
    const updateCarrotCoverScale = () => {
      if (!aimpactTrack) return
      const compact = window.innerWidth <= 700
      const cropWidth = Math.min(66, Math.max(38, window.innerWidth * .04))
      const cropHeight = Math.min(180, Math.max(110, window.innerHeight * .17))
      const rootWidth = cropWidth * .42
      const rootHeight = cropHeight * .35 * .86
      const rootCenterX = window.innerWidth * (compact ? .73 : .663)
      const rootCenterY = window.innerHeight * (compact ? .86 : .85)
      const horizontalScale = Math.max(rootCenterX, window.innerWidth - rootCenterX) * 2 / rootWidth
      const verticalScale = Math.max(rootCenterY, window.innerHeight - rootCenterY) * 2 / rootHeight
      const coverScale = Math.ceil(Math.max(horizontalScale, verticalScale) * 1.6)
      aimpactTrack.style.setProperty('--carrot-cover-scale', String(coverScale))
    }
    const onNextPaint = (callback: () => void) => {
      chapterTransitionFrame = window.requestAnimationFrame(() => {
        chapterTransitionFrame = window.requestAnimationFrame(callback)
      })
    }
    const resetChapterTransitionClasses = () => {
      aimpactTrack?.classList.remove('is-carrot-departing', 'is-carrot-return-cover', 'is-carrot-returning')
      daangnTrack?.classList.remove('is-carrot-forward-cover', 'is-carrot-forward-reveal', 'is-carrot-reverse-ready', 'is-carrot-reverse-cover')
    }
    const finishChapterTransition = () => {
      resetChapterTransitionClasses()
      chapterTransitionLocked = false
      lastPageY = window.scrollY
    }
    const startForwardTransition = () => {
      if (chapterTransitionLocked || !aimpactTrack || !daangnTrack) return
      const progress = Number.parseFloat(aimpactTrack.style.getPropertyValue('--chapter-progress'))
      if (!Number.isFinite(progress) || progress < .64) return

      updateCarrotCoverScale()
      resetChapterTransitionClasses()
      chapterTransitionLocked = true
      carrotButton?.blur()
      aimpactTrack.classList.add('is-carrot-departing')
      chapterTransitionTimer = window.setTimeout(() => {
        daangnTrack.classList.add('is-carrot-forward-cover')
        scrollToTrackProgress(daangnTrack, .035)
        aimpactTrack.classList.remove('is-carrot-departing')
        onNextPaint(() => {
          daangnTrack.classList.add('is-carrot-forward-reveal')
          chapterTransitionTimer = window.setTimeout(() => {
            finishChapterTransition()
          }, curtainRevealDuration)
        })
      }, zoomDuration)
    }
    triggerReverseTransition = () => {
      if (chapterTransitionLocked || !aimpactTrack || !daangnTrack) return
      resetChapterTransitionClasses()
      chapterTransitionLocked = true
      daangnTrack.classList.add('is-carrot-reverse-ready')
      onNextPaint(() => {
        daangnTrack.classList.add('is-carrot-reverse-cover')
        chapterTransitionTimer = window.setTimeout(() => {
          aimpactTrack.classList.add('is-carrot-return-cover')
          scrollToTrackProgress(aimpactTrack, .76)
          daangnTrack.classList.remove('is-carrot-reverse-ready', 'is-carrot-reverse-cover')
          onNextPaint(() => {
            aimpactTrack.classList.remove('is-carrot-return-cover')
            aimpactTrack.classList.add('is-carrot-returning')
            chapterTransitionTimer = window.setTimeout(() => {
              finishChapterTransition()
            }, curtainRevealDuration)
          })
        }, curtainCoverDuration)
      })
    }

    const scrollKeys = new Set(['ArrowUp', 'ArrowDown', 'PageUp', 'PageDown', 'Home', 'End', ' '])
    const portalGateProgress = .74
    const aimpactWouldCrossPortalGate = (downwardDelta: number) => {
      if (!aimpactTrack) return false
      const progress = Number.parseFloat(aimpactTrack.style.getPropertyValue('--chapter-progress'))
      const rect = aimpactTrack.getBoundingClientRect()
      const distance = Math.max(aimpactTrack.offsetHeight - window.innerHeight, 1)
      const projectedProgress = progress + Math.max(downwardDelta, 0) / distance
      return Number.isFinite(progress) && projectedProgress >= portalGateProgress && rect.top <= 1 && rect.bottom > 0
    }
    const holdAtAimpactPortalGate = () => {
      if (aimpactTrack) scrollToTrackProgress(aimpactTrack, portalGateProgress)
    }
    const daangnIsAtPortalThreshold = () => {
      if (!daangnTrack) return false
      const progress = Number.parseFloat(daangnTrack.style.getPropertyValue('--chapter-progress'))
      const rect = daangnTrack.getBoundingClientRect()
      return Number.isFinite(progress) && progress < .09 && rect.top <= 1 && rect.bottom > 0
    }
    const onTransitionWheel = (event: WheelEvent) => {
      if (chapterTransitionLocked) {
        event.preventDefault()
        return
      }
      if (event.deltaY > 0 && aimpactWouldCrossPortalGate(event.deltaY)) {
        event.preventDefault()
        holdAtAimpactPortalGate()
        return
      }
      if (event.deltaY < 0 && daangnIsAtPortalThreshold()) {
        event.preventDefault()
        triggerReverseTransition()
      }
    }
    let touchStartY: number | null = null
    const onTransitionTouchStart = (event: TouchEvent) => {
      touchStartY = event.touches[0]?.clientY ?? null
    }
    const onTransitionTouchMove = (event: TouchEvent) => {
      if (chapterTransitionLocked) {
        event.preventDefault()
        return
      }
      const currentY = event.touches[0]?.clientY
      const downwardDelta = touchStartY !== null && currentY !== undefined ? touchStartY - currentY : 0
      if (downwardDelta > 8 && aimpactWouldCrossPortalGate(downwardDelta)) {
        event.preventDefault()
        holdAtAimpactPortalGate()
        return
      }
      if (touchStartY !== null && currentY !== undefined && currentY - touchStartY > 8 && daangnIsAtPortalThreshold()) {
        event.preventDefault()
        triggerReverseTransition()
      }
    }
    const onTransitionKeyDown = (event: KeyboardEvent) => {
      if (!scrollKeys.has(event.key)) return
      if (event.key === ' ' && event.target === carrotButton) return
      if (chapterTransitionLocked) {
        event.preventDefault()
        return
      }
      const forwardKeyDelta = event.key === 'End'
        ? Number.POSITIVE_INFINITY
        : event.key === 'PageDown' || event.key === ' '
          ? window.innerHeight
          : event.key === 'ArrowDown'
            ? 120
            : 0
      if (forwardKeyDelta > 0 && aimpactWouldCrossPortalGate(forwardKeyDelta)) {
        event.preventDefault()
        holdAtAimpactPortalGate()
        return
      }
      if ((event.key === 'ArrowUp' || event.key === 'PageUp' || event.key === 'Home') && daangnIsAtPortalThreshold()) {
        event.preventDefault()
        triggerReverseTransition()
      }
    }

    updateProgress()
    window.addEventListener('scroll', requestUpdate, { passive: true })
    window.addEventListener('resize', requestUpdate)
    window.addEventListener('wheel', onTransitionWheel, { passive: false })
    window.addEventListener('touchstart', onTransitionTouchStart, { passive: true })
    window.addEventListener('touchmove', onTransitionTouchMove, { passive: false })
    window.addEventListener('keydown', onTransitionKeyDown)
    aimpactStage?.addEventListener('pointermove', onFarmPointerMove, { passive: true })
    aimpactStage?.addEventListener('pointerleave', onFarmPointerLeave)
    carrotButton?.addEventListener('click', startForwardTransition)
    return () => {
      if (animationFrame) window.cancelAnimationFrame(animationFrame)
      if (pointerFrame) window.cancelAnimationFrame(pointerFrame)
      if (breezeSettleFrame) window.cancelAnimationFrame(breezeSettleFrame)
      if (breezeResetTimer) window.clearTimeout(breezeResetTimer)
      if (chapterTransitionFrame) window.cancelAnimationFrame(chapterTransitionFrame)
      if (chapterTransitionTimer) window.clearTimeout(chapterTransitionTimer)
      resetChapterTransitionClasses()
      window.removeEventListener('scroll', requestUpdate)
      window.removeEventListener('resize', requestUpdate)
      window.removeEventListener('wheel', onTransitionWheel)
      window.removeEventListener('touchstart', onTransitionTouchStart)
      window.removeEventListener('touchmove', onTransitionTouchMove)
      window.removeEventListener('keydown', onTransitionKeyDown)
      aimpactStage?.removeEventListener('pointermove', onFarmPointerMove)
      aimpactStage?.removeEventListener('pointerleave', onFarmPointerLeave)
      carrotButton?.removeEventListener('click', startForwardTransition)
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
