# 네줄이 방송국 섹션 — 소유권 기록

- 기록일: 2026-11-16
- 근거 지시: 2026-11-16 선생님 — 방송국을 전용 저장소가 아니라 한글 사이트(choi0003.github.io)에 편입하고, 지아가 이 섹션을 맡아 업데이트하는 구조를 만든다.
- 이전 경위: 2026-11-15 전용 저장소용 껍데기 패키지(`~/workspace/goals/goal-6/hidden_files/broadcast-station-shell-2026-11-15/`)를 만들었으나 저장소는 개설하지 않았고, 이번에 그 껍데기를 한글 사이트 섹션으로 가져왔다. 메뉴 통합(사이트 공용 메뉴에 방송국 링크 추가)은 총괄이 따로 한다 — 이 섹션 작업에서는 섹션 밖 파일을 건드리지 않았다.

## 섹션 소유자

- **소유자: 지아 (방송국 담당)** — 이 섹션의 페이지·피드·회차 데이터 갱신은 지아가 맡는다.
- 게시(업로드) 자체는 별도 승인 뒤에 한다. 2026-11-16 편입 작업은 로컬 저장소까지만 했고 게시하지 않았다.

## 섹션 경로

- 로컬: `~/workspace/github-site/four-strings-broadcast/`
- 공개 주소(게시 뒤): 페이지 `https://choi0003.github.io/four-strings-broadcast/` · 피드 `https://choi0003.github.io/four-strings-broadcast/feed.xml`
- 피드·링크 주소는 껍데기 episodes.json이 이미 이 경로를 기준으로 삼고 있어 바꾸지 않았다.

## 파일 구성

| 경로 | 역할 |
|---|---|
| `four-strings-broadcast/index.html` | 방송국 페이지. 상단에 한글 사이트 공용 nav(`../index.html` 등 `../` 접두), 파일럿 카드, 회차·구독 섹션 |
| `four-strings-broadcast/style.css` | 섹션 전용 보충 스타일 (공용 스타일은 `../style.css`를 함께 읽는다) |
| `four-strings-broadcast/feed.xml` | 팟캐스트 피드 틀. 회차(item) 0개, 공개 이메일 `PUBLIC_EMAIL_NOT_SET` — 손으로 고쳐 게시하지 않고 `build_feed.py`로 생성한다 |
| `four-strings-broadcast/episodes.json` | 회차 목록 원본. `channel` + 정식 목록 `episodes` 배열 + 보류·예시 키(`_pending_...`, `_example_...`, 생성 제외) |
| `four-strings-broadcast/build_feed.py` | 피드 생성기. 이 폴더에서 `python3 build_feed.py` 실행 (기본 `--site-dir .`). placeholder·파일 없음·회차 0개이면 생성을 거부한다 |
| `four-strings-broadcast/episodes/` | 회차 mp3 자리. 현재 `ep001-pilot-v2.mp3`(판정 대기·미공개)와 README |
| `four-strings-broadcast/assets/` | 아트워크 자리. 현재 README만 (cover.jpg 미제작) |
| `four-strings-broadcast/README.md` | 섹션 안내 — 편입 경위, 상태, mp3 배치 근거, 운영 규칙 |

## 새 회차 추가 절차

1. 회차 mp3를 `episodes/`에 파일명 규칙(`epNNN-제목-vN.mp3`, 회차 번호+버전 포함)으로 넣는다. 수정본은 내용만 교체하지 말고 파일명을 바꾼다.
2. `episodes.json`의 `episodes` 배열에 회차 1건을 적는다: `id`(예: ep002), `episode_number`, `title`, `description`, `file`(예: `episodes/ep002-....mp3`), `duration_seconds`, `explicit`, `pub_date`(ISO 8601, 공개가 확정된 날짜만 적는다).
3. 공개 이메일 placeholder가 실제 주소로 바뀌어 있는지 확인한다 — 남아 있으면 생성기가 거부한다.
4. 이 폴더에서 `python3 build_feed.py`를 돌려 `feed.xml`을 생성한다. GUID는 회차 id 기반 uuid5로 고정이라 다시 돌려도 바뀌지 않는다. enclosure 길이는 실제 파일 크기에서 자동으로 읽는다.
5. `index.html`의 회차 섹션에 같은 회차 카드를 추가하고, 상태를 갱신한다 (공개 회차 수, "아직 공개된 회차가 없습니다" 문구 제거 등).
6. 페이지·피드·데이터 세 곳의 제목·파일명·길이가 서로 맞는지 대조한 뒤 게시한다.

