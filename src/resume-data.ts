export type Lang = 'ko' | 'en'

type L = Record<Lang, string>
type LL = Record<Lang, string[]>

export type Project = {
  title: L
  period?: string
  points: LL
}

export type Company = {
  id: string
  name: L
  role: L
  /** `YYYY.MM` */
  start: string
  /** `YYYY.MM`, 재직 중이면 null */
  end: string | null
  accent: string
  summary?: L
  ongoing?: true
  projects: Project[]
}

const monthIndex = (value: string) => {
  const [year, month] = value.split('.').map(Number)
  return year * 12 + (month - 1)
}

const nowIndex = () => {
  const now = new Date()
  return now.getFullYear() * 12 + now.getMonth()
}

/** 시작·종료 월을 모두 포함해 센다. `2020.02 – 2020.06`은 5개월이다. */
export const monthsBetween = (start: string, end: string | null) =>
  (end ? monthIndex(end) : nowIndex()) - monthIndex(start) + 1

/** 회사 구간을 월 단위로 합집합해 센다. 공백기는 빠지고 겹치는 달은 한 번만 센다. */
export const totalCareerMonths = (list: Company[]) => {
  const months = new Set<number>()
  list.forEach((company) => {
    const from = monthIndex(company.start)
    const to = company.end ? monthIndex(company.end) : nowIndex()
    for (let i = from; i <= to; i += 1) months.add(i)
  })
  return months.size
}

export const formatDuration = (months: number, lang: Lang) => {
  const years = Math.floor(months / 12)
  const rest = months % 12
  if (lang === 'en') {
    const parts = []
    if (years) parts.push(`${years} yr${years > 1 ? 's' : ''}`)
    if (rest || !years) parts.push(`${rest} mo${rest > 1 ? 's' : ''}`)
    return parts.join(' ')
  }
  if (years && rest) return `${years}년 ${rest}개월`
  if (years) return `${years}년`
  return `${rest}개월`
}

/**
 * 내용을 실제로 손볼 때 함께 갱신한다.
 * 오늘 날짜로 계산하면 방치해도 저절로 최신인 척하게 되므로 상수로 둔다.
 * 재직 개월 수는 반대로 계속 늘어나야 하므로 `totalCareerMonths`가 조회 시점으로 계산한다.
 */
export const lastUpdated = '2026.08'

export const profile = {
  name: { ko: '장지훈', en: 'Jihoon Jang' } as L,
  handle: 'whitekiwi',
  role: { ko: 'Node.js Developer', en: 'Node.js Developer' } as L,
  tagline: {
    ko: '매일매일 성장하기 위해 노력하는 개발자입니다. 새로운 것을 시도하고 개발하면서 문제를 해결하는 것을 좋아합니다.',
    en: 'A developer who works at growing every day. I like solving problems by trying and building new things.',
  } as L,
}

export const contacts = [
  { label: 'Email', value: 'jh145478@gmail.com', href: 'mailto:jh145478@gmail.com' },
  { label: 'GitHub', value: 'github.com/whitekiwi', href: 'https://github.com/whitekiwi' },
  { label: 'Blog', value: 'blog.whitekiwi.link', href: 'https://blog.whitekiwi.link' },
  { label: 'Medium', value: 'medium.com/@whitekiwi', href: 'https://medium.com/@whitekiwi' },
  { label: 'LinkedIn', value: 'linkedin.com/in/whitekiwi', href: 'https://www.linkedin.com/in/whitekiwi/' },
]

