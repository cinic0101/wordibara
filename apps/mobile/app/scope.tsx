import { router } from "expo-router";
import { BookOpen, Trophy } from "lucide-react-native";
import { StyleSheet, Text, View } from "react-native";
import { PressableCard } from "@/components/PressableCard";
import { PrimaryButton } from "@/components/PrimaryButton";
import { Screen } from "@/components/Screen";
import { WORD_PACK_BY_ID, formatPackTitle } from "@/lib/content";
import { useRequireProfile } from "@/lib/navigation";
import { colors, spacing } from "@/lib/theme";
import { useAppStore } from "@/lib/store";
import type { PackId } from "@/types/content";

export default function ScopeScreen() {
  const activeProfile = useRequireProfile();
  const choosePack = useAppStore((state) => state.choosePack);

  async function pick(packId: PackId) {
    await choosePack(packId);
    router.replace("/home");
  }

  return (
    <Screen>
      <Text style={styles.eyebrow}>{activeProfile ? activeProfile.name : "Learner"}</Text>
      <Text style={styles.title}>Choose your word world</Text>
      <View style={styles.cards}>
        <PressableCard
          tone="green"
          title={formatPackTitle("en-600")}
          subtitle={`${WORD_PACK_BY_ID["en-600"].wordCount} entries. Friendly first adventure.`}
          icon={<BookOpen color={colors.primaryDark} size={34} strokeWidth={3} />}
          onPress={() => pick("en-600")}
        />
        <PressableCard
          tone="blue"
          title={formatPackTitle("en-1500")}
          subtitle={`${WORD_PACK_BY_ID["en-1500"].wordCount} entries. Bigger rewards and more challenge.`}
          icon={<Trophy color={colors.skyDark} size={34} strokeWidth={3} />}
          onPress={() => pick("en-1500")}
        />
      </View>
      <PrimaryButton label="Profile" tone="ghost" onPress={() => router.replace("/profiles")} />
    </Screen>
  );
}

const styles = StyleSheet.create({
  eyebrow: {
    color: colors.primaryDark,
    fontSize: 16,
    fontWeight: "900"
  },
  title: {
    color: colors.ink,
    fontSize: 32,
    fontWeight: "900",
    lineHeight: 38
  },
  cards: {
    gap: spacing.lg
  }
});
