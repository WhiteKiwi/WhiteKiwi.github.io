# Working Context

> 정제되지 않아도 작업에 필요한 사실, 대화에서 얻은 정보, 디자인 결정과 레퍼런스를 계속 추가하는 공간이다. 사실이 바뀌면 기존 문장을 지우기보다 날짜와 함께 정정한다.

## Person

- 이름: 장지훈
- 영문 이름: **Jihoon Jang** (`Jihun`이 아님)
- 닉네임: **whitekiwi**
- 직무 표기: Node.js Developer
- LinkedIn: <https://www.linkedin.com/in/whitekiwi/>
- Email: `jh145478@gmail.com`
- Instagram: <https://www.instagram.com/whitekiwi_>
- GitHub: <https://github.com/whitekiwi>
- Blog: <https://blog.whitekiwi.link>

## Career facts from the user

- 화이트블록에서는 배달 관련 서비스를 만들었다.
- FETCHING에서는 명품 편집숍을 크롤링해 상품을 보여주는 서비스를 만들었다.
- 에이임팩트의 어레인지는 농부 사용자가 많았지만 농부 전용 서비스는 아니었다. 공식 소개 기준 직거래 주문처리 플랫폼이며 비정형 주문메시지 자동처리와 CS 연동 간편결제 주문서를 제공했다.
- 당근 경력은 당근다운 지역 감성으로 표현하고 싶어 한다.
- 2024년 5월부터 토스의 세이브잇 인수와 토스인컴 제작 과정에 함께했다.
- 2024년 세무회계 3급과 2급을 취득했다.
- 2025년 3월 Toss Income 계열사로 전적했다.
- 2017년 충남삼성고등학교에 입학해 IT 과정을 이수했고 학생회장을 했다.
- 충남삼성고등학교 IT 과정에서 `충남삼성고등학교 대나무숲`, `신입생들을 위한 가이드 페이지`, `학교 축제 좌석 티켓팅 사이트`, `학생회 홈페이지`, `면학실 자리 신청 사이트`를 만들었다.
- 2018년 정보올림피아드 경시대회 은상을 수상했다. 이전 이력서에서 확인했다.
- 2020년 건국대학교 컴퓨터공학과에 진학했고 현재 휴학 상태다. 이전 이력서에서 확인했다.

## Career project facts from the previous resume

- 화이트블록: 테이크아웃 주문 앱 테이킷에 배달 기능 런칭.
- FETCHING: 테스트·GitHub Actions CI와 코드 리뷰 문화 도입, 크롤러 웹 세션 관리로 메모리 누수 해결, Raspberry Pi 운영에서 Docker/ECS로 이전, JavaScript를 TypeScript로 점진 이전, RewardStyle 연동, 쿼리 튜닝, 크롤러 모듈화와 Sentry·Slack 에러 트래킹 구축.
- 에이임팩트: PHP·Node GraphQL 레거시를 NestJS 기반으로 이전, DB 구조와 TypeORM entity 매핑 개선, Sentry·Slack, GitHub Actions CI/CD, Codecov, ELB·ECS 배포 환경 구성.
- 당근: 중고차 직거래 리서치 및 초기 셋업, 부동산 직거래의 반응 낮은 매물에 피드백 채팅을 보내 품질 개선 유도, 부동산 직거래 지도뷰 백엔드 개발.
- 위 내용은 이전 이력서에서 확인했으며 공개 가능한 수치·세부 기술은 최종 검토가 필요하다.

## Current design decisions

