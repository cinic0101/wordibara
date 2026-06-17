import { StyleSheet, TextInput, type TextInputProps } from "react-native";
import { colors, radii, spacing } from "@/lib/theme";

export function TextInputBox(props: TextInputProps) {
  return (
    <TextInput
      autoCapitalize="none"
      autoCorrect={false}
      placeholderTextColor="#98A59D"
      {...props}
      style={[styles.input, props.style]}
    />
  );
}

const styles = StyleSheet.create({
  input: {
    backgroundColor: colors.surface,
    borderColor: colors.border,
    borderRadius: radii.md,
    borderWidth: 2,
    color: colors.ink,
    fontSize: 20,
    fontWeight: "800",
    minHeight: 58,
    paddingHorizontal: spacing.lg
  }
});

