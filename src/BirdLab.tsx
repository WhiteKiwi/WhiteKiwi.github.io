import './bird-lab.css'

function SoftPebbleBird() {
  return (
    <svg className="bird-study-svg soft-pebble-bird" viewBox="0 0 340 290" role="img" aria-label="말랑한 조약돌 형태의 키위새">
      <defs>
        <radialGradient id="pebble-body" cx="34%" cy="24%" r="82%">
          <stop stopColor="#a7bb91" />
          <stop offset=".58" stopColor="#657c60" />
          <stop offset="1" stopColor="#3f5547" />
        </radialGradient>
        <linearGradient id="pebble-beak" x1="0" x2="1">
          <stop stopColor="#f2b36f" />
          <stop offset="1" stopColor="#d87c4a" />
        </linearGradient>
      </defs>
      <ellipse className="bird-ground" cx="159" cy="257" rx="104" ry="17" />
      <path className="pebble-body" d="M40 183c0-79 48-134 117-134 64 0 108 42 108 104 0 67-49 101-119 101-63 0-106-21-106-71Z" />
      <ellipse className="pebble-wing" cx="112" cy="160" rx="47" ry="58" transform="rotate(22 112 160)" />
      <circle className="pebble-eye" cx="207" cy="103" r="11" />
      <circle className="pebble-glint" cx="211" cy="99" r="3.2" />
      <path className="pebble-beak" d="M222 118c48-2 82 10 105 31-32 17-67 14-108-7l-18-11Z" />
      <path className="pebble-leg" d="M125 239v25m61-28v28" />
      <path className="pebble-foot" d="m105 265 25-1m35 1 26-1" />
    </svg>
  )
}

function WhiteKiwiBird() {
  return (
    <svg className="bird-study-svg white-kiwi-bird" viewBox="0 0 340 290" role="img" aria-label="흰색 키위새">
      <defs>
        <radialGradient id="white-body" cx="32%" cy="20%" r="85%">
          <stop stopColor="#ffffff" />
          <stop offset=".65" stopColor="#eef1ed" />
          <stop offset="1" stopColor="#cbd4ce" />
        </radialGradient>
      </defs>
      <ellipse className="white-bird-ground" cx="156" cy="257" rx="104" ry="16" />
      <path className="white-bird-body" d="M39 181c0-77 48-131 119-131 66 0 109 41 109 103 0 65-49 100-121 100-64 0-107-22-107-72Z" />
      <path className="white-bird-wing" d="M70 151c20-38 62-53 99-34-22 25-29 61-18 96-40 2-71-20-81-62Z" />
      <path className="white-bird-tuft" d="M137 55c-3-20 8-35 26-45-2 15 5 26 18 34 0-16 8-26 23-32 0 20-8 36-26 49Z" />
      <circle className="white-bird-eye" cx="211" cy="102" r="10" />
      <circle className="white-bird-eye-glint" cx="214" cy="99" r="3" />
      <path className="white-bird-beak" d="M225 117c47-1 81 10 103 31-35 14-68 10-107-9l-17-10Z" />
      <circle className="white-bird-cheek" cx="226" cy="136" r="9" />
      <path className="white-bird-leg" d="M126 239v25m62-27v27" />
      <path className="white-bird-foot" d="m106 265 25-1m35 1 27-1" />
    </svg>
  )
}

function TinyBird() {
  return (
    <svg className="bird-study-svg tiny-bird" viewBox="0 0 340 290" role="img" aria-label="작고 귀여운 키위새">
      <ellipse className="tiny-ground" cx="151" cy="251" rx="91" ry="13" />
      <ellipse className="tiny-body" cx="151" cy="158" rx="91" ry="88" />
      <ellipse className="tiny-belly" cx="141" cy="178" rx="61" ry="57" />
      <circle className="tiny-eye" cx="194" cy="119" r="12" />
      <circle className="tiny-eye-glint" cx="198" cy="115" r="4" />
      <path className="tiny-beak" d="M211 137c53-4 90 5 116 25-39 15-77 14-116-5Z" />
      <path className="tiny-leg" d="M119 229v29m61-29v29" />
      <path className="tiny-foot" d="m96 259 28-1m32 1 29-1" />
      <path className="tiny-tuft" d="M130 78c-3-19 6-33 22-43 0 16 7 25 19 31 1-14 8-23 20-27-1 17-8 31-23 43Z" />
    </svg>
  )
}