- 첫 화면에는 텍스트 없이 큰 알과 낙하감만 보여준다.
- 2026-08-09 정정: 알보다 먼저 글라스틱한 `Hello, world` 필기 장면을 추가한다. `world`의 `o`가 Milk Glass 알로 변해 기존 낙하 장면으로 이어지는 구성을 선호한다.
- 알 시안 중 Glass Life를 선호했지만 투명한 알은 부화 서사와 충돌해 Milk Glass로 변경했다.
- 알이 깨질 때 키위색 빛은 사용하지 않고 평범한 균열을 사용한다.
- 유리 하늘에서 유리 지면으로 착지하고, 구름·낙하선은 착지 중 사라진다.
- 실제 부화 애니메이션은 어색해서 제거했다. 균열이 프롤로그의 마지막 프레임이다.
- 다음 장면은 전환 레이어가 아니라 첫 페이지 아래에 붙은 실제 2D 페이지다.
- 소개 장면은 스크롤 진행률에 키위 보행과 키네틱 타이포를 직접 연결한다.
- 알 클릭 직후 01의 비어 있는 첫 프레임에서 사용자가 2초간 스크롤하지 않으면 1회성 안내를 표시하고, 스크롤이 시작되면 자연스럽게 제거한다.
- 캐릭터는 03 Simple Flat 시트의 왼쪽 아래인 **3-C**를 기준으로 한다.
- 키위는 납작하지 않고 키가 크며, 갈색 몸·긴 부리·긴 다리를 유지한다.
- 문구의 마침표와 이름 아래 영문 보조 문구는 시각적 복잡도를 줄이기 위해 제거했다.
- Contact Dock은 우상단 대신 하단 크림색 여백에 배치한다.
- Contact Dock은 이름이 완전히 정착하기 전부터 조금 일찍 등장한다.
- Contact Dock의 외부 링크 순서는 `GitHub → Blog → LinkedIn → Instagram`이다.
- 데스크톱 최종 소개 문장은 세 문장 사이의 실제 빈 간격을 동일하게 맞춘다.
- 모바일 최종 소개 문장은 가로 연결 대신 왼쪽 정렬 세로 스택을 사용한다.
- `Node.js Developer`는 한글 문장보다 작아 보이지 않도록 별도의 시각 보정을 적용한다.
- scrollbar gutter를 예약해 생긴 오른쪽 흰 띠는 허용하지 않는다. 풀 블리드 배경과 안정적인 중심을 함께 유지해야 한다.
- `whitekiwi`는 등록상표 표기를 사용하지 않으므로 장식용 `®` 기호를 메인 소개 헤더에서 제거한다.
- 02 학력 장면은 학교 교정과 벚꽃이 아름다웠던 개인 기억을 중심에 둔다.
- 01에서 02로 전환할 때는 크림색 종이 무대가 들리고 큰 벚꽃잎이 카메라 앞을 휩쓰는 `page lift + blossom gust`를 사용한다.
- 최초 구현의 학력 전환은 일반 휠 입력에 너무 빨리 지나갔다. 전환 진행 구간을 약 두 배로 늘리고 양끝 easing을 강화한다.
- 02의 벚꽃잎은 스크롤 위치와 무관하게 계속 생성되고 흩날리는 ambient motion으로 사용한다.
- 충남삼성고등학교 공식 UI 기준색은 CNSA Navy `#005DAA`, CNSA Blue `#007DC3`, CNSA Sky `#13B5EA`다.
- 공식 CNSA 심볼은 큐브와 삼성의 S자를 형상화한다. 심볼 비례를 변형해 재현하지 않고 장면에는 워드마크와 색 체계만 차용한다.
- 학력 장면은 `충남삼성고등학교 IT 과정`에서 시작해 `건국대학교 컴퓨터공학과 진학`으로 마무리한다.
- 2026-08-09 정정: 학사모는 건국대학교 진학 엔딩에서만 나타내지 않고 Education 챕터 전체에서 키위가 쓰고 걷는다. 교육 장면의 테마가 즉시 읽히는 쪽을 우선한다.
- 학사모는 코드로 만든 별도 레이어처럼 떠 보이지 않도록 기본 캐릭터와 같은 일러스트 톤의 보행 스프라이트에 일체화한다.
- 고교 프로젝트 다섯 개는 전체 프로젝트가 아니라 현재 기억나는 선별 목록이다. 제목에서 총개수처럼 보이는 표현을 피하고 `SELECTED PROJECTS`로 표시한다.
- 프로젝트 장면 제목은 설명을 덜어낸 `세 번의 봄, 그 사이`로 정했다. 첫 줄은 조금 작게, 짧은 둘째 줄은 크게 두어 서로 다른 글자 수를 의도적인 타이포 리듬으로 사용한다.
- 2026-08-09 사용자는 긴 포트폴리오의 아래 장면을 새로고침마다 다시 내려가는 불편을 줄이기 위해 `#01`처럼 각 챕터로 바로 이동하는 검토용 링크를 요청했다. 짧은 번호 hash를 기본으로 하고 읽기 쉬운 설명형 alias도 함께 지원한다.
- 2026-08-09 사용자는 현재 구현된 포트폴리오의 마지막에 Contact 화면을 추가해 달라고 요청했다. 향후 07 Toss 이후에도 같은 마지막 화면으로 옮길 수 있도록 경력 번호와 분리하고, 직접 링크는 `#contact`를 사용한다.
- Contact 피날레는 `$ whoami`와 Graphite Prompt Mark의 분위기로 돌아오며 이메일을 가장 큰 CTA로, 외부 링크와 프롤로그 재시작을 보조 행동으로 둔다.
- 2026-08-09 정정: 사용자는 Contact를 일반 CTA 화면보다 실제 터미널로 구현하기를 원한다. 실행 history, 오류 메시지, 강한 타이핑 모션을 포함하고 `cd`에는 권한 오류를 반환한다.
- 정상 명령은 `help`, `whoami`, `open linkedin`, `open instagram`, `open email`로 제한한다. 사용자가 예시에서 쓴 `open instargram` 오타도 Instagram을 여는 호환 alias로 지원한다.
- `open`만 입력했을 때는 `command not found` 대신 사용법과 허용 채널을 보여준다. open 문법 자체를 발견하는 도움말로 취급한다.
- 2026-08-09 사용자는 Contact 피날레 하단에도 Introduction처럼 이메일과 외부 프로필 링크를 원한다. 터미널 명령 제한은 유지하되 직접 링크를 병행한다.
- Portfolio Guidelines는 링크 전용 상태를 끝내고 Contact 피날레의 `RUN AGAIN` 주변에 메인 여정의 첫 진입점을 둔다. 다른 장면에는 추가하지 않는다.
- 2026-08-09 Contact 보조 문구는 `좋은 제품에 관한 흥미로운 이야기라면, 언제든 반갑습니다.`로 확정했다.
- 터미널에 `clear` 명령을 추가한다. 현재 화면 출력만 숨기는 것이 아니라 같은 탭에 남긴 명령 히스토리도 함께 초기화한다.
- 하단 직접 링크와 기능을 맞추기 위해 `open github`, `open blog`도 정상 명령에 포함한다. `open` 도움말에는 GitHub, Blog, LinkedIn, Instagram, Email 다섯 채널을 표시한다.
- 2026-08-09 사용자는 `#00` 진입이 오프닝을 건너뛰는 버그를 확인했다. `#00`은 별도 ready 딥링크가 아니라 `/`와 똑같이 해시 없는 기본 오프닝으로 처리하고, Contact의 `RUN AGAIN`도 `/`로 연결한다.
- Contact 터미널의 숨은 이스터에그로 `iloveyou` → `I love you too`를 추가한다. 발견하는 재미를 위해 help와 화면 명령 목록에는 표시하지 않는다.

