import * as SQLite from "expo-sqlite";
import { Platform } from "react-native";
import { WORD_PACKS } from "./content";
import type { AnswerResult, Profile, WordProgress } from "@/types/app";
import type { PackId } from "@/types/content";

type SettingRow = { value: string };
type ProfileRow = {
  id: string;
  name: string;
  avatar_id: string;
  selected_pack_id: PackId | null;
  created_at: string;
  updated_at: string;
};
type ProgressRow = {
  word_id: string;
  status: WordProgress["status"];
  correct_count: number;
  wrong_count: number;
  current_streak: number;
  mastery_score: number;
  last_seen_at: string | null;
  next_review_at: string | null;
};

let dbPromise: Promise<SQLite.SQLiteDatabase> | null = null;
const WEB_STATE_KEY = "wordibara-web-state-v1";

type WebState = {
  settings: Record<string, string>;
  profiles: Profile[];
  progress: Record<string, Record<string, WordProgress>>;
};

function emptyWebState(): WebState {
  return { settings: {}, profiles: [], progress: {} };
}

function readWebState(): WebState {
  if (typeof window === "undefined") return emptyWebState();
  const raw = window.localStorage.getItem(WEB_STATE_KEY);
  if (!raw) return emptyWebState();
  try {
    return JSON.parse(raw) as WebState;
  } catch {
    return emptyWebState();
  }
}

function writeWebState(state: WebState): void {
  if (typeof window === "undefined") return;
  window.localStorage.setItem(WEB_STATE_KEY, JSON.stringify(state));
}

function nowIso() {
  return new Date().toISOString();
}

function toProfile(row: ProfileRow): Profile {
  return {
    id: row.id,
    name: row.name,
    avatarId: row.avatar_id,
    selectedPackId: row.selected_pack_id,
    createdAt: row.created_at,
    updatedAt: row.updated_at
  };
}

function toProgress(row: ProgressRow): WordProgress {
  return {
    wordId: row.word_id,
    status: row.status,
    correctCount: row.correct_count,
    wrongCount: row.wrong_count,
    currentStreak: row.current_streak,
    masteryScore: row.mastery_score,
    lastSeenAt: row.last_seen_at,
    nextReviewAt: row.next_review_at
  };
}

export async function getDb() {
  dbPromise ??= SQLite.openDatabaseAsync("wordibara.db");
  return dbPromise;
}

export async function initDatabase() {
  if (Platform.OS === "web") return;
  const db = await getDb();
  await db.execAsync(`
    PRAGMA journal_mode = WAL;

    CREATE TABLE IF NOT EXISTS settings (
      key TEXT PRIMARY KEY,
      value TEXT NOT NULL
    );

    CREATE TABLE IF NOT EXISTS profiles (
      id TEXT PRIMARY KEY,
      name TEXT NOT NULL,
      avatar_id TEXT NOT NULL,
      selected_pack_id TEXT,
      created_at TEXT NOT NULL,
      updated_at TEXT NOT NULL
    );

    CREATE TABLE IF NOT EXISTS word_packs (
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

    CREATE TABLE IF NOT EXISTS topics (
      id TEXT NOT NULL,
      pack_id TEXT NOT NULL,
      name_en TEXT NOT NULL,
      name_zh TEXT NOT NULL,
      PRIMARY KEY (pack_id, id)
    );

    CREATE TABLE IF NOT EXISTS words (
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
      letter_game_eligible INTEGER NOT NULL
    );

    CREATE INDEX IF NOT EXISTS idx_words_pack_order ON words(pack_id, display_order);
    CREATE INDEX IF NOT EXISTS idx_words_letter_game ON words(pack_id, letter_game_eligible);

    CREATE TABLE IF NOT EXISTS progress (
      profile_id TEXT NOT NULL,
      word_id TEXT NOT NULL,
      status TEXT NOT NULL DEFAULT 'new',
      correct_count INTEGER NOT NULL DEFAULT 0,
      wrong_count INTEGER NOT NULL DEFAULT 0,
      current_streak INTEGER NOT NULL DEFAULT 0,
      mastery_score INTEGER NOT NULL DEFAULT 0,
      last_seen_at TEXT,
      next_review_at TEXT,
      PRIMARY KEY (profile_id, word_id)
    );

    CREATE INDEX IF NOT EXISTS idx_progress_review ON progress(profile_id, next_review_at, wrong_count);

    CREATE TABLE IF NOT EXISTS quiz_attempts (
      id TEXT PRIMARY KEY,
      profile_id TEXT NOT NULL,
      word_id TEXT NOT NULL,
      game_type TEXT NOT NULL,
      prompt_text TEXT NOT NULL,
      submitted_answer TEXT,
      correct_answer TEXT NOT NULL,
      is_correct INTEGER NOT NULL,
      created_at TEXT NOT NULL
    );

    CREATE TABLE IF NOT EXISTS wrong_word_logs (
      id TEXT PRIMARY KEY,
      profile_id TEXT NOT NULL,
      word_id TEXT NOT NULL,
      game_type TEXT NOT NULL,
      submitted_answer TEXT,
      correct_answer TEXT NOT NULL,
      created_at TEXT NOT NULL,
      reviewed_at TEXT
    );
  `);
  await seedContent(db);
}