function PaperTravelerBird() {
  return (
    <svg className="bird-study-svg paper-bird" viewBox="0 0 340 290" role="img" aria-label="종이 콜라주 여행자 키위새">
      <ellipse className="paper-ground" cx="155" cy="257" rx="105" ry="14" />
      <path className="paper-body-back" d="M43 185c0-78 48-133 115-133 65 0 107 42 107 103 0 66-48 99-118 99-62 0-104-21-104-69Z" />
      <path className="paper-body-front" d="M54 176c7-67 50-112 107-112 54 0 90 35 90 87 0 56-42 85-104 85-55 0-93-18-93-60Z" />
      <path className="paper-wing" d="M77 146c21-33 57-44 91-26-23 22-31 53-24 86-34 0-58-20-67-60Z" />
      <path className="paper-scarf" d="M187 121c25 8 48 9 70 3l-13 24c-21 2-41-1-61-10Z" />
      <path className="paper-scarf-tail" d="m239 142 35 23-34 8Z" />
      <circle className="paper-eye" cx="208" cy="99" r="8" />
      <path className="paper-beak" d="M221 112c48 0 82 11 105 31-34 15-69 11-108-8Z" />
      <path className="paper-bag" d="M97 164h55v50H97z" />
      <path className="paper-bag-strap" d="M102 169c3-33 36-41 51-9" />
      <path className="paper-leg" d="M122 239v24m63-27v27" />
    </svg>
  )
}

function LineBird() {
  return (
    <svg className="bird-study-svg line-bird" viewBox="0 0 340 290" role="img" aria-label="한 줄로 그린 키위새">
      <path className="line-motion motion-one" d="M18 133h68" />
      <path className="line-motion motion-two" d="M3 157h57" />
      <path className="line-body" d="M45 184c0-80 48-134 116-134 63 0 106 42 106 104 0 65-48 99-117 99-62 0-105-21-105-69Z" />
      <path className="line-wing" d="M77 151c17-35 55-50 91-34-23 24-31 57-22 91" />
      <circle className="line-eye" cx="210" cy="103" r="9" />
      <path className="line-beak" d="M222 117c47-1 81 10 104 31-34 15-69 11-108-9" />
      <path className="line-leg" d="M124 239v25m64-28v28m-84 1h26m37 0h27" />
      <path className="line-star" d="m278 65 5 11 12 4-12 5-5 11-5-11-12-5 12-4Z" />
    </svg>
  )
}

function WildBird() {
  return (
    <svg className="bird-study-svg wild-bird" viewBox="0 0 340 290" role="img" aria-label="자연스러운 깃털의 키위새">
      <defs>
        <radialGradient id="wild-body" cx="38%" cy="28%" r="78%">
          <stop stopColor="#9b7558" />
          <stop offset=".6" stopColor="#6b4c3d" />
          <stop offset="1" stopColor="#3c2d29" />
        </radialGradient>
        <pattern id="wild-feathers" width="12" height="12" patternUnits="userSpaceOnUse" patternTransform="rotate(18)">
          <path d="M0 6h12" stroke="#d7b28c" strokeWidth="2" opacity=".28" />
        </pattern>
      </defs>
      <ellipse className="wild-ground" cx="156" cy="259" rx="109" ry="13" />
      <path className="wild-body-shape" d="M40 183c0-79 48-134 117-134 64 0 108 42 108 104 0 67-49 101-119 101-63 0-106-21-106-71Z" />
      <path className="wild-feather-layer" d="M40 183c0-79 48-134 117-134 64 0 108 42 108 104 0 67-49 101-119 101-63 0-106-21-106-71Z" />
      <path className="wild-wing" d="M67 157c17-42 59-61 101-39-27 27-38 65-29 104-38-1-64-23-72-65Z" />
      <circle className="wild-eye" cx="207" cy="99" r="8" />
      <circle className="wild-eye-glint" cx="209" cy="97" r="2" />
      <path className="wild-beak" d="M220 112c50-1 86 11 108 34-38 12-73 7-111-12Z" />
      <path className="wild-leg" d="M123 238v26m66-29v29" />
      <path className="wild-foot" d="m101 265 28-1m36 1 30-1" />
    </svg>
  )
}

