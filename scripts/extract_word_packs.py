#!/usr/bin/env python3
from __future__ import annotations

import hashlib
import json
import re
from dataclasses import dataclass
from pathlib import Path
from typing import Any

try:
    import pdfplumber
except ModuleNotFoundError as exc:
    raise SystemExit(
        "Missing dependency: pdfplumber. Run with `uv run --with pdfplumber "
        "--with xlrd python scripts/extract_word_packs.py`."
    ) from exc


ROOT = Path(__file__).resolve().parents[1]
OUT_DIR = ROOT / "packages" / "content" / "word-packs"
SOURCE_DIR = ROOT / "packages" / "content" / "source"
SOURCE_PACKS = [
    {
        "pack_id": "en-600",
        "title": "600-word scope",
        "source_type": "pdf",
        "source_path": ROOT / "en-600.pdf",
    },
    {
        "pack_id": "en-1500",
        "title": "1500-word scope",
        "source_type": "xls",
        "source_path": ROOT / "en-1500.xls",
        "sheet_name": "國中定案1500字",
        "supplemental_meanings": SOURCE_DIR / "en-1500-meanings.zh.json",
    },
]

COLUMN_CATEGORY_EN_MAX = 140
COLUMN_CATEGORY_ZH_MAX = 260
COLUMN_WORD_MAX = 380
COLUMN_MEANING_MAX = 505
ROW_CENTER_TOLERANCE = 4.5


@dataclass
class Topic:
    id: str
    name_en: str
    name_zh: str


TOPIC_ALIASES = {
    "family": "Family",
    "Places & locations": "Places & directions",
    "Pronouns & reflexives": "Pronouns",
}

TOPIC_ZH = {
    "Animals & insects": "動物/昆蟲",
    "Articles & determiners": "冠詞 / 限定詞",
    "Be & auxiliaries": "be 動詞 / 助動詞",
    "Clothing & accessories": "衣服 / 配件",
    "Colors": "顏色",
    "Conjunctions": "連接詞",
    "Countries and areas": "國家/地區",
    "Family": "家庭",
    "Food & drink": "食物/飲料",
    "Forms of address": "稱謂",
    "Geographical terms": "地理名詞",
    "Health": "健康",
    "Holidays & festivals": "節日 / 節慶",
    "Houses & apartments": "房子/公寓",
    "Interjections": "感嘆詞",
    "Money": "金錢",
    "Numbers": "數字",
    "Occupations": "工作",
    "Other adjectives": "其他形容詞",
    "Other adverbs": "其他副詞",
    "Other nouns": "其他名詞",
    "Other verbs": "其他動詞",
    "Parts of body": "身體部位",
    "People": "人",
    "Personal characteristics": "個性 / 特點",
    "Places & directions": "地點/方位",
    "Prepositions": "介系詞",
    "Pronouns": "代名詞",
    "School": "學校",
    "Sizes & measurements": "尺寸/計量",
    "Sports, interests & hobbies": "運動/興趣/嗜好",
    "Tableware": "餐具",
    "Time": "時間",
    "Transportation": "運輸",
    "Weather & nature": "天氣/自然",
    "Wh-words": "疑問詞",
}


def file_sha256(path: Path) -> str:
    digest = hashlib.sha256()
    with path.open("rb") as handle:
        for chunk in iter(lambda: handle.read(1024 * 1024), b""):
            digest.update(chunk)
    return digest.hexdigest()


def slugify(value: str) -> str:
    value = value.lower().replace("&", "and")
    value = re.sub(r"[^a-z0-9]+", "-", value)
    return value.strip("-")


def compact_cell(tokens: list[dict[str, Any]]) -> str:
    text = " ".join(token["text"] for token in sorted(tokens, key=lambda item: item["x0"]))
    text = text.replace(" ,", ",").replace("( =", "(=").replace("= ", "=")
    return re.sub(r"\s+", " ", text).strip()


def normalize_answer(text: str) -> str:
    text = text.casefold().strip()
    return re.sub(r"\s+", " ", text)


