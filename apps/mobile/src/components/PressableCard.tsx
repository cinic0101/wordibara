import { Pressable, StyleSheet, Text, View, type PressableProps, type ViewStyle } from "react-native";
import { colors, radii, spacing } from "@/lib/theme";
import type { ReactNode } from "react";

type PressableCardProps = PressableProps & {
  title?: string;
  subtitle?: string;
  icon?: ReactNode;
  tone?: "green" | "blue" | "yellow" | "white" | "red";
  style?: ViewStyle;
  children?: ReactNode;
};

const toneColors = {
  green: { background: colors.greenSoft, border: "#B6EBA1", shadow: "#9ED884" },
  blue: { background: colors.blueSoft, border: "#A8DFFF", shadow: "#88C9EA" },
  yellow: { background: "#FFF4BD", border: "#FFE277", shadow: "#E8C750" },
  white: { background: colors.surface, border: colors.border, shadow: colors.shadow },
  red: { background: colors.redSoft, border: "#FFB9B9", shadow: "#E49A9A" }
};

export function PressableCard({
  title,
  subtitle,
  icon,
  tone = "white",
  style,
  children,
  ...props
}: PressableCardProps) {
  const palette = toneColors[tone];
  return (
    <Pressable
      {...props}
      style={({ pressed }) => [
        styles.card,
        {
          backgroundColor: palette.background,
          borderColor: palette.border,
          shadowColor: palette.shadow,
          transform: [{ translateY: pressed ? 3 : 0 }]
        },
        pressed ? styles.pressed : null,
        style
      ]}
    >
      {icon ? <View style={styles.icon}>{icon}</View> : null}
      {title ? <Text style={styles.title}>{title}</Text> : null}
      {subtitle ? <Text style={styles.subtitle}>{subtitle}</Text> : null}
      {children}
    </Pressable>
  );
}

const styles = StyleSheet.create({
  card: {
    borderRadius: radii.md,
    borderWidth: 2,
    padding: spacing.lg,
    shadowOffset: { width: 0, height: 5 },
    shadowOpacity: 1,
    shadowRadius: 0,
    elevation: 3
  },
  pressed: {
    shadowOffset: { width: 0, height: 2 }
  },
  icon: {
    marginBottom: spacing.sm
  },
  title: {
    color: colors.ink,
    fontSize: 18,
    fontWeight: "900"
  },
  subtitle: {
    color: colors.muted,
    fontSize: 13,
    fontWeight: "700",
    lineHeight: 18,
    marginTop: spacing.xs
  }
});

