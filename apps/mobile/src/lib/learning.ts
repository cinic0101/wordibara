import type { WordProgress } from "@/types/app";
import type { WordEntry, WordPack } from "@/types/content";

export function getProgress(progress: Record<string, WordProgress>, wordId: string): WordProgress | null {
  return progress[wordId] ?? null;
}

function shuffle<T>(items: T[]): T[] {
  const shuffled = [...items];
  for (let i = shuffled.length - 1; i > 0; i -= 1) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled;
}

export function selectTypingWords(
  pack: WordPack,
  progress: Record<string, WordProgress>,
  limit = 30
): WordEntry[] {
  const prioritized = [...pack.entries]
    .sort((left, right) => {
      const lp = getProgress(progress, left.id);
      const rp = getProgress(progress, right.id);
      const lw = lp?.wrongCount ?? 0;
      const rw = rp?.wrongCount ?? 0;
      if (lw !== rw) return rw - lw;
      const lm = lp?.masteryScore ?? 0;
      const rm = rp?.masteryScore ?? 0;
      if (lm !== rm) return lm - rm;
      return left.displayOrder - right.displayOrder;
    });
  const priorityPool = prioritized.slice(
    0,
    Math.min(prioritized.length, Math.max(limit * 4, limit))
  );
  return shuffle(priorityPool).slice(0, limit);
}

export function selectLetterWords(
  pack: WordPack,
  progress: Record<string, WordProgress>,
  limit = 30
): WordEntry[] {
  return selectTypingWords(
    {
      ...pack,
      entries: pack.entries.filter((entry) => entry.letterGameEligible)
    },
    progress,
    limit
  );
}

export function getWrongWords(pack: WordPack, progress: Record<string, WordProgress>): WordEntry[] {
  return pack.entries
    .filter((entry) => (progress[entry.id]?.wrongCount ?? 0) > 0)
    .sort((left, right) => {
      const lw = progress[left.id]?.wrongCount ?? 0;
      const rw = progress[right.id]?.wrongCount ?? 0;
      if (lw !== rw) return rw - lw;
      return left.displayOrder - right.displayOrder;
    });
}

export function masterySummary(pack: WordPack, progress: Record<string, WordProgress>) {
  const practiced = pack.entries.filter((entry) => progress[entry.id]).length;
  const learned = pack.entries.filter((entry) => (progress[entry.id]?.masteryScore ?? 0) >= 100).length;
  const wrong = pack.entries.filter((entry) => (progress[entry.id]?.wrongCount ?? 0) > 0).length;
  const stars = pack.entries.reduce((total, entry) => total + Math.floor((progress[entry.id]?.masteryScore ?? 0) / 25), 0);
  return { practiced, learned, wrong, stars };
}

export function chanceCount(word: string): number {
  if (word.length <= 5) return 5;
  if (word.length <= 8) return 6;
  return 7;
}

export function initialRevealedIndexes(word: string): Set<number> {
  const revealed = new Set<number>();
  revealed.add(0);
  if (word.length > 3) revealed.add(word.length - 1);
  return revealed;
}