def answer_variants(text: str) -> list[str]:
    base = normalize_answer(text)
    variants = {base}
    if "-" in base:
        variants.add(base.replace("-", " "))
        variants.add(base.replace("-", ""))
    if "." in base:
        variants.add(base.replace(".", ""))
    return sorted(variant for variant in variants if variant)


def is_letter_game_eligible(text: str) -> bool:
    answer = normalize_answer(text)
    return bool(re.fullmatch(r"[a-z]{3,10}", answer))


def canonical_topic(source_topic_en: str, source_topic_zh: str | None = None) -> Topic:
    name_en = TOPIC_ALIASES.get(source_topic_en, source_topic_en)
    name_zh = TOPIC_ZH.get(name_en) or source_topic_zh
    if not name_zh:
        raise ValueError(f"Missing Chinese topic for {source_topic_en!r}")
    return Topic(id=slugify(name_en), name_en=name_en, name_zh=name_zh)


def make_entry(
    *,
    pack_id: str,
    order: int,
    text: str,
    meaning_zh: str,
    part_of_speech: str | None,
    topic: Topic,
    source: dict[str, Any],
    is_1200: bool | None = None,
) -> dict[str, Any]:
    return {
        "id": f"{pack_id}-{order:04d}-{slugify(text) or 'entry'}",
        "displayOrder": order,
        "text": text,
        "answerText": normalize_answer(text),
        "acceptedAnswers": answer_variants(text),
        "meaningZh": meaning_zh,
        "partOfSpeech": part_of_speech,
        "topic": {
            "id": topic.id,
            "nameEn": topic.name_en,
            "nameZh": topic.name_zh,
        },
        "source": source,
        "is1200": is_1200,
        "isMultiWord": " " in normalize_answer(text),
        "letterGameEligible": is_letter_game_eligible(text),
    }


def pack_from_entries(
    *,
    pack_id: str,
    title: str,
    source_type: str,
    source_path: Path,
    entries: list[dict[str, Any]],
) -> dict[str, Any]:
    unique_answers = {entry["answerText"] for entry in entries}
    topics = {entry["topic"]["id"]: entry["topic"] for entry in entries}
    return {
        "schemaVersion": 1,
        "packId": pack_id,
        "title": title,
        "sourceFile": source_path.name,
        "sourceType": source_type,
        "sourceSha256": file_sha256(source_path),
        "wordCount": len(entries),
        "uniqueAnswerCount": len(unique_answers),
        "topicCount": len(topics),
        "topics": list(topics.values()),
        "entries": entries,
    }


def group_words_by_row(words: list[dict[str, Any]]) -> list[list[dict[str, Any]]]:
    rows: list[dict[str, Any]] = []
    for word in sorted(words, key=lambda item: ((item["top"] + item["bottom"]) / 2, item["x0"])):
        center = (word["top"] + word["bottom"]) / 2
        matching_row = None
        for row in rows:
            if abs(center - row["center"]) <= ROW_CENTER_TOLERANCE:
                matching_row = row
                break
        if matching_row is None:
            rows.append({"center": center, "words": [word]})
        else:
            matching_row["words"].append(word)
            matching_row["center"] = (
                matching_row["center"] * (len(matching_row["words"]) - 1) + center
            ) / len(matching_row["words"])
    return [sorted(row["words"], key=lambda item: item["x0"]) for row in rows]


def split_row(row: list[dict[str, Any]]) -> dict[str, str]:
    cells = {
        "category_en": [],
        "category_zh": [],
        "word": [],
        "meaning_zh": [],
        "part_of_speech": [],
    }
    for token in row:
        x0 = token["x0"]
        if x0 < COLUMN_CATEGORY_EN_MAX:
            cells["category_en"].append(token)
        elif x0 < COLUMN_CATEGORY_ZH_MAX:
            cells["category_zh"].append(token)
        elif x0 < COLUMN_WORD_MAX:
            cells["word"].append(token)
        elif x0 < COLUMN_MEANING_MAX:
            cells["meaning_zh"].append(token)
        else:
            cells["part_of_speech"].append(token)
    return {key: compact_cell(value) for key, value in cells.items()}