async function seedContent(db: SQLite.SQLiteDatabase) {
  for (const pack of WORD_PACKS) {
    const existing = await db.getFirstAsync<{ id: string; source_sha256: string }>(
      "SELECT id, source_sha256 FROM word_packs WHERE id = ?",
      pack.packId
    );
    if (existing?.source_sha256 === pack.sourceSha256) continue;

    await db.runAsync("DELETE FROM words WHERE pack_id = ?", pack.packId);
    await db.runAsync("DELETE FROM topics WHERE pack_id = ?", pack.packId);
    await db.runAsync("DELETE FROM word_packs WHERE id = ?", pack.packId);
    await db.runAsync(
      `INSERT INTO word_packs
        (id, title, source_file, source_type, source_sha256, word_count, unique_answer_count, topic_count, installed_at)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      pack.packId,
      pack.title,
      pack.sourceFile,
      pack.sourceType,
      pack.sourceSha256,
      pack.wordCount,
      pack.uniqueAnswerCount,
      pack.topicCount,
      nowIso()
    );

    for (const topic of pack.topics) {
      await db.runAsync(
        "INSERT OR REPLACE INTO topics (id, pack_id, name_en, name_zh) VALUES (?, ?, ?, ?)",
        topic.id,
        pack.packId,
        topic.nameEn,
        topic.nameZh
      );
    }

    for (const word of pack.entries) {
      await db.runAsync(
        `INSERT OR REPLACE INTO words
          (id, pack_id, topic_id, display_order, text, answer_text, accepted_answers_json,
           meaning_zh, part_of_speech, source_type, source_file, source_page, source_sheet,
           source_row, source_topic_en, is_1200, is_multi_word, letter_game_eligible)
         VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
        word.id,
        pack.packId,
        word.topic.id,
        word.displayOrder,
        word.text,
        word.answerText,
        JSON.stringify(word.acceptedAnswers),
        word.meaningZh,
        word.partOfSpeech,
        word.source.type,
        word.source.file,
        word.source.page ?? null,
        word.source.sheet ?? null,
        word.source.row ?? null,
        word.source.topicEn ?? null,
        word.is1200 == null ? null : Number(word.is1200),
        Number(word.isMultiWord),
        Number(word.letterGameEligible)
      );
    }
  }
}

export async function loadProfiles(): Promise<Profile[]> {
  if (Platform.OS === "web") return readWebState().profiles;
  const db = await getDb();
  const rows = await db.getAllAsync<ProfileRow>("SELECT * FROM profiles ORDER BY created_at ASC");
  return rows.map(toProfile);
}

export async function getSetting(key: string): Promise<string | null> {
  if (Platform.OS === "web") return readWebState().settings[key] ?? null;
  const db = await getDb();
  const row = await db.getFirstAsync<SettingRow>("SELECT value FROM settings WHERE key = ?", key);
  return row?.value ?? null;
}

export async function setSetting(key: string, value: string): Promise<void> {
  if (Platform.OS === "web") {
    const state = readWebState();
    state.settings[key] = value;
    writeWebState(state);
    return;
  }
  const db = await getDb();
  await db.runAsync("INSERT OR REPLACE INTO settings (key, value) VALUES (?, ?)", key, value);
}

export async function upsertProfile(profile: Profile): Promise<void> {
  if (Platform.OS === "web") {
    const state = readWebState();
    const existingIndex = state.profiles.findIndex((item) => item.id === profile.id);
    if (existingIndex >= 0) {
      state.profiles[existingIndex] = profile;
    } else {
      state.profiles.push(profile);
    }
    writeWebState(state);
    return;
  }
  const db = await getDb();
  await db.runAsync(
    `INSERT OR REPLACE INTO profiles
      (id, name, avatar_id, selected_pack_id, created_at, updated_at)
     VALUES (?, ?, ?, ?, ?, ?)`,
    profile.id,
    profile.name,
    profile.avatarId,
    profile.selectedPackId,
    profile.createdAt,
    profile.updatedAt
  );
}

export async function updateProfilePack(profileId: string, packId: PackId): Promise<void> {
  if (Platform.OS === "web") {
    const state = readWebState();
    state.profiles = state.profiles.map((profile) =>
      profile.id === profileId ? { ...profile, selectedPackId: packId, updatedAt: nowIso() } : profile
    );
    writeWebState(state);
    return;
  }
  const db = await getDb();
  await db.runAsync(
    "UPDATE profiles SET selected_pack_id = ?, updated_at = ? WHERE id = ?",
    packId,
    nowIso(),
    profileId
  );
}

export async function loadProgress(profileId: string): Promise<Record<string, WordProgress>> {
  if (Platform.OS === "web") return readWebState().progress[profileId] ?? {};
  const db = await getDb();
  const rows = await db.getAllAsync<ProgressRow>("SELECT * FROM progress WHERE profile_id = ?", profileId);
  return Object.fromEntries(rows.map((row) => [row.word_id, toProgress(row)]));
}

