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

Open on a running Android emulator, such as Pixel 9:

```sh
npm run mobile:android
# or
make android
```

That starts Expo and opens the app through Expo Go, which is the fastest v1 workflow.

If you do not want the Expo Go launcher/debug pages, install Wordibara directly on the emulator:

```sh
npm run mobile:android:dev
# or
make android-dev
```

Use this native debug build when you want the emulator to open the Wordibara app directly. It may generate native Android project files.

For a production-like local Android install:

```sh
npm run mobile:android:release
# or
make android-release
```

The root Android scripts auto-detect the Android SDK at `$HOME/Library/Android/sdk` when `ANDROID_HOME` is not set, and write `apps/mobile/android/local.properties` for local Gradle builds when the generated native folder exists.

If Expo opens a development-client URL after install, launch the installed app directly:

```sh
make android-launch
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
