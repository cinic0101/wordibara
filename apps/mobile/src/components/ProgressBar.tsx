import { StyleSheet, View } from "react-native";
import { colors, radii } from "@/lib/theme";

type ProgressBarProps = {
  value: number;
  max: number;
  color?: string;
};

export function ProgressBar({ value, max, color = colors.primary }: ProgressBarProps) {
  const ratio = max <= 0 ? 0 : Math.max(0, Math.min(1, value / max));
  return (
    <View style={styles.track}>
      <View style={[styles.fill, { width: `${ratio * 100}%`, backgroundColor: color }]} />
    </View>
  );
}

const styles = StyleSheet.create({
  track: {
    backgroundColor: "#E5EFE4",
    borderRadius: radii.pill,
    height: 16,
    overflow: "hidden",
    width: "100%"
  },
  fill: {
    borderRadius: radii.pill,
    height: "100%"
  }
});

