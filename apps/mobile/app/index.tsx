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
    <Screen scroll={false} contentStyle={styles.screenContent}>
      <View style={styles.centerColumn}>
        <View style={styles.hero}>
          <Mascot size={176} />
          <Text style={styles.title}>Wordibara</Text>
          <Text style={styles.subtitle}>Build English words with a tiny learning buddy.</Text>
        </View>
        <View style={styles.actions}>
          <PrimaryButton label="Start" onPress={() => router.push("/profiles")} style={styles.button} />
          {profiles.length > 0 ? (
            <PrimaryButton label="Continue" tone="blue" onPress={() => router.replace("/home")} style={styles.button} />
          ) : null}
        </View>
      </View>
    </Screen>
  );
}

const styles = StyleSheet.create({
  screenContent: {
    justifyContent: "center"
  },
  centerColumn: {
    alignItems: "center",
    gap: spacing.xxl,
    justifyContent: "center",
    width: "100%"
  },
  hero: {
    alignItems: "center",
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
    gap: spacing.md,
    maxWidth: 360,
    width: "100%"
  },
  button: {
    width: "100%"
  }
});
