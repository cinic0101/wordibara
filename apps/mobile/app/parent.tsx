import { router } from "expo-router";
import { ShieldCheck } from "lucide-react-native";
import { StyleSheet, Text, View } from "react-native";
import { PressableCard } from "@/components/PressableCard";
import { PrimaryButton } from "@/components/PrimaryButton";
import { Screen } from "@/components/Screen";
import { getPack, formatPackTitle } from "@/lib/content";
import { useRequireProfile } from "@/lib/navigation";
import { colors, spacing } from "@/lib/theme";

export default function ParentScreen() {
  const profile = useRequireProfile();
  const pack = getPack(profile?.selectedPackId);

  return (
    <Screen>
      <Text style={styles.title}>Settings</Text>
      <PressableCard
        tone="white"
        title="Local-first app"
        subtitle="Profiles, progress, and word history stay on this device."
        icon={<ShieldCheck color={colors.primaryDark} size={34} strokeWidth={3} />}
      />
      <View style={styles.panel}>
        <Text style={styles.label}>Learner</Text>
        <Text style={styles.value}>{profile?.name ?? "None"}</Text>
        <Text style={styles.label}>Scope</Text>
        <Text style={styles.value}>{formatPackTitle(pack.packId)} · {pack.wordCount} entries</Text>
      </View>
      <PrimaryButton label="Change profile" tone="blue" onPress={() => router.replace("/profiles")} />
      <PrimaryButton label="Change word scope" tone="yellow" onPress={() => router.push("/scope")} />
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
  panel: {
    backgroundColor: colors.surface,
    borderColor: colors.border,
    borderRadius: 8,
    borderWidth: 2,
    gap: spacing.xs,
    padding: spacing.lg
  },
  label: {
    color: colors.muted,
    fontSize: 13,
    fontWeight: "900",
    marginTop: spacing.sm,
    textTransform: "uppercase"
  },
  value: {
    color: colors.ink,
    fontSize: 20,
    fontWeight: "900"
  }
});