def should_skip_row(cells: dict[str, str]) -> bool:
    all_text = " ".join(value for value in cells.values() if value)
    if not all_text:
        return True
    if all_text.startswith("「小學英檢」") or all_text.startswith("©"):
        return True
    if cells["word"] == "單字":
        return True
    return False


def extract_pdf_pack(pack_id: str, title: str, source_pdf: Path) -> dict[str, Any]:
    if not source_pdf.exists():
        raise FileNotFoundError(source_pdf)

    entries: list[dict[str, Any]] = []
    current_topic: Topic | None = None

    with pdfplumber.open(source_pdf) as pdf:
        for page_index, page in enumerate(pdf.pages, start=1):
            words = page.extract_words(
                use_text_flow=False,
                keep_blank_chars=False,
                extra_attrs=["size"],
            )
            for row in group_words_by_row(words):
                cells = split_row(row)
                if should_skip_row(cells):
                    continue

                if cells["category_en"] and cells["category_zh"] and not cells["word"]:
                    current_topic = canonical_topic(cells["category_en"], cells["category_zh"])
                    continue

                if not cells["word"] or not cells["meaning_zh"]:
                    continue
                if current_topic is None:
                    raise ValueError(
                        f"Found word before topic on page {page_index}: {cells['word']}"
                    )

                order = len(entries) + 1
                entries.append(
                    make_entry(
                        pack_id=pack_id,
                        order=order,
                        text=cells["word"],
                        meaning_zh=cells["meaning_zh"],
                        part_of_speech=cells["part_of_speech"] or None,
                        topic=current_topic,
                        source={
                            "type": "pdf",
                            "file": source_pdf.name,
                            "page": page_index,
                        },
                    )
                )

    return pack_from_entries(
        pack_id=pack_id,
        title=title,
        source_type="pdf",
        source_path=source_pdf,
        entries=entries,
    )


def load_supplemental_meanings(path: Path) -> dict[tuple[str, str], str]:
    data = json.loads(path.read_text(encoding="utf-8"))
    meanings: dict[tuple[str, str], str] = {}
    for source_topic_en, words in data["meanings"].items():
        for word, meaning_zh in words.items():
            meanings[(source_topic_en, word)] = meaning_zh
    return meanings


def reference_meaning_maps(reference_pack: dict[str, Any]) -> tuple[
    dict[str, set[str]],
    dict[tuple[str, str], set[str]],
]:
    by_word: dict[str, set[str]] = {}
    by_word_topic: dict[tuple[str, str], set[str]] = {}
    for entry in reference_pack["entries"]:
        answer = entry["answerText"]
        topic_en = entry["topic"]["nameEn"]
        by_word.setdefault(answer, set()).add(entry["meaningZh"])
        by_word_topic.setdefault((answer, topic_en), set()).add(entry["meaningZh"])
    return by_word, by_word_topic


def resolve_xls_meaning(
    *,
    word: str,
    source_topic_en: str,
    topic: Topic,
    supplemental_meanings: dict[tuple[str, str], str],
    reference_by_word: dict[str, set[str]],
    reference_by_word_topic: dict[tuple[str, str], set[str]],
) -> str:
    answer = normalize_answer(word)

    topic_matches = reference_by_word_topic.get((answer, topic.name_en), set())
    if len(topic_matches) == 1:
        return next(iter(topic_matches))

    word_matches = reference_by_word.get(answer, set())
    if len(word_matches) == 1:
        return next(iter(word_matches))

    supplemental = supplemental_meanings.get((source_topic_en, word))
    if supplemental:
        return supplemental

    raise ValueError(
        f"Missing meaning for {word!r} in source topic {source_topic_en!r}; "
        "add it to packages/content/source/en-1500-meanings.zh.json"
    )


