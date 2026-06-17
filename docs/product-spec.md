# Wordibara Product Spec

## Goal

Wordibara helps kids learn English vocabulary through short, repeatable games using Chinese prompts, cute avatars, and lightweight reward animation.

V1 is local-first. It should work without account creation, internet, backend sync, ads, analytics, microphone, or AI chat.

## Users

- Child learner: chooses a profile, plays short vocabulary games, reviews wrong words.
- Parent/helper: can create/select a child profile and choose the word scope.

## V1 Feature Set

### Profile

The app starts with profile selection.

- Existing child profiles appear as avatar cards.
- New profile requires only:
  - avatar selection
  - display name
- No email, phone, password, birthday, school, or cloud account.

### Word Scope

The child or parent chooses one local word scope:

- 600-word scope: 685 entries from `packages/content/word-packs/en-600.json`
- 1500-word scope: 1500 entries from `packages/content/word-packs/en-1500.json`

The 1500 scope comes from `en-1500.xls`. Its Chinese meanings are filled through the supplemental source file at `packages/content/source/en-1500-meanings.zh.json`.

### Home

Home should show:

- selected avatar and name
- selected scope
- today progress
- wrong-word review count
- two main game buttons
- collection/reward area

### Game 1: Chinese to English Typing

Prompt:

- show Chinese meaning
- optionally show topic and part of speech
- child types the English word or phrase

Check:

- compare against `acceptedAnswers`
- case-insensitive
- allow generated variants for punctuation, such as `Mr.` and `mr`
- for hyphenated words, accept hyphen, space, and compact variants

Result:

- correct: increment correct count and streak
- wrong: increment wrong count, log the attempt, add to review queue
- always reveal the correct answer after a wrong attempt

### Game 2: Word Pattern Alphabet Game

Prompt:

- use `letterGameEligible` entries only
- show Chinese meaning
- show a masked English pattern, for example `g__d`
- child chooses letters from an alphabet board

Eligibility:

- single English word only
- letters `a-z` only
- length 3 to 10
- exclude phrases, punctuation, hyphens, abbreviations, and very short words

Suggested rules:

- 3-5 letters: 5 wrong-letter chances
- 6-8 letters: 6 wrong-letter chances
- 9-10 letters: 7 wrong-letter chances
- reveal one random hidden letter after two wrong guesses
- bonus star if solved with zero wrong guesses
- wrong completion logs the word for review

### Wrong Word Review

Review queue includes:

- words answered incorrectly
- words with low mastery
- words due by `next_review_at`

Review should prefer the missed meaning/topic entry, not just the answer string. For example, `fish` as animal and `fish` as food can be separate learning cards.

### Rewards and Animation

Use cute and cool effects around learning events:

- avatar idle animation on home
- correct answer sparkle/pop
- wrong answer gentle shake
- word-card flip reveal
- progress meter fill
- creature/collection unlock after streak or milestone

Keep animations short and skippable through normal interaction. Learning text must remain readable.

## Non-Goals For V1

- backend sync
- parent accounts
- subscriptions or purchases
- third-party analytics
- advertising
- open chatbot
- microphone features
- dynamically generated word packs
