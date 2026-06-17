# Security Policy

## Supported Versions

Wordibara is in early v1 development. Security fixes should target the current `dev` branch unless the project later introduces release branches.

## Reporting A Vulnerability

If GitHub private vulnerability reporting is enabled for this repository, use it.

If not, open a minimal public issue that says you have a security concern and avoid posting exploit details, secrets, child data, or device identifiers publicly.

## Scope

Security and privacy-sensitive reports include:

- child profile or progress data exposure
- unexpected network transmission
- unsafe local storage behavior
- dependency vulnerabilities with a practical app impact
- Android package/signing/install issues that affect user safety

## Out Of Scope

- Issues requiring rooted or jailbroken devices unless they expose a broader app flaw
- Denial-of-service against local development tooling
- Vulnerabilities already covered by upstream Expo/React Native advisories without Wordibara-specific impact

## Privacy Priority

Because this is a kids learning app, privacy-impacting bugs should be treated with the same urgency as security bugs.