export const companies: Company[] = [
  {
    id: 'toss-income',
    name: { ko: '토스인컴', en: 'Toss Income' },
    role: { ko: 'Node.js Developer · 정규직', en: 'Node.js Developer · Full-time' },
    start: '2025.03',
    end: null,
    accent: '#0064ff',
    ongoing: true,
    summary: {
      ko: '종합소득 자료 조회의 퍼포먼스와 안정성을 개선하고 있습니다. 공개할 수 있는 범위를 정리하는 중입니다.',
      en: 'Improving the performance and reliability of comprehensive income data retrieval. Details are being prepared for publication.',
    },
    projects: [],
  },
  {
    id: 'toss',
    name: { ko: '비바리퍼블리카 (토스)', en: 'Viva Republica (Toss)' },
    role: { ko: 'Node.js Developer · 정규직', en: 'Node.js Developer · Full-time' },
    start: '2021.11',
    end: '2025.02',
    accent: '#0064ff',
    ongoing: true,
    summary: {
      ko: '여러 제품 개발과 플랫폼에 기여했습니다. 공개할 수 있는 범위를 정리하는 중입니다.',
      en: 'Contributed to several products and to internal platform work. Details are being prepared for publication.',
    },
    projects: [],
  },
  {
    id: 'daangn',
    name: { ko: '당근마켓', en: 'Daangn' },
    role: { ko: 'Backend Developer · 정규직', en: 'Backend Developer · Full-time' },
    start: '2021.05',
    end: '2021.08',
    accent: '#ff6f0f',
    projects: [
      {
        title: { ko: '신사업 리서치 및 기획 개발', en: 'New business research and build-out' },
        period: '2021.08',
        points: {
          ko: [
            '신사업 TF에서 준비 중인 사업들을 리서치하고 관련 정보를 수집했습니다.',
            '서비스 기반을 준비하고 기획부터 개발까지 함께 진행했습니다.',
          ],
          en: [
            'Researched the businesses the new-venture task force was preparing and gathered the supporting information.',
            'Laid the service groundwork and carried it from planning through to implementation.',
          ],
        },
      },
      {
        title: { ko: '부동산 직거래 — 피드백 채팅', en: 'Peer-to-peer real estate — feedback chat' },
        period: '2021.06 – 2021.07',
        points: {
          ko: [
            '매물의 퀄리티를 높이기 위해 반응이 좋은 매물 데이터를 분석하고, 반응이 낮을 것으로 예상되는 매물에 피드백 채팅을 보냈습니다.',
            '실제로 상당한 피드백 반영이 일어났고 사진이 없는 게시글 비율이 크게 줄었습니다.',
          ],
          en: [
            'Analysed which listings drew strong responses, then sent feedback chats to listings predicted to underperform.',
            'A meaningful share of sellers acted on the feedback, and listings without photos dropped sharply.',
          ],
        },
      },
      {
        title: { ko: '부동산 직거래 — 지도뷰 백엔드', en: 'Peer-to-peer real estate — map view backend' },
        period: '2021.07 – 2021.08',
        points: {
          ko: ['부동산 직거래 서비스에 지도뷰를 도입하기 위한 API를 개발했습니다.'],
          en: ['Built the APIs required to bring a map view to the peer-to-peer real estate service.'],
        },
      },
    ],
  },
  {
    id: 'aimpact',
    name: { ko: '에이임팩트', en: 'Aimpact' },
    role: { ko: 'Backend Developer · 정규직', en: 'Backend Developer · Full-time' },
    start: '2021.02',
    end: '2021.05',
    accent: '#38a080',
    projects: [
      {
        title: { ko: '레거시 시스템 이전', en: 'Legacy system migration' },
        period: '2021.02 – 2021.04',
        points: {
          ko: [
            'PHP와 Node GraphQL로 구현된 기존 시스템은 오래되고 기반이 잡혀 있지 않아 에러 트래킹조차 되지 않는 부분이 많았습니다.',
            'DB 구조도 모델링이 되어 있지 않았고 필드 타입과 ORM 엔티티 매핑이 서로 맞지 않았습니다.',
            'NestJS 기반 백엔드로 이전하면서 DB 구조를 개선하고 TypeORM 엔티티와 동기화시켰습니다.',
          ],
          en: [
            'The existing PHP and Node GraphQL system was old and unstructured, with large areas where errors went untracked.',
            'The database was poorly modelled, and field types did not match the ORM entity mappings.',
            'Migrated to a NestJS backend, reworking the schema and bringing it back in sync with the TypeORM entities.',
          ],
        },
      },
      {
        title: { ko: '백엔드 기반 작업', en: 'Backend foundations' },
        period: '2021.02 – 2021.04',
        points: {
          ko: [
            'Sentry와 Slack을 연동해 실시간 버그 트래킹이 가능하게 했습니다.',
            'GitHub Actions로 CI/CD 환경을 구축했습니다.',
            'Codecov로 커버리지 룰을 세우고 트래킹했습니다.',
            'ELB와 ECS로 배포 환경을 구성하고 GitHub Actions와 연동해 배포를 자동화했습니다.',
          ],
          en: [
            'Wired Sentry into Slack so bugs surfaced in real time.',
            'Built the CI/CD pipeline on GitHub Actions.',
            'Set up coverage rules and tracking with Codecov.',
            'Composed the deployment environment on ELB and ECS and automated releases through GitHub Actions.',
          ],
        },
      },
    ],
  },
  {
    id: 'fetching',
    name: { ko: '페칭', en: 'FETCHING' },
    role: { ko: 'Backend Developer · 정규직', en: 'Backend Developer · Full-time' },
    start: '2020.08',
    end: '2021.02',
    // 공식 사이트의 정체성은 검정 워드마크다. 세일 강조색 #ff5722는 당근 주황과 부딪혀 쓰지 않는다.
    accent: '#000000',
    projects: [
      {
        title: { ko: '크롤러 memory leak 해결', en: 'Fixing the crawler memory leak' },
        period: '2020.09 – 2020.10',
        points: {
          ko: [
            '기존 코드가 WebDriver 웹 세션을 제대로 관리하지 못해 크롤러 실행 시간이 길어질수록 메모리 누수가 발생했습니다.',
            '크롤러를 주기적으로 재부팅해 넘기고 있었지만 근본적인 해결책이 아니었습니다.',
            '관리되지 않는 지점을 찾아 정리하고 세션 관리가 확실히 되는 구조를 만들어 누수를 없앴습니다.',
          ],
          en: [
            'The code never properly released WebDriver sessions, so memory leaked the longer a crawl ran.',
            'The team was rebooting crawlers on a schedule to cope, which treated the symptom rather than the cause.',
            'Tracked down the unmanaged paths and rebuilt session handling so the leak disappeared.',
          ],
        },
      },
      {
        title: { ko: '크롤러 기반 시스템 구축', en: 'Crawler platform' },
        period: '2020.09 – 2020.10',
        points: {
          ko: [
            '샵별 크롤러가 라즈베리파이에 흩어져 있어 제시간에 도는지, 에러가 났는지 추적하기 어려웠습니다.',
            '크롤링 대상을 서버에서 받아오는 구조로 바꿔 크롤러 코드를 한곳에 묶고 공통 부분을 정리했습니다.',
            'Sentry와 Slack을 붙여 즉각적인 에러 트래킹이 가능하게 했습니다.',
          ],
          en: [
            'Per-shop crawlers were scattered across Raspberry Pis, so it was hard to tell whether one had run on time or failed.',
            'Moved to a model where crawlers pull their targets from a server, consolidating the code and factoring out the shared parts.',
            'Attached Sentry and Slack so failures surfaced immediately.',
          ],
        },
      },
      {
        title: { ko: '크롤러 ECS 연동', en: 'Moving crawlers onto ECS' },
        period: '2020.08 – 2020.09',
        points: {
          ko: [
            '라즈베리파이로만 크롤러를 운영해 여러 한계가 있었습니다.',
            '크롤러를 Docker 이미지로 만들어 ECS에 올릴 수 있는 환경을 구성했고, 관리 리소스를 줄이면서 새 샵을 빠르게 추가할 수 있게 되었습니다.',
          ],
          en: [
            'Running every crawler on Raspberry Pis imposed hard limits.',
            'Packaged the crawlers as Docker images and moved them onto ECS, cutting maintenance overhead and making new shops fast to add.',
          ],
        },
      },
      {
        title: { ko: 'CI/CD 시스템 구축 · 코드 리뷰 도입', en: 'CI/CD and code review' },
        period: '2020.09 – 2020.10',
        points: {
          ko: [
            '테스트 코드도, CI/CD 환경도 없던 상태였습니다.',
            '테스트를 편하게 작성할 수 있는 구조를 만들고 GitHub Actions로 CI를 붙였습니다.',
            'Lint 룰로 코드 스타일을 통일하고 코드 리뷰 문화를 도입했습니다.',
          ],
          en: [
            'There were no tests and no CI/CD to speak of.',
            'Built a structure that made tests easy to write and attached CI through GitHub Actions.',
            'Unified code style with lint rules and introduced a code review practice.',
          ],
        },
      },
      {
        title: { ko: '쿼리 튜닝', en: 'Query tuning' },
        period: '2020.11',
        points: {
          ko: [
            '시스템을 재구축하는 과정에서 잘못된 쿼리와 메모리 누수 여지가 있는 쿼리가 많았고, 실제로 DB 다운까지 이어지는 경우가 있었습니다.',
            '문제 쿼리를 개선하고 구조적으로도 DB 부하가 덜 가도록 정리했습니다.',
          ],
          en: [
            'The rebuild surfaced many bad queries — some leaking memory, some taking the database down outright.',
            'Rewrote the offending queries and reshaped the access patterns to put less load on the database.',
          ],
        },
      },
      {
        title: { ko: 'TypeScript 마이그레이션', en: 'TypeScript migration' },
        period: '2020.08 – 2020.10',
        points: {
          ko: ['JS로만 구성된 백엔드와 크롤러 코드를 점진적으로 TS로 옮겨 안정성을 올렸습니다.'],
          en: ['Moved the JavaScript-only backend and crawler code to TypeScript incrementally, raising overall reliability.'],
        },
      },
      {
        title: { ko: '리워드 스타일 연동', en: 'RewardStyle integration' },
        period: '2020.10',
        points: {
          ko: [
            '커미션을 주는 사이트 중 리워드 스타일의 리워드가 가장 높았지만 API를 제공하지 않아 링크를 수동으로 만들어야 했습니다.',
            '리다이렉트 페이지에서 보이지 않는 iframe으로 띄워 쿠키를 적용하는 방식으로 연동에 성공했고 수익을 높였습니다.',
          ],
          en: [
            'RewardStyle paid the highest commission of any affiliate network but offered no API, so links had to be built by hand.',
            'Solved it by loading the network in a hidden iframe on the redirect page to apply its cookie, which lifted revenue.',
          ],
        },
      },
    ],
  },
  {
    id: 'whiteblock',
    name: { ko: '화이트블록', en: 'Whiteblock' },
    role: { ko: 'Backend Developer · 정규직', en: 'Backend Developer · Full-time' },
    start: '2020.02',
    end: '2020.06',
    // 테이킷 로고의 짙은 네이비. 기존 코랄은 당근 주황과 구분되지 않았다.
    accent: '#17194b',
    projects: [
      {
        title: { ko: '테이킷 배달 기능 런칭', en: 'Launching delivery on TAKEIT' },
        points: {
          ko: ['테이크아웃 주문 앱 테이킷에 배달 기능을 런칭했습니다.'],
          en: ['Launched the delivery feature on TAKEIT, a takeout ordering app.'],
        },
      },
    ],
  },
]

