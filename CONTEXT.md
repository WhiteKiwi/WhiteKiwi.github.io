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
- 에이임팩트는 농부 사용자가 많은 주문 관리 서비스였다.
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
- 당근: 신사업 리서치·기획·개발, 부동산 직거래의 반응 낮은 매물에 피드백 채팅을 보내 품질 개선 유도, 부동산 직거래 지도뷰 백엔드 개발.
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
- 학사모는 교육 장면 전체의 의상이 아니라 건국대학교 진학 문구가 나오는 엔딩에서만 떨어져 씌워지는 포인트로 사용한다. 캐릭터의 귀여움은 살리되 대학 졸업으로 읽히는 오해를 줄이기 위한 선택이다.
- 고교 프로젝트 다섯 개는 전체 프로젝트가 아니라 현재 기억나는 선별 목록이다. 제목에서 총개수처럼 보이는 표현을 피하고 `SELECTED PROJECTS`로 표시한다.
- 프로젝트 장면 제목은 설명을 덜어낸 `세 번의 봄, 그 사이`로 정했다. 첫 줄은 조금 작게, 짧은 둘째 줄은 크게 두어 서로 다른 글자 수를 의도적인 타이포 리듬으로 사용한다.

## Motion direction

- 포트폴리오 전체에서 애니메이션을 적극적으로 사용해 힙하고 세련된 인상을 만든다.
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
- 출시 전 Open Graph 메타데이터·대표 이미지와 favicon 세트를 추가해야 한다.

## Career visual references

- 화이트블록은 사용자가 제공한 테이킷 영업제안서의 코랄·크림·딥그린 인상을 주문 전표와 도로 장면으로 번역했다.
- 에이임팩트는 공식 어레인지 소개의 농산물 주문 관리 맥락을 따뜻한 밭과 시스템 레이어의 성장으로 표현했다: <https://aimpact.kr/>
- 당근은 공식 서비스 소개의 동네 연결 맥락과 오렌지 포인트를 지도·매물 핀·채팅으로 표현했다: <https://about.daangn.com/service/>
- FETCHING은 현재 확인 가능한 공식 사이트가 없어 이력서의 명품 편집숍 크롤링 경험을 기준으로 버건디·블랙·브라스 쇼윈도 톤을 구성했다.
