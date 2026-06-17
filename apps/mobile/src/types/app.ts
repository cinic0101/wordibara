import type { PackId } from "./content";

export type Profile = {
  id: string;
  name: string;
  avatarId: string;
  selectedPackId: PackId | null;
  createdAt: string;
  updatedAt: string;
};

export type WordProgress = {
  wordId: string;
  status: "new" | "practicing" | "review" | "learned";
  correctCount: number;
  wrongCount: number;
  currentStreak: number;
  masteryScore: number;
  lastSeenAt: string | null;
  nextReviewAt: string | null;
};

export type GameType = "typing" | "letters" | "review";

export type AnswerResult = {
  profileId: string;
  wordId: string;
  gameType: GameType;
  promptText: string;
  submittedAnswer: string;
  correctAnswer: string;
  isCorrect: boolean;
};

