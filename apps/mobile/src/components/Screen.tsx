import { ScrollView, StyleSheet, View, type ViewStyle } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import type { ReactNode } from "react";
import { colors, spacing } from "@/lib/theme";

type ScreenProps = {
  children: ReactNode;
  contentStyle?: ViewStyle;
  scroll?: boolean;
  style?: ViewStyle;
};

export function Screen({ children, contentStyle, scroll = true, style }: ScreenProps) {
  if (!scroll) {
    return (
      <SafeAreaView style={[styles.safe, style]}>
        <View style={[styles.content, styles.fixedContent, contentStyle]}>{children}</View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={[styles.safe, style]}>
      <ScrollView contentContainerStyle={[styles.content, contentStyle]} showsVerticalScrollIndicator={false}>
        {children}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: {
    backgroundColor: colors.canvas,
    flex: 1
  },
  content: {
    gap: spacing.lg,
    padding: spacing.lg,
    paddingBottom: spacing.xxl
  },
  fixedContent: {
    flex: 1
  }
});