## 판정 대기 회차의 취급 규칙

- 판정이 끝나지 않은 회차는 정식 목록에 넣지 않는다: `episodes.json`에서는 `episodes` 배열이 아닌 보류 키(`_pending_episode_<id>_not_published`)에 기록하고, `pub_date`는 비워 둔다(지어내지 않는다).
- `feed.xml`에는 넣지 않는다 — 보류 회차가 있는 동안 피드는 그 회차 없이 유지한다.
- 페이지에는 숨기지 않고 표시한다: "파일럿 — 최종 판정 대기 중" 상태를 상단 안내와 회차 카드에 분명히 적는다. 재생 자리(`<audio controls preload="none">`)를 미리 연결해 둘 수는 있지만, 정식 공개 회차로 표기하지 않는다.
- 판정 뒤 공개가 결정되면: 보류 항목을 `episodes` 배열로 옮기고 `pub_date`를 확정해 채운 뒤 위 절차 4~6을 따른다. 공개하지 않기로 결정되면 보류 키와 페이지의 판정 대기 표기를 그 결정에 맞게 정리한다.
- 현재 보류 회차: 1회차 첫 방송 파일럿 v2 (`ep001`, `episodes/ep001-pilot-v2.mp3`, 5,929,004 bytes, 246.99초) — 2026-11-16 현재 최종 판정 대기 중.

## 미결 placeholder · 결정 대기 목록

| # | 항목 | 현재 값/상태 | 정해지면 바꿀 곳 |
|---|---|---|---|
| 1 | 피드 공개 이메일 | `PUBLIC_EMAIL_NOT_SET` (미정 — 지어내지 않음) | `episodes.json` channel.owner_email → `build_feed.py`로 feed.xml 재생성 |
| 2 | 파일럿 v2 공개 여부·공개 날짜 | 최종 판정 대기 중 | `episodes.json` 보류 키 → `episodes` 배열 이동 + `pub_date` 확정, `index.html` 상태 표기 |
| 3 | 아트워크 cover.jpg | 미제작 (규격: 정사각 1400~3000px, JPG/PNG, RGB, 투명 불가) | `assets/cover.jpg` 배치 (feed.xml의 itunes:image가 그 주소를 가리키는 중) |
| 4 | 카테고리·형식 | Fiction > Drama, `itunes:type=serial` 잠정 | 제출 전 확인 1회로 확정 → `episodes.json` channel |
| 5 | 방송국 이름 영문 병기 여부 | 「네줄이 방송국」 단독 표기 | 피드 타이틀·페이지 표기 |
| 6 | 사이트 공용 메뉴에 방송국 링크 추가 | 미반영 (총괄 몫으로 분리됨) | 사이트 루트 페이지들의 nav — 이 섹션 소유 범위 밖 |
| 7 | Apple·Spotify·YouTube 제출 시점 | 미정 (피드 공개 이메일과 판정이 먼저) | 제출은 별도 결정 뒤 |
| 8 | 용량 감시 | 한글 사이트 전체 457,368,416 bytes(2026-11-16 로컬 실측) + 파일럿 5,929,004 bytes — GitHub Pages 게시 상한 1GB와 한도를 사이트 전체가 나눠 쓴다 | 회차가 쌓이면 주기적으로 전체 크기를 재서 기록 |

## mp3 배치 방식 메모 (결론 요약)

- 방식: mp3를 GitHub Pages(한글 사이트)에 직접 올린다 — 된다. 근거: 파일럿 5.9MB « 단일 파일 차단선 100MiB, 게시 상한 1GB (GitHub 공식 Pages limits 문서, 2026-11-16 확인); 이 사이트가 이미 mp3 60개(music/ 31개 + audio/ 28개 + four-strings/ 1개)를 같은 방식으로 운영 중이라는 실증; HEAD 200 + Range 206 실측 기록(2026-11-13 조사, 2026-11-14 재실측)이 같은 호스팅에 있다.
- 대안으로 조사만 돼 있는 자리: Cloudflare R2(무료 10GB, 전송비 0 — 2026-11-13 조사). 미니 서버 Funnel은 실측 36KB/s로 부적합 판정을 받았다. 대안은 제시만 하고 결정하지 않았다 — 용량·대역폭이 실제로 걸릴 때 다시 결정한다.
