# Wordibara Agent Guide

Wordibara is a local-first kids English vocabulary app. The first version should be simple, playful, and privacy-safe: no backend, no login, no ads, no third-party analytics, no microphone, and no child profile upload.

## Current Project Shape

```txt
wordibara/
  apps/
    mobile/
  scripts/
    extract_word_packs.py
  packages/
    content/
      source/
        en-1500-meanings.zh.json
      word-packs/
        content-manifest.json
        en-600.json
        en-1500.json
  docs/
    product-spec.md
    database-schema.md
    wireframes.md
```

Add `packages/ui/` only after there is real shared UI pressure.

## Planned Stack

- Expo + React Native + TypeScript
- Expo Router
- expo-sqlite for local persistence
- Zustand for lightweight app state
- react-native-reanimated and react-native-gesture-handler for game feel
- expo-speech for pronunciation
- expo-audio for short sound effects
- Jest + React Native Testing Library for core logic and component checks

Do not add a backend for v1.

## Content Workflow

Generated word-pack JSON is committed under `packages/content/word-packs/` and used by the app at runtime.

The 600 scope was generated from `en-600.pdf`. The 1500 scope was generated from `en-1500.xls` and supplemented with Traditional Chinese meanings from `packages/content/source/en-1500-meanings.zh.json`.

Raw source files are not committed. To regenerate content, place `en-600.pdf` and `en-1500.xls` at the repo root locally, then run:

```sh
uv run --with pdfplumber --with xlrd python scripts/extract_word_packs.py
```

Current generated packs:

- `en-600`: 685 entries, 657 unique answer strings, 35 topics
- `en-1500`: 1500 entries, 1497 unique answer strings, 36 canonical topics

Keep duplicate English answers as separate entries when the Chinese meaning or topic differs. Progress must key by `word_id`, not by answer text.

## Product Rules

- Profile creation asks only for a cute avatar and display name.
- Profile selection must work offline.
- Scope selection chooses one local word pack.
- Game 1 shows Chinese meaning and asks the child to type the English answer.
- Game 2 is a word-pattern alphabet game, for example `g__d`; use only `letterGameEligible` entries.
- Wrong answers are logged for review.
- Review should prioritize wrong words and recently missed words.
- Use playful animation and sound, but make the learning task clear and readable.

## Privacy Rules

- Store child data locally in SQLite only.
- Do not send profile, progress, device identifier, or usage data to third parties.
- Do not add ads or analytics SDKs.
- Keep parent/legal/settings content behind a parental gate if external links, purchases, or destructive actions are added later.

## Implementation Expectations

- Keep TypeScript strict.
- Put reusable game logic in `packages/core` and test it there.
- Keep app screens thin: navigation and UI in `apps/mobile`, learning rules in core.
- Do not hard-code word lists inside components. Load from generated content JSON and seed SQLite.
- Prefer simple, explicit data migrations over implicit runtime mutation.
- Before changing generated word-pack JSON, update the extractor first unless the change is a documented manual source-data correction.
