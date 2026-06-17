import { router } from "expo-router";
import { useState } from "react";
import { KeyboardAvoidingView, Platform, StyleSheet, Text, View } from "react-native";
import * as Speech from "expo-speech";
import { PrimaryButton } from "@/components/PrimaryButton";
import { ProgressBar } from "@/components/ProgressBar";
import { Screen } from "@/components/Screen";
import { TextInputBox } from "@/components/TextInputBox";
import { getPack, isCorrectAnswer } from "@/lib/content";
import { selectTypingWords } from "@/lib/learning";
import { useRequireProfile } from "@/lib/navigation";
import { colors, spacing } from "@/lib/theme";
import { useAppStore } from "@/lib/store";

export default function TypingGameScreen() {
  const profile = useRequireProfile();
  const progress = useAppStore((state) => state.progress);
  const recordAnswer = useAppStore((state) => state.recordAnswer);
  const pack = getPack(profile?.selectedPackId);
  const [words, setWords] = useState<ReturnType<typeof selectTypingWords>>([]);
  const [index, setIndex] = useState(0);
  const [answer, setAnswer] = useState("");
  const [result, setResult] = useState<"correct" | "wrong" | null>(null);

  function startRound(count: 5 | 10) {
    setWords(selectTypingWords(pack, progress, count));
    setIndex(0);
    setAnswer("");
    setResult(null);
  }

  if (words.length === 0) {
    return (
      <Screen scroll={false} contentStyle={styles.setupScreen}>
        <View style={styles.setupPanel}>
          <Text style={styles.setupTitle}>Type English</Text>
          <Text style={styles.setupSubtitle}>Round size</Text>
          <View style={styles.setupButtons}>
            <PrimaryButton
              label="5 words"
              tone="yellow"
              onPress={() => startRound(5)}
              style={styles.setupButton}
            />
            <PrimaryButton
              label="10 words"
              onPress={() => startRound(10)}
              style={styles.setupButton}
            />
          </View>
          <PrimaryButton label="Exit" tone="ghost" onPress={() => router.replace("/home")} />
        </View>
      </Screen>
    );
  }

  const word = words[index] ?? pack.entries[0];

  async function check() {
    if (!answer.trim() || result) return;
    const isCorrect = isCorrectAnswer(word, answer);
    setResult(isCorrect ? "correct" : "wrong");
    await recordAnswer({
      wordId: word.id,
      gameType: "typing",
      promptText: word.meaningZh,
      submittedAnswer: answer,
      correctAnswer: word.text,
      isCorrect
    });
  }

  function next() {
    if (index >= words.length - 1) {
      router.replace("/home");
      return;
    }
    setIndex((value) => value + 1);
    setAnswer("");
    setResult(null);
  }

  return (
    <Screen scroll={false}>
      <KeyboardAvoidingView behavior={Platform.OS === "ios" ? "padding" : undefined} style={styles.wrap}>
        <View style={styles.header}>
          <Text style={styles.headerText}>Type English</Text>
          <Text style={styles.headerText}>{index + 1} / {words.length}</Text>
        </View>
        <ProgressBar value={index + (result ? 1 : 0)} max={words.length} />

        <View style={[styles.promptCard, result === "wrong" ? styles.wrongCard : null]}>
          <Text style={styles.topic}>{word.topic.nameZh} · {word.topic.nameEn}</Text>
          <Text style={styles.meaning}>{word.meaningZh}</Text>
          {word.partOfSpeech ? <Text style={styles.part}>{word.partOfSpeech}</Text> : null}
        </View>

        <View style={styles.answerArea}>
          <Text style={styles.label}>English answer</Text>
          <TextInputBox
            value={answer}
            onChangeText={setAnswer}
            editable={!result}
            placeholder="type here"
            returnKeyType="done"
            onSubmitEditing={check}
          />
        </View>

        {result ? (
          <View style={[styles.result, result === "correct" ? styles.correctBox : styles.wrongBox]}>
            <Text style={styles.resultTitle}>{result === "correct" ? "Correct!" : "Added to review"}</Text>
            <Text style={styles.resultAnswer}>{word.text}</Text>
          </View>
        ) : null}

        <View style={styles.buttons}>
          <PrimaryButton
            label="Hear"
            tone="ghost"
            onPress={() => Speech.speak(word.text, { language: "en-US" })}
            style={styles.smallButton}
          />
          <PrimaryButton label={result ? "Next" : "Check"} onPress={result ? next : check} style={styles.mainButton} />
        </View>
        <PrimaryButton label="Exit" tone="ghost" onPress={() => router.replace("/home")} />
      </KeyboardAvoidingView>
    </Screen>
  );
}

const styles = StyleSheet.create({
  setupScreen: {
    justifyContent: "center"
  },
  setupPanel: {
    gap: spacing.lg
  },
  setupTitle: {
    color: colors.ink,
    fontSize: 34,
    fontWeight: "900",
    textAlign: "center"
  },
  setupSubtitle: {
    color: colors.muted,
    fontSize: 16,
    fontWeight: "900",
    textAlign: "center",
    textTransform: "uppercase"
  },
  setupButtons: {
    flexDirection: "row",
    gap: spacing.md
  },
  setupButton: {
    flex: 1
  },
  wrap: {
    flex: 1,
    gap: spacing.lg
  },
  header: {
    alignItems: "center",
    flexDirection: "row",
    justifyContent: "space-between"
  },
  headerText: {
    color: colors.muted,
    fontSize: 15,
    fontWeight: "900"
  },
  promptCard: {
    alignItems: "center",
    backgroundColor: colors.surface,
    borderColor: colors.border,
    borderRadius: 8,
    borderWidth: 2,
    flex: 1,
    gap: spacing.md,
    justifyContent: "center",
    padding: spacing.lg
  },
  wrongCard: {
    borderColor: "#FFB9B9"
  },
  topic: {
    color: colors.skyDark,
    fontSize: 14,
    fontWeight: "900",
    textAlign: "center"
  },
  meaning: {
    color: colors.ink,
    fontSize: 44,
    fontWeight: "900",
    letterSpacing: 0,
    textAlign: "center"
  },
  part: {
    color: colors.muted,
    fontSize: 16,
    fontWeight: "900"
  },
  answerArea: {
    gap: spacing.sm
  },
  label: {
    color: colors.ink,
    fontSize: 14,
    fontWeight: "900",
    textTransform: "uppercase"
  },
  result: {
    borderRadius: 8,
    borderWidth: 2,
    padding: spacing.md
  },
  correctBox: {
    backgroundColor: colors.greenSoft,
    borderColor: "#B6EBA1"
  },
  wrongBox: {
    backgroundColor: colors.redSoft,
    borderColor: "#FFB9B9"
  },
  resultTitle: {
    color: colors.ink,
    fontSize: 17,
    fontWeight: "900"
  },
  resultAnswer: {
    color: colors.primaryDark,
    fontSize: 24,
    fontWeight: "900",
    marginTop: spacing.xs
  },
  buttons: {
    flexDirection: "row",
    gap: spacing.md
  },
  smallButton: {
    flex: 0.35
  },
  mainButton: {
    flex: 0.65
  }
});