export const skills = ['Node.js', 'TypeScript', 'NestJS', 'MySQL', 'MongoDB', 'Redis', 'AWS', 'Docker']

export const education = [
  {
    school: { ko: '건국대학교', en: 'Konkuk University' },
    detail: { ko: '컴퓨터공학과', en: 'Computer Science and Engineering' },
    period: { ko: '2020.02 – 휴학', en: '2020.02 – on leave' },
  },
  {
    school: { ko: '충남삼성고등학교', en: 'Chungnam Samsung Academy' },
    detail: { ko: 'IT 과정 이수 · 학생회장', en: 'IT track · student council president' },
    period: { ko: '2017 – 2020', en: '2017 – 2020' },
  },
]

/** 경력·학력과 같은 시간 역순으로 둔다. */
export const awards = [
  {
    title: { ko: '세무회계 2급', en: 'Tax Accounting, Level 2' },
    date: '2024.12',
  },
  {
    title: { ko: '정보올림피아드 경시대회 은상', en: 'Korea Olympiad in Informatics — Silver' },
    date: '2018.05',
  },
]

export const ui = {
  resume: { ko: '이력서', en: 'Résumé' },
  experience: { ko: '경력', en: 'Experience' },
  skills: { ko: '스킬', en: 'Skills' },
  education: { ko: '학력', en: 'Education' },
  awards: { ko: '수상 · 자격증', en: 'Awards & Certifications' },
  contact: { ko: '연락처', en: 'Contact' },
  print: { ko: 'PDF로 저장', en: 'Save as PDF' },
  journey: { ko: '인터랙티브 여정 보기', en: 'View the interactive journey' },
  inProgress: { ko: '정리 중', en: 'In progress' },
  scroll: { ko: '스크롤', en: 'Scroll' },
  present: { ko: '재직중', en: 'Present' },
} satisfies Record<string, L>
