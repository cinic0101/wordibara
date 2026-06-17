# Privacy Notes

Wordibara v1 is designed as a local-first kids learning app.

## Current Privacy Posture

- No account creation
- No login
- No email, phone, birthday, school, or cloud child profile
- No backend sync
- No ads
- No third-party analytics
- No microphone features
- No open chatbot

## Local Data

The app stores learner data locally on the device:

- learner display name
- selected avatar id
- selected word pack
- word progress
- quiz attempts
- wrong-word review records

Native builds store this data in local SQLite through `expo-sqlite`. The web preview uses browser local storage as a development fallback.

## Network Behavior

V1 should not send child profile, progress, device identifier, or usage data to third parties.

Expo development tooling may use local network connections during development builds. That is a development workflow concern, not an app product feature.

## Future Changes

Any future backend, sync, purchase, AI, analytics, or account feature should be treated as a privacy-sensitive design change. Before adding one, update:

- this privacy document
- product spec non-goals
- parent/settings UX
- store-review privacy disclosures
- data retention and deletion behavior

Kids app privacy constraints should remain stricter than ordinary consumer app defaults.
