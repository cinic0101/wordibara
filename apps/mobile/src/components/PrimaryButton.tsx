import { Pressable, StyleSheet, Text, type PressableProps, type ViewStyle } from "react-native";
import { colors, radii, spacing } from "@/lib/theme";

type PrimaryButtonProps = PressableProps & {
  label: string;
  tone?: "green" | "blue" | "yellow" | "red" | "ghost";
  style?: ViewStyle;
};

const tones = {
  green: { bg: colors.primary, shadow: colors.primaryDark, text: "#FFFFFF", border: colors.primaryDark },
  blue: { bg: colors.sky, shadow: colors.skyDark, text: "#FFFFFF", border: colors.skyDark },
  yellow: { bg: colors.yellow, shadow: colors.yellowDark, text: colors.ink, border: colors.yellowDark },
  red: { bg: colors.red, shadow: "#C92F2F", text: "#FFFFFF", border: "#C92F2F" },
  ghost: { bg: colors.surface, shadow: colors.border, text: colors.ink, border: colors.border }
};

export function PrimaryButton({ label, tone = "green", style, disabled, ...props }: PrimaryButtonProps) {
  const palette = tones[tone];
  return (
    <Pressable
      {...props}
      disabled={disabled}
      style={({ pressed }) => [
        styles.button,
        {
          backgroundColor: palette.bg,
          borderColor: palette.border,
          shadowColor: palette.shadow,
          opacity: disabled ? 0.55 : 1,
          transform: [{ translateY: pressed ? 3 : 0 }]
        },
        pressed ? styles.pressed : null,
        style
      ]}
    >
      <Text style={[styles.label, { color: palette.text }]}>{label}</Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  button: {
    alignItems: "center",
    borderRadius: radii.md,
    borderWidth: 2,
    justifyContent: "center",
    minHeight: 52,
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.md,
    shadowOffset: { width: 0, height: 5 },
    shadowOpacity: 1,
    shadowRadius: 0,
    elevation: 3
  },
  pressed: {
    shadowOffset: { width: 0, height: 2 }
  },
  label: {
    fontSize: 16,
    fontWeight: "900",
    letterSpacing: 0,
    textTransform: "uppercase"
  }
});

