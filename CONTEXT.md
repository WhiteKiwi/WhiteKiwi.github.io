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

## Current design decisions

- 첫 화면에는 텍스트 없이 큰 알과 낙하감만 보여준다.
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
- 데스크톱 최종 소개 문장은 세 문장 사이의 실제 빈 간격을 동일하게 맞춘다.
- 모바일 최종 소개 문장은 가로 연결 대신 왼쪽 정렬 세로 스택을 사용한다.
- `Node.js Developer`는 한글 문장보다 작아 보이지 않도록 별도의 시각 보정을 적용한다.
- scrollbar gutter를 예약해 생긴 오른쪽 흰 띠는 허용하지 않는다. 풀 블리드 배경과 안정적인 중심을 함께 유지해야 한다.
- `whitekiwi`는 등록상표 표기를 사용하지 않으므로 장식용 `®` 기호를 메인 소개 헤더에서 제거한다.

## Motion direction

- 포트폴리오 전체에서 애니메이션을 적극적으로 사용해 힙하고 세련된 인상을 만든다.
- 자동 장식보다 스크롤에 직접 반응하는 움직임을 우선한다.
- 키위는 기본적으로 왼쪽에서 오른쪽으로 이동하며 경력의 시간 방향과 일치한다.
- 텍스트는 중앙에서 크게 등장하고 축소·이동해 정보 구조로 조립된다.
- 이후 회사명, 역할, 프로젝트 키워드도 같은 모션 문법을 재사용할 수 있다.

## Visual references supplied by the user

- Tossface: <https://toss.im/tossface>
- Takeit 사업 제안서 PDF: 사용자가 다운로드 폴더에 저장했다고 알려줌. 저장소에는 포함하지 않음.
- 이전 이력서 `장지훈.pdf`: 사용자가 다운로드 폴더에 있다고 알려줌. 저장소에는 포함하지 않음.
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
- 커스텀 도메인 `CNAME`은 과거 master에 추가되었다가 삭제된 상태다.

## Open questions

- Toss와 Toss Income 장면의 구체적인 프로젝트와 시각 테마
- 회사별 공개 가능한 성과 수치와 기술적 설명
- 최종 사이트의 한국어/영어 범위
- 커스텀 도메인 재사용 여부
- 실험용 시안 페이지를 최종 배포에 남길지 여부