## Motion direction

- 포트폴리오 전체에서 애니메이션을 적극적으로 사용해 힙하고 세련된 인상을 만든다.
- 핵심 텍스트·캐릭터·장면 전환은 스크롤에 직접 반응시키고, 잎·꽃잎·공기·상태 안내처럼 서사를 방해하지 않는 요소는 ambient loop로 살아 있게 만든다.
- 자동 장식보다 스크롤에 직접 반응하는 움직임을 우선한다.
- 2026-08-09 정정: 키위의 이동은 항상 왼쪽에서 오른쪽일 필요가 없다. 시간의 진행은 챕터 순서와 진행선으로 유지하고 회사의 소재에 맞는 가장 인상적인 움직임을 선택한다.
- 화이트블록은 바이크 횡주행, FETCHING은 쇼윈도 스캔, 에이임팩트는 농사와 작물 성장, 당근은 동네 지도 경로 이동으로 구분한다.
- 텍스트는 중앙에서 크게 등장하고 축소·이동해 정보 구조로 조립된다.
- 이후 회사명, 역할, 프로젝트 키워드도 같은 모션 문법을 재사용할 수 있다.

## Visual references supplied by the user

- Tossface: <https://toss.im/tossface>
- Takeit 사업 제안서 PDF: 사용자가 다운로드 폴더에 저장했다고 알려줌. 저장소에는 포함하지 않음.
- 이전 이력서 `장지훈.pdf`: 사용자가 다운로드 폴더에 있다고 알려줌. 저장소에는 포함하지 않음.
- 충남삼성고등학교 UI: <https://www.cnsa.hs.kr/sub01/sub05.php>
- Renaud Rohlinger Portfolio: <https://renaudrohlinger.com/> — 연속된 세계와 스크롤 타임라인 기반 장면 전환 참고
- Supah Portfolio: <https://www.supah.it/portfolio/> — 첫 화면의 `Hello` 드로잉 모션 참고
- Kiwi reference images:
  - <https://ai-illustrator-file.com/wp-content/uploads/2020/04/101_0012_1.jpg.webp>
  - <https://www.shutterstock.com/image-vector/kiwi-bird-standing-profile-long-260nw-2744800461.jpg>
  - <https://www.shutterstock.com/shutterstock/photos/385076266/display_1500/stock-vector-set-of-doodle-kiwi-birds-and-kiwi-fruit-simple-and-cute-hand-drawn-illustration-385076266.jpg>
  - <https://as1.ftcdn.net/jpg/02/52/84/24/1000_F_252842417_8phEEwBbcu8Kbo2TPCiyYJ87V2cSDETC.jpg>
  - <https://i.pinimg.com/736x/55/f6/bb/55f6bbe969a14dd5d17a6872c0d8b95d.jpg>

