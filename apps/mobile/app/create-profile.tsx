import { router } from "expo-router";
import { Check } from "lucide-react-native";
import { useState } from "react";
import { Alert, Pressable, StyleSheet, Text, View } from "react-native";
import { Mascot } from "@/components/Mascot";
import { PrimaryButton } from "@/components/PrimaryButton";
import { Screen } from "@/components/Screen";
import { TextInputBox } from "@/components/TextInputBox";
import { colors, spacing, avatars } from "@/lib/theme";
import { useAppStore } from "@/lib/store";

type AvatarId = (typeof avatars)[number]["id"];

export default function CreateProfileScreen() {
  const createProfile = useAppStore((state) => state.createProfile);
  const [name, setName] = useState("");
  const [avatarId, setAvatarId] = useState<AvatarId>(avatars[0].id);

  async function handleCreate() {
    if (!name.trim()) {
      Alert.alert("Name needed", "Add a learner name first.");
      return;
    }
    await createProfile(name, avatarId);
    router.replace("/scope");
  }

  return (
    <Screen>
      <Text style={styles.title}>Make a learner</Text>
      <Text style={styles.subtitle}>Only a name and avatar stay on this device.</Text>
      <View style={styles.avatarGrid}>
        {avatars.map((avatar) => {
          const selected = avatar.id === avatarId;
          return (
            <Pressable
              key={avatar.id}
              onPress={() => setAvatarId(avatar.id)}
              style={[styles.avatarOption, selected ? styles.avatarSelected : null]}
            >
              <Mascot size={104} color={avatar.accent} accent={avatar.base} />
              {selected ? (
                <View style={styles.check}>
                  <Check color="#FFFFFF" size={18} strokeWidth={4} />
                </View>
              ) : null}
            </Pressable>
          );
        })}
      </View>
      <View style={styles.field}>
        <Text style={styles.label}>Name</Text>
        <TextInputBox value={name} onChangeText={setName} placeholder="Mia" autoCapitalize="words" />
      </View>
      <PrimaryButton label="Continue" onPress={handleCreate} />
      <PrimaryButton label="Back" tone="ghost" onPress={() => router.replace("/profiles")} />
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
    fontWeight: "700",
    lineHeight: 22
  },
  avatarGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: spacing.md
  },
  avatarOption: {
    alignItems: "center",
    backgroundColor: colors.surface,
    borderColor: colors.border,
    borderRadius: 8,
    borderWidth: 2,
    minHeight: 132,
    justifyContent: "center",
    width: "47%"
  },
  avatarSelected: {
    borderColor: colors.primary,
    backgroundColor: colors.greenSoft
  },
  check: {
    alignItems: "center",
    backgroundColor: colors.primary,
    borderRadius: 16,
    height: 32,
    justifyContent: "center",
    position: "absolute",
    right: 10,
    top: 10,
    width: 32
  },
  field: {
    gap: spacing.sm
  },
  label: {
    color: colors.ink,
    fontSize: 15,
    fontWeight: "900",
    textTransform: "uppercase"
  }
});
