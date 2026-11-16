# 섹션 소유권 통합 기록 — 한글 사이트 (choi0003.github.io)

- 통합일: 2026-11-16
- 근거 지시: 2026-11-16 선생님 — "영어소설을 한글싸이트에 함께 게재해. 지아 방송국도 마찬가지. 그래서 각자에게 서브 메뉴를 맡겨서 내용 업데이트도 각자하게 만들어."
- 공용 메뉴 순서 (2026-11-16 통합): 첫 화면 / 책 / 음악 / 단편 / **영어소설** / 오디오북 / **방송국** / 에세이 / 가족 / 사람들의 방
  - 메뉴가 실제로 들어간 곳: 루트 허브 페이지 9개(index·books·music·shorts·audiobooks·essays·family·guestbook·four-strings)와 두 섹션의 전 페이지. 날짜별 에세이 등 나머지 기존 페이지는 기존 메뉴를 유지한다 (일괄 교체는 게시 매니페스트가 커져 보류 — 필요하면 후속 작업으로).

## 섹션 1 — 영어소설 (Denmark Nights)

- **소유자: 꽃순이 (영어 소설 담당)** — 이 섹션의 페이지 추가·갱신은 꽃순이의 소설 루틴이 맡는다.
- 경로: `~/workspace/github-site/denmark-nights/` → 게시 뒤 `https://choi0003.github.io/denmark-nights/`
- 상세 기록: [ownership-denmark-nights.md](ownership-denmark-nights.md)
- 핵심 원칙: 전문 공개는 권당 확정된 편만 (Volume 1은 Ep.1·Ep.2), 나머지는 소개+발췌(첫 600~800단어). Ep.3 이후 전문을 어떤 파일에도 넣지 않는다. 구입 링크(Google Play Books)는 출간 뒤 소유자가 채운다.

## 섹션 2 — 네줄이 방송국

- **소유자: 지아 (방송국 담당)** — 이 섹션의 페이지·피드·회차 데이터 갱신은 지아가 맡는다.
- 경로: `~/workspace/github-site/four-strings-broadcast/` → 게시 뒤 `https://choi0003.github.io/four-strings-broadcast/` (피드: `…/feed.xml`)
- 상세 기록: [ownership-broadcast.md](ownership-broadcast.md)
- 핵심 원칙: 회차 공개는 판정·승인 뒤에만. 판정 대기 회차는 episodes.json의 보류 키에만 두고 정식 `episodes` 배열과 피드에 넣지 않는다. 피드는 손으로 고치지 않고 `build_feed.py`로 생성한다. 공개 이메일이 정해지기 전에는 생성기가 피드 생성을 거부하는 것이 정상이다.

## 공용 규칙

- 섹션 소유자는 자기 섹션 폴더 안만 고친다. 공용 메뉴·다른 섹션·루트 페이지 변경은 총괄(도미)을 거친다.
- 게시(업로드)는 로컬 변경과 별개 단계 — 승인 뒤에 한다.
- 새 섹션이 생기면 이 문서에 소유자·경로·핵심 원칙을 먼저 적고, 상세 기록 파일을 drafts/에 따로 둔다.