## Reference sources to revisit

- `CloudAI-X/threejs-skills`
- `greensock/gsap-skills`
- `lottiefiles/motion-design-skill`
- `AThevon/genjutsu`
- Meng To / Design+Code skills
- Vercel `design.md`
- `nextlevelbuilder/ui-ux-pro-max-skill`
- designspells, recent.design, wwit, film.ai, post.design

이 목록은 사용자가 참고용으로 전달한 것이며, 저장소에 설치되었거나 코드가 직접 복사되었다는 뜻은 아니다.

## Favicon exploration

- 2026-08-09에는 사이트에 이미 쓰이는 3-C 키위 캐릭터를 출발점으로 파비콘 시안을 먼저 비교하고, 선택된 방향만 실제 favicon 세트로 연결한다.
- 작은 탭 크기에서도 정체성이 남도록 긴 부리, 물방울형 갈색 몸, 짙은 외곽선을 핵심 실루엣으로 유지한다.
- 시안은 정면 배지, 측면 실루엣, 프롤로그의 Milk Glass 알과 결합한 안, 극단적으로 단순화한 심볼 안으로 나눠 비교한다.
- 1차 생성 후 16 px 축소 검증에서는 A(캐릭터 클로즈업)와 D(3형태 미니멀)의 키위 인식성이 가장 높았다. C(알+키위)는 사이트 서사와 가장 강하게 연결되지만 작은 크기용 부리 비율 보정이 필요하고, B(다크 배지)는 흰 새 인상이 강해 기존 캐릭터와 거리가 있다.
- 사용자는 처음에는 D(3형태 미니멀)를 선택해 사이트에 적용했지만, 이후 새 이미지를 생성하는 것이 아니라 이미 `?view=glass`에 구현돼 있던 D `Before I Hatch`—보라색 배경의 Glass Shell 너머로 연두색 키위새 실루엣이 보이는 시안—그 자체를 favicon으로 쓰는 방향으로 변경했다.
- `Before I Hatch` 시안에서 16 px·32 px·48 px PNG, multi-size ICO, 180 px Apple touch icon을 파생해 사이트 `<head>`에 연결한다.
- 1회성 `SCROLL TO BEGIN` 안내 디자인은 유지하되 큰 화면에서는 라벨·아이콘·한글 설명을 조금 더 키워 시인성을 높인다.
- 파비콘 변경과 무관하게 브라우저 title은 설명형 문구 대신 심플한 `Kiwi's`를 유지한다. 역할과 검색용 설명은 이후 SEO·Open Graph 메타데이터에서 보완한다.
- 2026-08-09 정정: 최종 OG 문구 결정과 함께 브라우저 title도 `$ whoami`로 변경한다. 이전 `Kiwi's` 유지 결정은 이 항목으로 대체한다.
- 2026-08-09 정정: 사용자는 `$ whoami` title과 연결되는 `>_` 프롬프트 파비콘 변형 중 Glass Sky 팔레트 시안 `exec-47a5adf7-a2f5-44e9-af1a-c20499e3ff1c`을 시험 적용하기로 했다. 옅은 하늘색 배경, 짙은 블루그레이 `>`, 흰 `_` 구성을 사용하며 이전 `Before I Hatch` 적용은 이 결정으로 교체한다.
- Glass Sky 시안을 실제 크기로 축소하면 32 px에서는 `>_`가 모두 읽히지만 16 px에서는 흰 `_`가 옅은 배경에 거의 묻힌다. 현재는 선택 시안을 그대로 적용하고 최종 유지 여부와 16 px 전용 대비 보정은 사용자 확인 후 결정한다.
- 2026-08-09 정정: Glass Sky 시험 적용 대신 Graphite 배경, 아이보리 `>`, 앰버 `_`의 원본 Prompt Mark 시안 `exec-dd147eac-8649-4b54-8cb1-c4cc001ad04d`을 파비콘으로 적용한다. 이 결정이 직전 Glass Sky 적용을 대체한다.
- Graphite Prompt Mark는 실제 축소 결과 16 px와 32 px 모두에서 `>`와 `_`가 분리되어 보여 Glass Sky보다 명암과 기호 인식성이 안정적이다.