export async function saveAnswer(result: AnswerResult): Promise<WordProgress> {
  if (Platform.OS === "web") {
    const state = readWebState();
    const profileProgress = state.progress[result.profileId] ?? {};
    const existing = profileProgress[result.wordId];
    const at = nowIso();
    const correctCount = (existing?.correctCount ?? 0) + (result.isCorrect ? 1 : 0);
    const wrongCount = Math.max(0, (existing?.wrongCount ?? 0) + (result.isCorrect ? 0 : 1));
    const currentStreak = result.isCorrect ? (existing?.currentStreak ?? 0) + 1 : 0;
    const masteryScore = Math.max(
      0,
      Math.min(100, (existing?.masteryScore ?? 0) + (result.isCorrect ? 20 : -10))
    );
    const status: WordProgress["status"] =
      masteryScore >= 100 ? "learned" : wrongCount > 0 ? "review" : "practicing";
    const progress: WordProgress = {
      wordId: result.wordId,
      status,
      correctCount,
      wrongCount,
      currentStreak,
      masteryScore,
      lastSeenAt: at,
      nextReviewAt: result.isCorrect
        ? new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString()
        : new Date(Date.now() + 10 * 60 * 1000).toISOString()
    };
    state.progress[result.profileId] = {
      ...profileProgress,
      [result.wordId]: progress
    };
    writeWebState(state);
    return progress;
  }
  const db = await getDb();
  const existing = await db.getFirstAsync<ProgressRow>(
    "SELECT * FROM progress WHERE profile_id = ? AND word_id = ?",
    result.profileId,
    result.wordId
  );
  const at = nowIso();
  const correctCount = (existing?.correct_count ?? 0) + (result.isCorrect ? 1 : 0);
  const wrongCount = Math.max(0, (existing?.wrong_count ?? 0) + (result.isCorrect ? 0 : 1));
  const currentStreak = result.isCorrect ? (existing?.current_streak ?? 0) + 1 : 0;
  const masteryScore = Math.max(
    0,
    Math.min(100, (existing?.mastery_score ?? 0) + (result.isCorrect ? 20 : -10))
  );
  const status: WordProgress["status"] =
    masteryScore >= 100 ? "learned" : wrongCount > 0 ? "review" : "practicing";
  const nextReviewAt = result.isCorrect
    ? new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString()
    : new Date(Date.now() + 10 * 60 * 1000).toISOString();

  await db.runAsync(
    `INSERT OR REPLACE INTO progress
      (profile_id, word_id, status, correct_count, wrong_count, current_streak,
       mastery_score, last_seen_at, next_review_at)
     VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
    result.profileId,
    result.wordId,
    status,
    correctCount,
    wrongCount,
    currentStreak,
    masteryScore,
    at,
    nextReviewAt
  );

  await db.runAsync(
    `INSERT INTO quiz_attempts
      (id, profile_id, word_id, game_type, prompt_text, submitted_answer,
       correct_answer, is_correct, created_at)
     VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
    `attempt-${Date.now()}-${Math.random().toString(36).slice(2)}`,
    result.profileId,
    result.wordId,
    result.gameType,
    result.promptText,
    result.submittedAnswer,
    result.correctAnswer,
    Number(result.isCorrect),
    at
  );

  if (!result.isCorrect) {
    await db.runAsync(
      `INSERT INTO wrong_word_logs
        (id, profile_id, word_id, game_type, submitted_answer, correct_answer, created_at)
       VALUES (?, ?, ?, ?, ?, ?, ?)`,
      `wrong-${Date.now()}-${Math.random().toString(36).slice(2)}`,
      result.profileId,
      result.wordId,
      result.gameType,
      result.submittedAnswer,
      result.correctAnswer,
      at
    );
  }

  return {
    wordId: result.wordId,
    status,
    correctCount,
    wrongCount,
    currentStreak,
    masteryScore,
    lastSeenAt: at,
    nextReviewAt
  };
}

export async function clearWrongCount(profileId: string, wordId: string): Promise<WordProgress | null> {
  if (Platform.OS === "web") {
    const state = readWebState();
    const existing = state.progress[profileId]?.[wordId];
    if (!existing) return null;
    const progress: WordProgress = {
      ...existing,
      status: existing.masteryScore >= 100 ? "learned" : "practicing",
      wrongCount: 0
    };
    state.progress[profileId] = {
      ...state.progress[profileId],
      [wordId]: progress
    };
    writeWebState(state);
    return progress;
  }
  const db = await getDb();
  const existing = await db.getFirstAsync<ProgressRow>(
    "SELECT * FROM progress WHERE profile_id = ? AND word_id = ?",
    profileId,
    wordId
  );
  if (!existing) return null;
  const status: WordProgress["status"] = existing.mastery_score >= 100 ? "learned" : "practicing";
  await db.runAsync(
    "UPDATE progress SET wrong_count = 0, status = ? WHERE profile_id = ? AND word_id = ?",
    status,
    profileId,
    wordId
  );
  return {
    ...toProgress(existing),
    status,
    wrongCount: 0
  };
}
