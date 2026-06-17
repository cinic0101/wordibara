import { router } from "expo-router";
import { useEffect } from "react";
import { StyleSheet, Text, View } from "react-native";
import { Mascot } from "@/components/Mascot";
import { PrimaryButton } from "@/components/PrimaryButton";
import { Screen } from "@/components/Screen";
import { colors, spacing } from "@/lib/theme";
import { useActiveProfile, useAppStore } from "@/lib/store";

export default function IndexScreen() {
  const profiles = useAppStore((state) => state.profiles);
  const activeProfile = useActiveProfile();

  useEffect(() => {
    if (profiles.length === 0) return;
    if (!activeProfile) return;
    if (!activeProfile.selectedPackId) {
      router.replace("/scope");
    } else {
      router.replace("/home");
    }
  }, [activeProfile, profiles.length]);

  return (
    <Screen scroll={false}>
      <View style={styles.hero}>
        <Mascot size={190} />
        <Text style={styles.title}>Wordibara</Text>
        <Text style={styles.subtitle}>Build English words with a tiny learning buddy.</Text>
      </View>
      <View style={styles.actions}>
        <PrimaryButton label="Start" onPress={() => router.push("/profiles")} />
        {profiles.length > 0 ? (
          <PrimaryButton label="Continue" tone="blue" onPress={() => router.replace("/home")} />
        ) : null}
      </View>
    </Screen>
  );
}

const styles = StyleSheet.create({
  hero: {
    alignItems: "center",
    flex: 1,
    justifyContent: "center",
    gap: spacing.md
  },
  title: {
    color: colors.ink,
    fontSize: 42,
    fontWeight: "900",
    letterSpacing: 0
  },
  subtitle: {
    color: colors.muted,
    fontSize: 17,
    fontWeight: "700",
    lineHeight: 24,
    maxWidth: 280,
    textAlign: "center"
  },
  actions: {
    gap: spacing.md
  }
});

