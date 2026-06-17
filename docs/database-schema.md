# Wordibara Local Database Schema

V1 should use SQLite through `expo-sqlite`. Seed data comes from `packages/content/word-packs/*.json`.

## Tables

```sql
CREATE TABLE profiles (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  avatar_id TEXT NOT NULL,
  selected_pack_id TEXT,
  created_at TEXT NOT NULL,
  updated_at TEXT NOT NULL
);

CREATE TABLE word_packs (
  id TEXT PRIMARY KEY,
  title TEXT NOT NULL,
  source_file TEXT NOT NULL,
  source_type TEXT NOT NULL,
  source_sha256 TEXT NOT NULL,
  word_count INTEGER NOT NULL,
  unique_answer_count INTEGER NOT NULL,
  topic_count INTEGER NOT NULL,
  installed_at TEXT NOT NULL
);

CREATE TABLE topics (
  id TEXT NOT NULL,
  pack_id TEXT NOT NULL,
  name_en TEXT NOT NULL,
  name_zh TEXT NOT NULL,
  PRIMARY KEY (pack_id, id),
  FOREIGN KEY (pack_id) REFERENCES word_packs(id)
);

CREATE TABLE words (
  id TEXT PRIMARY KEY,
  pack_id TEXT NOT NULL,
  topic_id TEXT NOT NULL,
  display_order INTEGER NOT NULL,
  text TEXT NOT NULL,
  answer_text TEXT NOT NULL,
  accepted_answers_json TEXT NOT NULL,
  meaning_zh TEXT NOT NULL,
  part_of_speech TEXT,
  source_type TEXT NOT NULL,
  source_file TEXT NOT NULL,
  source_page INTEGER,
  source_sheet TEXT,
  source_row INTEGER,
  source_topic_en TEXT,
  is_1200 INTEGER,
  is_multi_word INTEGER NOT NULL,
  letter_game_eligible INTEGER NOT NULL,
  FOREIGN KEY (pack_id) REFERENCES word_packs(id),
  FOREIGN KEY (pack_id, topic_id) REFERENCES topics(pack_id, id)
);

CREATE INDEX idx_words_pack_order ON words(pack_id, display_order);
CREATE INDEX idx_words_pack_topic ON words(pack_id, topic_id);
CREATE INDEX idx_words_answer_text ON words(pack_id, answer_text);
CREATE INDEX idx_words_letter_game ON words(pack_id, letter_game_eligible);

CREATE TABLE progress (
  profile_id TEXT NOT NULL,
  word_id TEXT NOT NULL,
  status TEXT NOT NULL DEFAULT 'new',
  correct_count INTEGER NOT NULL DEFAULT 0,
  wrong_count INTEGER NOT NULL DEFAULT 0,
  current_streak INTEGER NOT NULL DEFAULT 0,
  mastery_score INTEGER NOT NULL DEFAULT 0,
  last_seen_at TEXT,
  next_review_at TEXT,
  PRIMARY KEY (profile_id, word_id),
  FOREIGN KEY (profile_id) REFERENCES profiles(id),
  FOREIGN KEY (word_id) REFERENCES words(id)
);

CREATE INDEX idx_progress_review ON progress(profile_id, next_review_at, wrong_count);

CREATE TABLE quiz_attempts (
  id TEXT PRIMARY KEY,
  profile_id TEXT NOT NULL,
  word_id TEXT NOT NULL,
  game_type TEXT NOT NULL,
  prompt_text TEXT NOT NULL,
  submitted_answer TEXT,
  correct_answer TEXT NOT NULL,
  is_correct INTEGER NOT NULL,
  created_at TEXT NOT NULL,
  FOREIGN KEY (profile_id) REFERENCES profiles(id),
  FOREIGN KEY (word_id) REFERENCES words(id)
);

CREATE INDEX idx_quiz_attempts_profile_time ON quiz_attempts(profile_id, created_at);
CREATE INDEX idx_quiz_attempts_word ON quiz_attempts(profile_id, word_id);

CREATE TABLE wrong_word_logs (
  id TEXT PRIMARY KEY,
  profile_id TEXT NOT NULL,
  word_id TEXT NOT NULL,
  game_type TEXT NOT NULL,
  submitted_answer TEXT,
  correct_answer TEXT NOT NULL,
  created_at TEXT NOT NULL,
  reviewed_at TEXT,
  FOREIGN KEY (profile_id) REFERENCES profiles(id),
  FOREIGN KEY (word_id) REFERENCES words(id)
);

CREATE INDEX idx_wrong_word_logs_review ON wrong_word_logs(profile_id, reviewed_at, created_at);
```

## Status Values

`progress.status`:

- `new`
- `practicing`
- `review`
- `learned`

## Important Modeling Decision

Progress is keyed by `word_id`, not English text. The source data contains repeated answer strings with different meanings or topics, so `fish` can appear as separate learning entries.

## Content Sources

- Runtime content comes from committed generated JSON under `packages/content/word-packs/`.
- `en-600` was generated from `en-600.pdf`; source location is `source_page`.
- `en-1500` was generated from `en-1500.xls`; source location is `source_sheet` and `source_row`.
- `en-1500.xls` has an `是否1200字` flag, stored as `is_1200`.
- Both packs should have non-null `meaning_zh` in the generated JSON before seeding SQLite.
