import { router } from "expo-router";
import { StyleSheet, Text, View } from "react-native";
import { PressableCard } from "@/components/PressableCard";
import { PrimaryButton } from "@/components/PrimaryButton";
import { Screen } from "@/components/Screen";
import { getPack } from "@/lib/content";
import { getWrongWords } from "@/lib/learning";
import { useRequireProfile } from "@/lib/navigation";
import { colors, spacing } from "@/lib/theme";
import { useAppStore } from "@/lib/store";

export default function ReviewScreen() {
  const profile = useRequireProfile();
  const progress = useAppStore((state) => state.progress);
  const markReviewed = useAppStore((state) => state.markReviewed);
  const pack = getPack(profile?.selectedPackId);
  const wrongWords = getWrongWords(pack, progress).slice(0, 30);

  return (
    <Screen>
      <Text style={styles.title}>Review</Text>
      <Text style={styles.subtitle}>{wrongWords.length} tricky words waiting</Text>
      {wrongWords.length === 0 ? (
        <PressableCard tone="green" title="No wrong words" subtitle="Play a game to keep building your streak." />
      ) : (
        wrongWords.map((word) => (
          <PressableCard key={word.id} tone="white" style={styles.wordCard}>
            <View style={styles.rowBetween}>
              <View style={styles.wordText}>
                <Text style={styles.word}>{word.text}</Text>
                <Text style={styles.meaning}>{word.meaningZh}</Text>
                <Text style={styles.topic}>{word.topic.nameZh} · wrong {progress[word.id]?.wrongCount ?? 0}</Text>
              </View>
              <PrimaryButton
                label="Got it"
                tone="green"
                style={styles.gotIt}
                onPress={() => markReviewed(word.id)}
              />
            </View>
          </PressableCard>
        ))
      )}
      <PrimaryButton label="Practice typing" tone="blue" onPress={() => router.push("/game/typing")} />
      <PrimaryButton label="Home" tone="ghost" onPress={() => router.replace("/home")} />
    </Screen>
  );
}

const styles = StyleSheet.create({
  title: {
    color: colors.ink,
    fontSize: 32,
    fontWeight: "900"
  },
  subtitle: {
    color: colors.muted,
    fontSize: 16,
    fontWeight: "800"
  },
  wordCard: {
    padding: spacing.md
  },
  rowBetween: {
    alignItems: "center",
    flexDirection: "row",
    gap: spacing.md,
    justifyContent: "space-between"
  },
  wordText: {
    flex: 1
  },
  word: {
    color: colors.ink,
    fontSize: 24,
    fontWeight: "900"
  },
  meaning: {
    color: colors.primaryDark,
    fontSize: 18,
    fontWeight: "900",
    marginTop: spacing.xs
  },
  topic: {
    color: colors.muted,
    fontSize: 13,
    fontWeight: "800",
    marginTop: spacing.xs
  },
  gotIt: {
    minHeight: 46,
    width: 112
  }
});
