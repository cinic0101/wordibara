# Wordibara Word Packs

This folder contains generated JSON word packs used by the app at runtime.

Raw source files are not committed. To regenerate these files, place `en-600.pdf` and `en-1500.xls` at the repo root locally, then run:

```sh
npm run extract:words
```

Generated files:

- `en-600.json`
- `en-1500.json`
- `content-manifest.json`

Current extraction result:

- `en-600`: 685 entries, 657 unique answers, 35 topics
- `en-1500`: 1500 entries, 1497 unique answers, 36 topics

Sources:

- `en-600.json` was generated from `en-600.pdf`
- `en-1500.json` was generated from `en-1500.xls`
- `en-1500.xls` does not include Chinese meanings, so missing meanings come from `packages/content/source/en-1500-meanings.zh.json`

The native app seeds SQLite from these JSON files. The web preview imports the same generated packs and stores learner progress in browser local storage.

Do not edit generated JSON by hand unless documenting a source-data correction.

Before publishing or redistributing this repository, verify redistribution rights for the source vocabulary material and derived generated JSON.
