import { create } from "zustand";
import { WORD_PACK_BY_ID } from "./content";
import {
  clearWrongCount,
  getSetting,
  initDatabase,
  loadProfiles,
  loadProgress,
  saveAnswer,
  setSetting,
  updateProfilePack,
  upsertProfile
} from "./db";
import type { AnswerResult, Profile, WordProgress } from "@/types/app";
import type { PackId } from "@/types/content";

type AppStore = {
  ready: boolean;
  loading: boolean;
  profiles: Profile[];
  activeProfileId: string | null;
  progress: Record<string, WordProgress>;
  initialize: () => Promise<void>;
  createProfile: (name: string, avatarId: string) => Promise<Profile>;
  selectProfile: (profileId: string) => Promise<void>;
  choosePack: (packId: PackId) => Promise<void>;
  recordAnswer: (result: Omit<AnswerResult, "profileId">) => Promise<WordProgress | null>;
  markReviewed: (wordId: string) => Promise<void>;
};

function makeId(prefix: string) {
  return `${prefix}-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
}

function nowIso() {
  return new Date().toISOString();
}

export const useAppStore = create<AppStore>((set, get) => ({
  ready: false,
  loading: false,
  profiles: [],
  activeProfileId: null,
  progress: {},

  initialize: async () => {
    if (get().loading) return;
    set({ loading: true });
    await initDatabase();
    const profiles = await loadProfiles();
    const lastProfileId = await getSetting("activeProfileId");
    const activeProfile =
      profiles.find((profile) => profile.id === lastProfileId) ??
      profiles[0] ??
      null;
    const progress = activeProfile ? await loadProgress(activeProfile.id) : {};
    set({
      profiles,
      activeProfileId: activeProfile?.id ?? null,
      progress,
      ready: true,
      loading: false
    });
  },

  createProfile: async (name, avatarId) => {
    const createdAt = nowIso();
    const profile: Profile = {
      id: makeId("profile"),
      name: name.trim() || "Learner",
      avatarId,
      selectedPackId: null,
      createdAt,
      updatedAt: createdAt
    };
    await upsertProfile(profile);
    await setSetting("activeProfileId", profile.id);
    set((state) => ({
      profiles: [...state.profiles, profile],
      activeProfileId: profile.id,
      progress: {}
    }));
    return profile;
  },

  selectProfile: async (profileId) => {
    await setSetting("activeProfileId", profileId);
    const progress = await loadProgress(profileId);
    set({ activeProfileId: profileId, progress });
  },

  choosePack: async (packId) => {
    const profileId = get().activeProfileId;
    if (!profileId || !WORD_PACK_BY_ID[packId]) return;
    await updateProfilePack(profileId, packId);
    set((state) => ({
      profiles: state.profiles.map((profile) =>
        profile.id === profileId
          ? { ...profile, selectedPackId: packId, updatedAt: nowIso() }
          : profile
      )
    }));
  },

  recordAnswer: async (result) => {
    const profileId = get().activeProfileId;
    if (!profileId) return null;
    const progress = await saveAnswer({ ...result, profileId });
    set((state) => ({
      progress: {
        ...state.progress,
        [progress.wordId]: progress
      }
    }));
    return progress;
  },

  markReviewed: async (wordId) => {
    const profileId = get().activeProfileId;
    if (!profileId) return;
    const progress = await clearWrongCount(profileId, wordId);
    if (!progress) return;
    set((state) => ({
      progress: {
        ...state.progress,
        [wordId]: progress
      }
    }));
  }
}));

export function useActiveProfile() {
  return useAppStore((state) =>
    state.profiles.find((profile) => profile.id === state.activeProfileId) ?? null
  );
}

