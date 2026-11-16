# 네줄이 방송국 — 한글 사이트 섹션 (2026-11-16 편입)

> 담당: 지아 (방송국 담당). 소유권 기록: `~/workspace/github-site/drafts/ownership-broadcast.md`
> 경위: 2026-11-15에 전용 저장소용으로 만든 껍데기 패키지(`~/workspace/goals/goal-6/hidden_files/broadcast-station-shell-2026-11-15/`)를, 2026-11-16 선생님 지시로 전용 저장소가 아니라 한글 사이트(choi0003.github.io)의 한 섹션으로 편입했다. 이 폴더가 곧 섹션 루트다.
> 주소: 페이지 `https://choi0003.github.io/four-strings-broadcast/` · 피드 `https://choi0003.github.io/four-strings-broadcast/feed.xml` (껍데기 episodes.json이 이미 이 주소를 기준으로 삼고 있어 그대로 유지했다.)
> 현재 상태: **로컬 편입까지만. 게시(업로드)는 하지 않았다.** 파일럿 v2는 최종 판정 대기 중이라 정식 공개 회차가 아니다.

## 들어 있는 것

| 파일 | 무엇인가 | 상태 |
|---|---|---|
| `index.html` + `style.css` | 방송국 페이지 — 공용 nav(`../` 접두) + 파일럿 카드 + 회차·구독 자리. 공용 스타일은 `../style.css`, 이 파일은 섹션 보충분만 | 편입 완성, 게시 안 함 |
| `feed.xml` | RSS 2.0 + iTunes 태그 피드 틀 — 채널 정보만, 회차(item) 0개 | 틀 상태가 정상 (회차 최소 1개는 공개 단계에서) |
| `episodes/ep001-pilot-v2.mp3` | 첫 방송 파일럿 v2 — 5,929,004 bytes, 246.99초, 44.1kHz 스테레오 192kbps. 원본 `~/workspace/flower-nims/2026-11-14-음악루틴/jia-broadcast-v2/첫방송-v2.mp3`와 바이트 단위 동일(md5 일치 확인) | **판정 대기 — 페이지 재생 자리에만 연결, 피드·공개 목록에는 없음** |
| `episodes/` | 회차 mp3 자리 (규칙은 폴더 안 README) | 파일럿 1개만, 미공개 상태 |
| `assets/` | 아트워크 자리 (규격은 폴더 안 README) | 비어 있음 — cover.jpg 미제작 |
| `episodes.json` | 회차 목록 원본 — 생성기가 읽는 유일한 입력. `episodes` 배열은 빈 상태이고, 파일럿 v2 정보는 보류 키 `_pending_episode_ep001_not_published`에 들어 있다 | 보류 1건 + 예시 구조 1건(`_example_...`, 생성 제외) |
| `build_feed.py` | episodes.json → feed.xml 생성기. GUID는 회차 id에서 고정 생성(uuid5). 이 폴더 구조에 맞게 기본 `--site-dir`을 `.`으로 바꿨고, 안전장치(placeholder·파일 없음·회차 0개 거부)는 껍데기와 동일 | 동작 검증: 현재 상태에서는 거부(exit 1)가 정상임을 확인 |

## 판정 대기 회차의 취급 (숨기지 않는다)

- 파일럿 v2는 선생님 귀 판정이 끝나지 않았다. 페이지 상단과 카드에 "파일럿 — 최종 판정 대기 중"을 분명히 표시했다.
- `episodes.json`의 정식 목록(`episodes`)에는 넣지 않았다. 판정 뒤 공개가 결정되면 보류 키 항목을 배열로 옮기고 `pub_date`를 그때 확정해 채운 뒤 `build_feed.py`로 피드를 생성한다.
- `feed.xml`은 회차 0개를 유지한다. 판정 전에 피드에 회차를 넣지 않는다.

## mp3 배치 — 되는 근거 (2026-11-16 확인)

- 파일 크기: 파일럿 5,929,004 bytes(약 5.9MB). GitHub 공식 문서(GitHub Pages limits) 기준 게시 사이트 상한 1GB, 대역폭 soft 100GB/월. GitHub 단일 파일 차단선은 100MiB라 파일럿은 그 약 6%다.
- 같은 사이트 실증: 이 한글 사이트는 이미 mp3 60개를 올려 운영 중이다 — `music/` 31개(111,029,621 bytes), `audio/` 28개(326,906,326 bytes, 장당 약 17~19MB로 파일럿의 약 3배), `four-strings/` 1개. 사이트 전체 작업 폴더 457,368,416 bytes로 1GB 상한의 절반 이하이고, 파일럿을 더해도 여유가 크다. 단, 전용 저장소와 달리 **한도를 한글 사이트 전체와 나눠 쓴다**는 점은 소유권 기록에 남겼다.
- Range 요청: 2026-11-13 조사(`broadcast-station-research-2026-11-13.md`)에서 이 사이트의 mp3가 HEAD 200 OK + Range 206 Partial Content(1MB 구간)를 확인했고, 2026-11-14 결정 재료(`broadcast-feed-address-decision-2026-11-14.md`)에서 `music/first-listening.mp3`로 HEAD 200·Range 0–1023 → 206(1,024 bytes 수신)을 다시 실측했다. 같은 GitHub Pages 호스팅이라 이 섹션에도 그대로 적용된다. 최종 판정은 제출 시 Apple validation 몫이다.

## 아직 정해지지 않아 placeholder로 남긴 것 (지어내지 않음)

1. **피드 공개 이메일** — `PUBLIC_EMAIL_NOT_SET` 유지. 생성기는 이 값이 남아 있으면 최종 피드 생성을 거부한다.
2. **아트워크** — 1400×1400~3000×3000px 정사각 JPG/PNG, RGB, 투명 불가. 아직 만들지 않았다.
3. **카테고리·serial 여부** — 틀에는 Fiction > Drama, `itunes:type=serial`을 잠정으로 넣었다. 제출 전에 확인 1회로 닫는다.
4. **방송국 이름 영문 병기 여부** — 피드 타이틀은 「네줄이 방송국」 단독으로 뒀다.
5. **파일럿 공개 여부와 공개 날짜** — 판정 뒤에 정한다.

## 운영 규칙 (껍데기에서 이어받음)

- 회차 mp3를 내용만 교체하면 Spotify가 다시 가져가지 않는다 — 수정본은 **파일명을 바꿔** 올린다.
- GUID는 한 번 나간 회차에서 절대 바꾸지 않는다.
- 곡 단독 회차는 올리지 않는다 (Spotify 음악 정책) — 곡은 프로그램 안에 실어 보낸다.
