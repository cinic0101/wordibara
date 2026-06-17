# Wordibara Word Packs

This folder contains generated JSON word packs extracted from source files in the repo root.

Regenerate with:

```sh
uv run --with pdfplumber --with xlrd python scripts/extract_word_packs.py
```

Generated files:

- `en-600.json`
- `en-1500.json`
- `content-manifest.json`

Current extraction result:

- `en-600`: 685 entries, 657 unique answers, 35 topics
- `en-1500`: 1500 entries, 1497 unique answers, 36 topics

Sources:

- `en-600.json` comes from `en-600.pdf`
- `en-1500.json` comes from `en-1500.xls`
- `en-1500.xls` does not include Chinese meanings, so missing meanings come from `packages/content/source/en-1500-meanings.zh.json`

The app should seed SQLite from these JSON files. Do not edit generated JSON by hand unless documenting a source-data correction.
