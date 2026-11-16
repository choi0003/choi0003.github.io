#!/usr/bin/env python3
"""네줄이 방송국 피드 생성기.

episodes.json -> feed.xml (이 폴더가 곧 사이트 루트다)
- GUID는 회차 id에서 uuid5로 고정 생성한다 (다시 돌려도 바뀌지 않음).
- 공개 이메일 등 placeholder(PUBLIC_EMAIL_NOT_SET)가 남아 있으면 생성을 거부한다.
- enclosure length는 이 폴더 아래 실제 파일 크기에서 읽는다. 파일이 없으면 거부한다.
- 판정 대기 회차(_pending_... 키)는 읽지 않는다. 공개가 결정된 회차만 episodes 배열에 넣는다.
사용: 이 폴더에서 python3 build_feed.py [--episodes episodes.json] [--site-dir .]
"""
import argparse
import json
import sys
import uuid
import xml.etree.ElementTree as ET
from email.utils import format_datetime
from datetime import datetime
from pathlib import Path

PLACEHOLDERS = ("PUBLIC_EMAIL_NOT_SET", "NOT_SET")
GUID_NS = uuid.UUID("6ba7b810-9dad-11d1-80b4-00c04fd430c8")  # URL namespace


def fail(msg):
    print(f"거부: {msg}", file=sys.stderr)
    sys.exit(1)


def check_placeholders(obj, path=""):
    if isinstance(obj, str):
        for p in PLACEHOLDERS:
            if p in obj:
                fail(f"placeholder가 남아 있음: {path} = {obj!r} — 선생님 결정 뒤 실제 값으로 바꾼 뒤 다시 실행")
    elif isinstance(obj, dict):
        for k, v in obj.items():
            if not k.startswith("_"):
                check_placeholders(v, f"{path}.{k}")
    elif isinstance(obj, list):
        for i, v in enumerate(obj):
            check_placeholders(v, f"{path}[{i}]")


def main():
    ap = argparse.ArgumentParser()
    ap.add_argument("--episodes", default="episodes.json")
    ap.add_argument("--site-dir", default=".")
    args = ap.parse_args()

    data = json.loads(Path(args.episodes).read_text(encoding="utf-8"))
    ch = data["channel"]
    episodes = data.get("episodes", [])
    check_placeholders(ch)
    check_placeholders(episodes)
    if not episodes:
        fail("회차가 0개다 — 제출용 피드에는 회차 최소 1개가 필요하다. 껍데기 상태에서는 이 거부가 정상이다.")

    site = Path(args.site_dir)
    ET.register_namespace("itunes", "http://www.itunes.com/dtds/podcast-1.0.dtd")
    ET.register_namespace("atom", "http://www.w3.org/2005/Atom")
    IT = "{http://www.itunes.com/dtds/podcast-1.0.dtd}"
    AT = "{http://www.w3.org/2005/Atom}"

    rss = ET.Element("rss", {"version": "2.0"})
    channel = ET.SubElement(rss, "channel")
    def add(parent, tag, text):
        el = ET.SubElement(parent, tag); el.text = text; return el
    add(channel, "title", ch["title"])
    add(channel, "link", ch["site_url"])
    ET.SubElement(channel, f"{AT}link", {"href": ch["feed_url"], "rel": "self", "type": "application/rss+xml"})
    add(channel, "description", ch["description"])
    add(channel, "language", ch["language"])
    add(channel, f"{IT}author", ch["author"])
    add(channel, f"{IT}explicit", ch["explicit"])
    add(channel, f"{IT}type", ch.get("type", "episodic"))
    cat = ET.SubElement(channel, f"{IT}category", {"text": ch["category"]})
    if ch.get("subcategory"):
        ET.SubElement(cat, f"{IT}category", {"text": ch["subcategory"]})
    ET.SubElement(channel, f"{IT}image", {"href": ch["image_url"]})
    owner = ET.SubElement(channel, f"{IT}owner")
    add(owner, f"{IT}name", ch["owner_name"])
    add(owner, f"{IT}email", ch["owner_email"])
    add(channel, "managingEditor", ch["owner_email"])

    for ep in episodes:
        fpath = site / ep["file"]
        if not fpath.exists():
            fail(f"회차 파일이 없음: {fpath}")
        item = ET.SubElement(channel, "item")
        add(item, "title", ep["title"])
        add(item, "description", ep["description"])
        guid = uuid.uuid5(GUID_NS, f"{ch['feed_url']}#{ep['id']}")
        g = add(item, "guid", str(guid)); g.set("isPermaLink", "false")
        dt = datetime.fromisoformat(ep["pub_date"])
        add(item, "pubDate", format_datetime(dt))
        ET.SubElement(item, "enclosure", {
            "url": ch["site_url"].rstrip("/") + "/" + ep["file"],
            "length": str(fpath.stat().st_size),
            "type": "audio/mpeg",
        })
        add(item, f"{IT}duration", str(ep["duration_seconds"]))
        add(item, f"{IT}explicit", ep.get("explicit", "no"))
        if ep.get("episode_number"):
            add(item, f"{IT}episode", str(ep["episode_number"]))

    out = site / "feed.xml"
    ET.ElementTree(rss).write(out, encoding="utf-8", xml_declaration=True)
    print(f"생성 완료: {out} (회차 {len(episodes)}개)")


if __name__ == "__main__":
    main()
