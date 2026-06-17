import { router } from "expo-router";
import { BookOpen, Dumbbell, Keyboard, Settings, Sparkles, Trophy } from "lucide-react-native";
import { StyleSheet, Text, View } from "react-native";
import { Mascot } from "@/components/Mascot";
import { PressableCard } from "@/components/PressableCard";
import { ProgressBar } from "@/components/ProgressBar";
import { Screen } from "@/components/Screen";
import { getPack, formatPackTitle } from "@/lib/content";
import { masterySummary } from "@/lib/learning";
import { useRequireProfile } from "@/lib/navigation";
import { colors, spacing, avatars } from "@/lib/theme";
import { useAppStore } from "@/lib/store";

export default function HomeScreen() {
  const profile = useRequireProfile();
  const progress = useAppStore((state) => state.progress);
  const pack = getPack(profile?.selectedPackId);
  const summary = masterySummary(pack, progress);
  const avatar = avatars.find((item) => item.id === profile?.avatarId) ?? avatars[0];
  const todayGoal = Math.min(15, pack.wordCount);

  return (
    <Screen>
      <View style={styles.topbar}>
        <View>
          <Text style={styles.name}>{profile?.name ?? "Learner"}</Text>
          <Text style={styles.scope}>{formatPackTitle(pack.packId)}</Text>
        </View>
        <PressableCard tone="white" style={styles.iconButton} onPress={() => router.push("/parent")}>
          <Settings color={colors.muted} size={24} />
        </PressableCard>
      </View>

      <View style={styles.hero}>
        <Mascot size={170} color={avatar.accent} accent={avatar.base} mood="proud" />
        <View style={styles.speech}>
          <Text style={styles.speechText}>Ready for a word quest?</Text>
          <Text style={styles.speechSub}>{summary.stars} stars collected</Text>
        </View>
      </View>

      <View style={styles.today}>
        <View style={styles.rowBetween}>
          <Text style={styles.sectionTitle}>Today</Text>
          <Text style={styles.counter}>{summary.practiced} / {todayGoal}</Text>
        </View>
        <ProgressBar value={Math.min(summary.practiced, todayGoal)} max={todayGoal} />
      </View>

      <View style={styles.grid}>
        <PressableCard
          tone="green"
          title="Type English"
          subtitle="Chinese prompt, English answer"
          icon={<Keyboard color={colors.primaryDark} size={30} strokeWidth={3} />}
          style={styles.gameCard}
          onPress={() => router.push("/game/typing")}
        />
        <PressableCard
          tone="blue"
          title="Letter Game"
          subtitle="Guess letters before chances run out"
          icon={<BookOpen color={colors.skyDark} size={30} strokeWidth={3} />}
          style={styles.gameCard}
          onPress={() => router.push("/game/letters")}
        />
      </View>

      <PressableCard
        tone={summary.wrong > 0 ? "yellow" : "white"}
        title={`Review wrong words ${summary.wrong}`}
        subtitle="Bring tricky words back first"
        icon={<Dumbbell color={colors.yellowDark} size={30} strokeWidth={3} />}
        onPress={() => router.push("/review")}
      />

      <PressableCard
        tone="white"
        title="Collection"
        subtitle={`${summary.learned} learned words unlock badges`}
        icon={<Trophy color={colors.primaryDark} size={30} strokeWidth={3} />}
        onPress={() => router.push("/collection")}
      >
        <View style={styles.badgeRow}>
          <Sparkles color={colors.yellowDark} size={18} />
          <Text style={styles.badgeText}>{pack.wordCount} words in this world</Text>
        </View>
      </PressableCard>
    </Screen>
  );
}

const styles = StyleSheet.create({
  topbar: {
    alignItems: "center",
    flexDirection: "row",
    justifyContent: "space-between"
  },
  name: {
    color: colors.ink,
    fontSize: 26,
    fontWeight: "900"
  },
  scope: {
    color: colors.muted,
    fontSize: 15,
    fontWeight: "800",
    marginTop: 2
  },
  iconButton: {
    alignItems: "center",
    height: 56,
    justifyContent: "center",
    padding: 0,
    width: 56
  },
  hero: {
    alignItems: "center",
    backgroundColor: colors.surface,
    borderColor: colors.border,
    borderRadius: 8,
    borderWidth: 2,
    padding: spacing.lg
  },
  speech: {
    alignItems: "center",
    gap: spacing.xs,
    marginTop: spacing.sm
  },
  speechText: {
    color: colors.ink,
    fontSize: 20,
    fontWeight: "900"
  },
  speechSub: {
    color: colors.primaryDark,
    fontSize: 14,
    fontWeight: "900"
  },
  today: {
    gap: spacing.sm
  },
  rowBetween: {
    alignItems: "center",
    flexDirection: "row",
    justifyContent: "space-between"
  },
  sectionTitle: {
    color: colors.ink,
    fontSize: 20,
    fontWeight: "900"
  },
  counter: {
    color: colors.muted,
    fontSize: 14,
    fontWeight: "900"
  },
  grid: {
    flexDirection: "row",
    gap: spacing.md
  },
  gameCard: {
    flex: 1,
    minHeight: 164
  },
  badgeRow: {
    alignItems: "center",
    flexDirection: "row",
    gap: spacing.xs,
    marginTop: spacing.md
  },
  badgeText: {
    color: colors.muted,
    fontSize: 13,
    fontWeight: "800"
  }
});
