# Contributing

Thanks for helping improve Wordibara.

## Project Priorities

V1 is a local-first kids vocabulary app. Contributions should preserve:

- no backend child profile upload
- no login requirement
- no ads
- no third-party analytics
- no microphone features
- no open chatbot
- readable learning UI on phone-sized screens

## Setup

```sh
npm install
npm run typecheck
```

See [docs/development.md](docs/development.md) for Android emulator and real-device setup.

## Development Workflow

1. Create a focused branch.
2. Keep changes scoped to one behavior or document area.
3. Follow the existing Expo Router and React Native patterns.
4. Run focused checks before opening a PR.
5. Include screenshots or short recordings for meaningful UI changes.

Useful commands:

```sh
npm run typecheck
npm run mobile:web
make android
make android-release
```

## Commit Style

Use concise conventional-style commit messages:

```txt
feat: add review queue filter
fix: keep landing mascot within safe area
docs: clarify android device install workflow
chore: update generated content docs
```

## Content Changes

Generated word packs live under `packages/content/word-packs/`.

Do not edit generated JSON by hand unless documenting a deliberate source-data correction. Prefer updating `scripts/extract_word_packs.py` or the supplemental source data, then regenerating.

Do not submit vocabulary or media content unless redistribution rights are clear.

## UI Changes

- Respect safe areas and small phone screens.
- Avoid overlapping text and controls.
- Keep game controls reachable and predictable.
- Use the existing mascot, button, card, and color language unless changing the design system intentionally.

## Privacy Review

Any change that adds networking, persistence, identifiers, telemetry, accounts, purchases, AI services, or external links needs explicit privacy review. Update [docs/privacy.md](docs/privacy.md) in the same PR.
