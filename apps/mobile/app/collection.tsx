import { router } from "expo-router";
import { Award, Lock, Sparkles } from "lucide-react-native";
import { StyleSheet, Text, View } from "react-native";
import { Mascot } from "@/components/Mascot";
import { PressableCard } from "@/components/PressableCard";
import { PrimaryButton } from "@/components/PrimaryButton";
import { Screen } from "@/components/Screen";
import { getPack } from "@/lib/content";
import { masterySummary } from "@/lib/learning";
import { useRequireProfile } from "@/lib/navigation";
import { colors, spacing, avatars } from "@/lib/theme";
import { useAppStore } from "@/lib/store";

const milestones = [
  { words: 1, label: "First Spark" },
  { words: 10, label: "Word Hopper" },
  { words: 30, label: "Tiny Scholar" },
  { words: 75, label: "Quiz Hero" },
  { words: 150, label: "Wordibara Pro" }
];

export default function CollectionScreen() {
  const profile = useRequireProfile();
  const progress = useAppStore((state) => state.progress);
  const pack = getPack(profile?.selectedPackId);
  const summary = masterySummary(pack, progress);
  const avatar = avatars.find((item) => item.id === profile?.avatarId) ?? avatars[0];

  return (
    <Screen>
      <Text style={styles.title}>Collection</Text>
      <PressableCard tone="green" style={styles.hero}>
        <Mascot size={150} color={avatar.accent} accent={avatar.base} mood="proud" />
        <Text style={styles.heroTitle}>{summary.stars} stars</Text>
        <Text style={styles.heroSub}>{summary.learned} learned words</Text>
      </PressableCard>
      <View style={styles.badges}>
        {milestones.map((milestone) => {
          const unlocked = summary.learned >= milestone.words;
          return (
            <View key={milestone.label} style={[styles.badge, unlocked ? styles.unlocked : styles.locked]}>
              {unlocked ? (
                <Award color={colors.yellowDark} size={28} strokeWidth={3} />
              ) : (
                <Lock color={colors.muted} size={26} strokeWidth={3} />
              )}
              <Text style={styles.badgeTitle}>{milestone.label}</Text>
              <Text style={styles.badgeSub}>{milestone.words} learned</Text>
            </View>
          );
        })}
      </View>
      <PressableCard
        tone="blue"
        title="Next reward"
        subtitle="Keep solving words to unlock more badges."
        icon={<Sparkles color={colors.skyDark} size={30} />}
      />
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
  hero: {
    alignItems: "center"
  },
  heroTitle: {
    color: colors.ink,
    fontSize: 28,
    fontWeight: "900"
  },
  heroSub: {
    color: colors.primaryDark,
    fontSize: 16,
    fontWeight: "900"
  },
  badges: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: spacing.md
  },
  badge: {
    alignItems: "center",
    borderRadius: 8,
    borderWidth: 2,
    gap: spacing.xs,
    minHeight: 126,
    padding: spacing.md,
    width: "47%"
  },
  unlocked: {
    backgroundColor: "#FFF4BD",
    borderColor: "#FFE277"
  },
  locked: {
    backgroundColor: colors.surface,
    borderColor: colors.border
  },
  badgeTitle: {
    color: colors.ink,
    fontSize: 15,
    fontWeight: "900",
    textAlign: "center"
  },
  badgeSub: {
    color: colors.muted,
    fontSize: 12,
    fontWeight: "800",
    textAlign: "center"
  }
});
