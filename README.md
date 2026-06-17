# Wordibara

A playful kids' English vocabulary app.

## Current Status

This repo contains the first Expo mobile app implementation with local profiles, word-scope selection, two vocabulary games, review, and collection screens.

Start here:

- [Product spec](docs/product-spec.md)
- [Database schema](docs/database-schema.md)
- [Wireframes](docs/wireframes.md)
- [Agent guide](AGENTS.md)
- [Word-pack data](packages/content/word-packs/README.md)

## Run The App

Install dependencies:

```sh
npm install
```

Start the mobile app:

```sh
npm run mobile
```

Start the web preview:

```sh
npm run mobile:web
```

## Word Packs

Generated JSON packs are committed under `packages/content/word-packs/` and are what the app uses at runtime.

Raw source files are not committed. To regenerate JSON packs, place these files at the repo root locally:

- `en-600.pdf`
- `en-1500.xls`

Then run:

```sh
uv run --with pdfplumber --with xlrd python scripts/extract_word_packs.py
```

Current packs:

- `en-600`: 685 entries generated from `en-600.pdf`
- `en-1500`: 1500 entries generated from `en-1500.xls`

The 1500 Excel source does not include Chinese meanings, so missing meanings are supplied by `packages/content/source/en-1500-meanings.zh.json`.
