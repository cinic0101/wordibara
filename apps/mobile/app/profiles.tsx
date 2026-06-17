import { router } from "expo-router";
import { Plus } from "lucide-react-native";
import { StyleSheet, Text, View } from "react-native";
import { Mascot } from "@/components/Mascot";
import { PressableCard } from "@/components/PressableCard";
import { Screen } from "@/components/Screen";
import { colors, spacing, avatars } from "@/lib/theme";
import { useAppStore } from "@/lib/store";

export default function ProfilesScreen() {
  const profiles = useAppStore((state) => state.profiles);
  const selectProfile = useAppStore((state) => state.selectProfile);

  return (
    <Screen>
      <Text style={styles.eyebrow}>Wordibara</Text>
      <Text style={styles.title}>Who is learning today?</Text>
      <View style={styles.grid}>
        {profiles.map((profile) => {
          const avatar = avatars.find((item) => item.id === profile.avatarId) ?? avatars[0];
          return (
            <PressableCard
              key={profile.id}
              tone="white"
              style={styles.profileCard}
              onPress={async () => {
                await selectProfile(profile.id);
                router.replace(profile.selectedPackId ? "/home" : "/scope");
              }}
            >
              <Mascot size={108} color={avatar.accent} accent={avatar.base} />
              <Text style={styles.profileName}>{profile.name}</Text>
            </PressableCard>
          );
        })}
        <PressableCard
          tone="green"
          style={styles.profileCard}
          onPress={() => router.push("/create-profile")}
        >
          <View style={styles.plusCircle}>
            <Plus color="#FFFFFF" size={34} strokeWidth={4} />
          </View>
          <Text style={styles.profileName}>New learner</Text>
        </PressableCard>
      </View>
    </Screen>
  );
}

const styles = StyleSheet.create({
  eyebrow: {
    color: colors.primaryDark,
    fontSize: 16,
    fontWeight: "900",
    textTransform: "uppercase"
  },
  title: {
    color: colors.ink,
    fontSize: 30,
    fontWeight: "900",
    lineHeight: 36
  },
  grid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: spacing.md
  },
  profileCard: {
    alignItems: "center",
    minHeight: 180,
    width: "47%"
  },
  profileName: {
    color: colors.ink,
    fontSize: 18,
    fontWeight: "900",
    marginTop: spacing.sm,
    textAlign: "center"
  },
  plusCircle: {
    alignItems: "center",
    backgroundColor: colors.primary,
    borderRadius: 44,
    height: 88,
    justifyContent: "center",
    width: 88
  }
});

