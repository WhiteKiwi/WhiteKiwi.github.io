import './bird-lab.css'

const sheets = [
  {
    id: '01',
    title: 'Natural Doodle',
    kind: 'ROUGH HAND DRAWN',
    note: '거친 선과 깃털 결, 실제 키위다운 자세를 살린 네 가지 손그림형.',
    src: '/assets/kiwi-studies/01-natural-doodle.png',
  },
  {
    id: '02',
    title: 'Shaggy Comic',
    kind: 'EXPRESSIVE COMIC',
    note: '털북숭이 외곽선, 큰 눈과 긴 부리를 과장한 성격 중심의 코믹형.',
    src: '/assets/kiwi-studies/02-shaggy-comic.png',
  },
  {
    id: '03',
    title: 'Simple Flat',
    kind: 'FLAT DOODLE',
    note: '굵은 선과 단순한 배 모양 몸, 큰 표정으로 정리한 플랫 캐릭터형.',
    src: '/assets/kiwi-studies/03-simple-flat.png',
  },
  {
    id: '04',
    title: 'Storybook Traveler',
    kind: 'SOFT ADVENTURE',
    note: '보송한 털과 소품, 자세로 여정을 표현하는 동화풍 모험가형.',
    src: '/assets/kiwi-studies/04-storybook-traveler.png',
  },
]

function SheetPins() {
  return (
    <div className="sheet-pins" aria-hidden="true">
      <span className="pin-a">A</span><span className="pin-b">B</span>
      <span className="pin-c">C</span><span className="pin-d">D</span>
    </div>
  )
}

export default function BirdLab() {
  return (
    <main className="bird-lab-page">
      <header className="bird-lab-header">
        <a href="/" className="bird-wordmark">whitekiwi®</a>
        <span>CHARACTER STUDY · REFERENCE ROUND</span>
        <a href="/labs/glass">BACK TO THE EGG ↗</a>
      </header>

      <section className="bird-lab-intro">
        <p>BASED ON YOUR REFERENCES</p>
        <h1>이번엔 링크의<br />결을 따라갔습니다.</h1>
        <p className="bird-intro-copy">주신 이미지의 손그림 선, 털북숭이 형태, 단순한 낙서와 동화적인 질감을 네 방향으로 나눴습니다.</p>
      </section>

      <section className="bird-sheet-grid">
        {sheets.map((sheet, index) => (
          <article className={`bird-sheet sheet-${sheet.id}`} key={sheet.id}>
            <div className="bird-sheet-meta"><span>{sheet.id}</span><span>{sheet.kind}</span></div>
            <div className="bird-sheet-visual">
              <img src={sheet.src} alt={`${sheet.title} 키위새 캐릭터 시안 네 가지`} loading={index === 0 ? 'eager' : 'lazy'} />
              <SheetPins />
            </div>
            <div className="bird-sheet-copy"><h2>{sheet.title}</h2><p>{sheet.note}</p></div>
          </article>
        ))}
      </section>

      <footer className="bird-lab-footer">
        <span>HOW TO PICK</span>
        <p><strong>시트 번호 + 위치</strong>로 골라주세요.<br />예: 04-A, 02-D</p>
      </footer>
    </main>
  )
}