const birds = [
  { id: 'A', name: 'Soft Pebble', kind: 'SOFT VOLUME', note: '조약돌처럼 말랑한 몸과 작은 날개. 유리 알의 재질감을 자연스럽게 이어받는 타입.', className: 'bird-card-pebble', visual: <SoftPebbleBird /> },
  { id: 'B', name: 'White Kiwi', kind: 'SIGNATURE', note: '추천 · 흰 몸과 키위색 날개로 닉네임을 가장 직접적으로 캐릭터화한 타입.', className: 'bird-card-white', visual: <WhiteKiwiBird /> },
  { id: 'C', name: 'Tiny Dot', kind: 'CHIBI', note: '몸과 눈을 크게 단순화한 귀여운 주인공. 작은 화면에서도 표정이 잘 읽힙니다.', className: 'bird-card-tiny', visual: <TinyBird /> },
  { id: 'D', name: 'Paper Traveler', kind: 'COLLAGE', note: '가방과 스카프를 두른 여행자. 경력 사이를 이동하는 서사에 가장 적극적인 타입.', className: 'bird-card-paper', visual: <PaperTravelerBird /> },
  { id: 'E', name: 'One Line', kind: 'MINIMAL MOTION', note: '선과 여백 중심의 에디토리얼 캐릭터. 빠르게 달리는 장면에서 특히 선명합니다.', className: 'bird-card-line', visual: <LineBird /> },
  { id: 'F', name: 'Little Wild', kind: 'NATURAL', note: '실제 키위새의 갈색 깃털과 비율을 살리되 눈과 실루엣은 친근하게 정리한 타입.', className: 'bird-card-wild', visual: <WildBird /> },
]

export default function BirdLab() {
  return (
    <main className="bird-lab-page">
      <header className="bird-lab-header">
        <a href="/" className="bird-wordmark">whitekiwi®</a>
        <span>CHARACTER STUDY · 2026</span>
        <a href="/?view=glass">BACK TO THE EGG ↗</a>
      </header>

      <section className="bird-lab-intro">
        <p>THE MAIN CHARACTER</p>
        <h1>알에서 나온<br />첫 번째 얼굴.</h1>
        <p className="bird-intro-copy">모두 오른쪽을 바라보지만, 성격과 움직임의 언어는 서로 다릅니다. 여행 전체를 함께할 주인공을 골라주세요.</p>
      </section>

      <section className="bird-study-grid">
        {birds.map((bird) => (
          <article className={`bird-study-card ${bird.className}`} key={bird.id}>
            <div className="bird-study-meta"><span>{bird.id}</span><span>{bird.kind}</span></div>
            <div className="bird-study-visual">{bird.visual}</div>
            <div className="bird-study-copy"><h2>{bird.name}</h2><p>{bird.note}</p></div>
          </article>
        ))}
      </section>

      <footer className="bird-lab-footer">
        <span>CHOOSE A BIRD</span>
        <p>하나를 고르면 표정, 부화 포즈, 걷기와 바이크 탑승까지 같은 캐릭터로 확장합니다.</p>
      </footer>
    </main>
  )
}
