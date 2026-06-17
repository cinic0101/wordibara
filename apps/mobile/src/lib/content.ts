import en1500 from "../../../../packages/content/word-packs/en-1500.json";
import en600 from "../../../../packages/content/word-packs/en-600.json";
import type { PackId, WordEntry, WordPack } from "@/types/content";

export const WORD_PACKS = [en600, en1500] as WordPack[];

export const WORD_PACK_BY_ID: Record<PackId, WordPack> = {
  "en-600": en600 as WordPack,
  "en-1500": en1500 as WordPack
};

export function getPack(packId: PackId | null | undefined): WordPack {
  return WORD_PACK_BY_ID[packId ?? "en-600"];
}

export function getWordById(wordId: string): WordEntry | undefined {
  for (const pack of WORD_PACKS) {
    const match = pack.entries.find((entry) => entry.id === wordId);
    if (match) return match;
  }
  return undefined;
}

export function normalizeAnswer(answer: string): string {
  return answer.trim().toLocaleLowerCase().replace(/\s+/g, " ");
}

export function isCorrectAnswer(entry: WordEntry, answer: string): boolean {
  const normalized = normalizeAnswer(answer);
  return entry.acceptedAnswers.some((accepted) => accepted === normalized);
}

export function formatPackTitle(packId: PackId): string {
  return packId === "en-600" ? "Starter 600" : "Challenge 1500";
}