## Open Graph direction

- 2026-08-09 사용자는 OG 비교 시안 중 크림색 배경에 `$ whoami`, 큰 `whitekiwi`, 작은 키위 기호와 `Jihoon Jang · Node.js Developer`를 배치한 미니멀 타이포 시안을 선택했다.
- 선택 원본은 생성 결과 `exec-33acd6ac-88f1-4cc4-bf4f-1a10934b65af`이며, 실제 배포에는 1200×630 PNG로 맞춰 사용한다.
- title은 `$ whoami`, description은 `Scroll through the work and journey of Jihoon Jang, a Node.js developer.`로 확정해 브라우저·Open Graph·Twitter Card에 일관되게 사용한다.

## Portfolio Guidelines direction

- 2026-08-09 사용자는 일반적인 브랜드 가이드처럼 포트폴리오의 색, 마크와 콘셉트를 정리한 `Portfolio Guidelines` 페이지를 요청했다.
- 현재 메인 포트폴리오에는 진입점을 만들지 않고 `?view=guidelines` 직접 링크로만 접근한다. 메인에서 연결할 위치와 방식은 이후 사용자가 정한다.
- 공식 레퍼런스로 [Vercel Geist·Brand](https://vercel.com/geist/brands)에서 토큰과 타이포의 계층, [Linear Brand](https://linear.app/brand)에서 넉넉한 여백과 간결한 마크 규칙, [Spotify Design](https://developer.spotify.com/documentation/design)에서 최소 크기·안전 여백과 do/don't 예시 구조를 참고한다. 외형을 복제하지 않고 `whitekiwi`의 Graphite·Ivory·Amber 프롬프트 정체성과 여정형 모션 원칙으로 번역한다.
- 페이지의 핵심 인상은 `technical depth`, `playful precision`, `editorial clarity`, `motion with intent` 네 문장으로 정리한다.
- 가이드라인은 완성 선언이 아니라 계속 갱신되는 `living document`로 다루며 현재 버전은 `01 / 2026.08`로 표시한다.

## Analytics

- 2026-08-09 사용자가 제공한 GA4 측정 ID는 `G-BD6TDB13LR`이다.
- Google tag의 기본 `config` 호출로 page view만 적용하고, 커스텀 이벤트와 사용자 식별은 이후 별도 요청 전까지 추가하지 않는다.

## Repository history

- 기존 Gatsby 소스의 보존 브랜치: `archive/20260808`
- 현재 소스 브랜치: `develop`
- 배포 산출물 브랜치: `master` / `origin/master`
- 기존 Gatsby CI는 `develop` push 시 Gatsby `public/`을 `master`로 게시했다.
- 현재 앱은 Vite이므로 산출물 디렉터리는 `dist/`이다.
- 현재 CI는 `develop` push 또는 수동 실행 시 빌드하고, develop ref일 때만 `dist/`를 orphan `master`에 게시하도록 현대화했다.
- 2026-08-09부터 포트폴리오 custom domain은 `portfolio.whitekiwi.link`를 사용하며 Route 53 CNAME으로 `whitekiwi.github.io`에 연결한다.

## Open questions

- Toss와 Toss Income 장면의 구체적인 프로젝트와 시각 테마
- 회사별 공개 가능한 성과 수치와 기술적 설명
- 최종 사이트의 한국어/영어 범위
- 커스텀 도메인 재사용 여부
- 실험용 시안 페이지를 최종 배포에 남길지 여부

## Reported issues and launch tasks

- 모바일에서 알 낙하를 시작하려고 스크롤하면 프롤로그 장면 자체가 위로 끌리고 화면 아래 흰 영역이 드러난다. 프롤로그 잠금 중 native scroll과 iOS elastic overscroll을 막고 `svh/dvh`, body 배경, touch event 기본 동작을 함께 확인해야 한다.
- 일반 휠 한 번과 모바일의 빠른 플릭에서 진행률이 너무 크게 변해 장면이 확 넘어간다는 피드백이 있었다. 자동 재생이나 강한 지연보다 모바일 트랙의 물리적 길이를 늘려 직접 반응성을 유지하면서 감도를 낮춘다.
- 프롤로그는 `Hello, world`를 약 4.8초 동안 그리고 가운데 `o`만 남겨 알로 응축한 뒤 낙하 대기 장면으로 연결한다. 모션 감소 설정에서는 약 0.2초 뒤 바로 알로 이동한다.
- 프롤로그가 `ready`가 되기 전에는 브라우저 문서 스크롤을 잠근다. Chrome 에뮬레이션에서 하향 휠 트리거 직후 `scrollY = 0` 유지와 착지 후 overflow 복원을 확인했다.
- 에이임팩트의 어레인지 농장 장면은 최초 농부 일러스트에 그려진 정적인 물방울은 유지하되, 별도로 추가했던 반복 물줄기 애니메이션만 제거한다. 당근을 포함한 작물 잎과 구름의 움직임으로 생동감을 유지하고, 마우스가 밭을 지나갈 때는 이동 방향과 가까운 작물부터 잎이 휘어 바람이 따라가는 듯한 반응과 작게 되튕기는 감쇠 여운을 더한다.
- 2026-08-09 정정: 에이임팩트에서 당근으로 넘어갈 때 실제 당근을 중심으로 페이지 전체가 확대되는 전반부는 유지하되, 이 확대는 스크롤 보간이 아니라 클릭 트리거 순간 끝까지 재생되는 자동 시퀀스여야 한다. 기존에는 클릭하지 않아도 track 끝을 스크롤로 통과할 수 있어 전환이 여전히 스크롤처럼 느껴졌으므로, 클릭 가이드 지점에서 하향 입력을 막고 당근 활성화만 다음 장면을 열게 한다. 완전히 주황색이 된 뒤 당근 장면을 다시 축소하는 연출은 제거하고, 정상 배율의 당근 장면 위에서 주황색 막이 봄 교정 전환처럼 천천히 걷히며 자연스럽게 이어지게 한다. 역방향은 기존 stage 확대를 되감다가 화면이 깨지는 구조를 버리고, 상향 입력 임계점에서 scroll을 먼저 막은 뒤 주황색 막으로 가림·위치 교체·reveal만 실행한다.

## Career visual references

- 2026-08-09 사용자가 추가로 제공한 테이킷 로고 이미지는 버터 옐로 배경, 짙은 네이비 로고·텍스트, 봉투 상단의 작은 코랄 포인트로 구성된다. 장면 전체를 이 팔레트로 바꾸자 큰 면적의 남색 도로가 지나치게 강해 이전 디자인이 더 좋아 보인다는 피드백이 있었다. 기존 크림·딥그린 무대를 복구하고 세 브랜드색은 주문 전표 안에만 제한한다: <https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSo3vEIxgBpTac4W5lLbKTivf4ixYaSLzZQtHSvJ1WezKd2qx4BgqJ3OaE&s=10>
- 에이임팩트는 공식 어레인지 소개의 직거래 주문처리 맥락을 따뜻한 밭과 시스템 레이어의 성장으로 표현한다. 농장은 주요 사용자군을 암시할 뿐 전체 사용자를 농부로 규정하지 않는다. 제품 정보 레이어에는 공식 사이트에서 확인한 민트 `#38a080`·`#3db087`, 화이트와 라이트 그레이 톤을 반영한다: <https://aimpact.kr/>
- 당근은 공식 서비스 소개의 동네 연결 맥락과 오렌지 포인트를 지도·매물 핀·채팅으로 표현했다: <https://about.daangn.com/service/>
- FETCHING은 현재 확인 가능한 공식 사이트가 없어 이력서의 명품 편집숍 크롤링 경험을 기준으로 버건디·블랙·브라스 쇼윈도 톤을 구성했다.

## Deployment state

- `develop` push에서 `master` 정적 산출물을 만드는 GitHub Actions가 실제 저장소에서 연속 성공했다.
- Route 53의 `portfolio.whitekiwi.link` CNAME은 `whitekiwi.github.io`를 가리키고, 배포 workflow도 `CNAME` 파일을 보존한다.
- GitHub Pages 커스텀 도메인은 등록됐지만 2026-08-09 현재 전용 TLS 인증서 발급을 기다리고 있다. 발급 전 `*.github.io` 인증서 경고를 우회하지 않는다.
- 2026-08-09 GitHub Pages DNS check가 성공한 뒤 `portfolio.whitekiwi.link` 전용 Let's Encrypt 인증서가 배포됐다. 실제 HTTPS 요청은 200을 반환하고 Pages API의 `https_enforced`도 활성화됐다.
- 2026-08-09 리뷰에서 모션 감소 프롤로그가 오히려 12초로 늘어나는 CSS 우선순위 문제, 활성 전 당근 버튼의 키보드 포커스, 쓰기 권한 workflow의 변경 가능한 action 태그, EggLab WebGL의 계속되는 렌더 루프가 지적됐다. 네 항목 모두 실제 동작 또는 공급망 방어에 유효해 픽하며, 메인 접근성 문제를 우선하고 EggLab은 공개 보조 뷰의 저비용 보완으로 함께 처리한다.
- 2026-08-09 사용자가 05↔06 전환이 여전히 어색하고 당근에서 상향 복귀하면 에이임팩트 화면이 깨진다고 확인했다. 양쪽 sticky stage 내부의 개별 커튼과 상태 class를 교대하던 구현을 폐기하고, track 바깥의 단일 fixed 커튼이 프로그램 스크롤 전후를 계속 덮게 한다. 역방향에는 stage transform을 전혀 사용하지 않고 에이임팩트를 정상 배율의 클릭 게이트 위치로 복원한다.