def extract_xls_pack(
    *,
    pack_id: str,
    title: str,
    source_xls: Path,
    sheet_name: str,
    supplemental_meanings_path: Path,
    reference_pack: dict[str, Any],
) -> dict[str, Any]:
    try:
        import xlrd
    except ModuleNotFoundError as exc:
        raise SystemExit(
            "Missing dependency: xlrd. Run with `uv run --with pdfplumber "
            "--with xlrd python scripts/extract_word_packs.py`."
        ) from exc

    if not source_xls.exists():
        raise FileNotFoundError(source_xls)

    supplemental_meanings = load_supplemental_meanings(supplemental_meanings_path)
    reference_by_word, reference_by_word_topic = reference_meaning_maps(reference_pack)

    workbook = xlrd.open_workbook(source_xls)
    sheet = workbook.sheet_by_name(sheet_name)
    entries: list[dict[str, Any]] = []

    for row_index in range(2, sheet.nrows):
        word = str(sheet.cell_value(row_index, 0)).strip()
        if not word:
            continue

        is_1200_value = sheet.cell_value(row_index, 1)
        source_topic_en = str(sheet.cell_value(row_index, 2)).strip()
        topic = canonical_topic(source_topic_en)
        meaning_zh = resolve_xls_meaning(
            word=word,
            source_topic_en=source_topic_en,
            topic=topic,
            supplemental_meanings=supplemental_meanings,
            reference_by_word=reference_by_word,
            reference_by_word_topic=reference_by_word_topic,
        )

        order = len(entries) + 1
        entries.append(
            make_entry(
                pack_id=pack_id,
                order=order,
                text=word,
                meaning_zh=meaning_zh,
                part_of_speech=None,
                topic=topic,
                source={
                    "type": "xls",
                    "file": source_xls.name,
                    "sheet": sheet_name,
                    "row": row_index + 1,
                    "topicEn": source_topic_en,
                },
                is_1200=bool(is_1200_value),
            )
        )

    return pack_from_entries(
        pack_id=pack_id,
        title=title,
        source_type="xls",
        source_path=source_xls,
        entries=entries,
    )


def write_json(path: Path, data: Any) -> None:
    path.write_text(
        json.dumps(data, ensure_ascii=False, indent=2) + "\n",
        encoding="utf-8",
    )


def validate_source_files() -> None:
    missing = [
        source_pack["source_path"].name
        for source_pack in SOURCE_PACKS
        if not source_pack["source_path"].exists()
    ]
    if missing:
        missing_list = ", ".join(missing)
        raise SystemExit(
            "Missing local source file(s): "
            f"{missing_list}. The generated JSON packs are committed, but "
            "regeneration requires placing these raw source files at the repo root."
        )


def main() -> int:
    validate_source_files()
    OUT_DIR.mkdir(parents=True, exist_ok=True)
    packs: list[dict[str, Any]] = []
    pack_by_id: dict[str, dict[str, Any]] = {}
    for source_pack in SOURCE_PACKS:
        if source_pack["source_type"] == "pdf":
            pack = extract_pdf_pack(
                source_pack["pack_id"],
                source_pack["title"],
                source_pack["source_path"],
            )
        elif source_pack["source_type"] == "xls":
            pack = extract_xls_pack(
                pack_id=source_pack["pack_id"],
                title=source_pack["title"],
                source_xls=source_pack["source_path"],
                sheet_name=source_pack["sheet_name"],
                supplemental_meanings_path=source_pack["supplemental_meanings"],
                reference_pack=pack_by_id["en-600"],
            )
        else:
            raise ValueError(f"Unsupported source type: {source_pack['source_type']}")
        packs.append(pack)
        pack_by_id[pack["packId"]] = pack

    for pack in packs:
        write_json(OUT_DIR / f"{pack['packId']}.json", pack)

    manifest = {
        "schemaVersion": 1,
        "packs": [
            {
                "packId": pack["packId"],
                "title": pack["title"],
                "sourceFile": pack["sourceFile"],
                "sourceType": pack["sourceType"],
                "sourceSha256": pack["sourceSha256"],
                "wordCount": pack["wordCount"],
                "uniqueAnswerCount": pack["uniqueAnswerCount"],
                "topicCount": pack["topicCount"],
            }
            for pack in packs
        ],
        "sourceWarnings": [],
    }
    write_json(OUT_DIR / "content-manifest.json", manifest)

    for pack in packs:
        print(
            f"{pack['packId']}: {pack['wordCount']} entries, "
            f"{pack['uniqueAnswerCount']} unique answers, {pack['topicCount']} topics"
        )
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
