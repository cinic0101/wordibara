import { router } from "expo-router";
import { useState } from "react";
import { Pressable, StyleSheet, Text, View } from "react-native";
import { PrimaryButton } from "@/components/PrimaryButton";
import { ProgressBar } from "@/components/ProgressBar";
import { Screen } from "@/components/Screen";
import { getPack } from "@/lib/content";
import { chanceCount, initialRevealedIndexes, selectLetterWords } from "@/lib/learning";
import { useRequireProfile } from "@/lib/navigation";
import { colors, spacing } from "@/lib/theme";
import { useAppStore } from "@/lib/store";

const ALPHABET = "ABCDEFGHIJKLMNOPQRSTUVWXYZ".split("");

export default function LetterGameScreen() {
  const profile = useRequireProfile();
  const progress = useAppStore((state) => state.progress);
  const recordAnswer = useAppStore((state) => state.recordAnswer);
  const pack = getPack(profile?.selectedPackId);
  const [words] = useState(() => selectLetterWords(pack, progress, 10));
  const [index, setIndex] = useState(0);
  const word = words[index] ?? pack.entries.find((entry) => entry.letterGameEligible) ?? pack.entries[0];
  const answer = word.answerText;
  const maxWrong = chanceCount(answer);
  const [guessed, setGuessed] = useState<Set<string>>(new Set());
  const [revealed, setRevealed] = useState<Set<number>>(initialRevealedIndexes(answer));
  const [wrongCount, setWrongCount] = useState(0);
  const [finished, setFinished] = useState<"won" | "lost" | null>(null);

  const masked = answer
    .split("")
    .map((letter, i) => (revealed.has(i) || guessed.has(letter) ? letter : "_"));
  const isSolved = masked.join("") === answer;

  async function finish(status: "won" | "lost", submitted: string) {
    if (finished) return;
    setFinished(status);
    await recordAnswer({
      wordId: word.id,
      gameType: "letters",
      promptText: word.meaningZh,
      submittedAnswer: submitted,
      correctAnswer: word.text,
      isCorrect: status === "won"
    });
  }

  async function guess(letterRaw: string) {
    if (finished) return;
    const letter = letterRaw.toLocaleLowerCase();
    if (guessed.has(letter)) return;
    const nextGuessed = new Set(guessed);
    nextGuessed.add(letter);
    setGuessed(nextGuessed);

    if (answer.includes(letter)) {
      const nextRevealed = new Set(revealed);
      answer.split("").forEach((char, i) => {
        if (char === letter) nextRevealed.add(i);
      });
      setRevealed(nextRevealed);
      const solved = answer.split("").every((char, i) => nextRevealed.has(i) || nextGuessed.has(char));
      if (solved) {
        await finish("won", answer);
      }
      return;
    }

    const nextWrong = wrongCount + 1;
    setWrongCount(nextWrong);
    if (nextWrong === 2) {
      const hidden = answer
        .split("")
        .map((_, i) => i)
        .filter((i) => !revealed.has(i) && !nextGuessed.has(answer[i]));
      const hintIndex = hidden[0];
      if (hintIndex != null) {
        setRevealed(new Set([...revealed, hintIndex]));
      }
    }
    if (nextWrong >= maxWrong) {
      await finish("lost", masked.join(""));
    }
  }

  function next() {
    if (index >= words.length - 1) {
      router.replace("/home");
      return;
    }
    const nextWord = words[index + 1];
    setIndex((value) => value + 1);
    setGuessed(new Set());
    setRevealed(initialRevealedIndexes(nextWord.answerText));
    setWrongCount(0);
    setFinished(null);
  }

  return (
    <Screen scroll={false}>
      <View style={styles.header}>
        <Text style={styles.headerText}>Letter Game</Text>
        <Text style={styles.headerText}>{index + 1} / {words.length}</Text>
      </View>
      <ProgressBar value={index + (finished ? 1 : 0)} max={words.length} color={colors.sky} />

      <View style={styles.promptCard}>
        <Text style={styles.topic}>{word.topic.nameZh}</Text>
        <Text style={styles.meaning}>{word.meaningZh}</Text>
        <View style={styles.maskRow}>
          {masked.map((char, i) => (
            <View key={`${word.id}-${i}`} style={styles.maskBox}>
              <Text style={styles.maskText}>{char}</Text>
            </View>
          ))}
        </View>
        <Text style={styles.chances}>Wrong chances: {Math.max(0, maxWrong - wrongCount)}</Text>
      </View>

      <View style={styles.keyboard}>
        {ALPHABET.map((letter) => {
          const used = guessed.has(letter.toLocaleLowerCase());
          return (
            <Pressable
              key={letter}
              disabled={used || Boolean(finished)}
              onPress={() => guess(letter)}
              style={({ pressed }) => [
                styles.key,
                used ? styles.keyUsed : null,
                pressed ? styles.keyPressed : null
              ]}
            >
              <Text style={[styles.keyText, used ? styles.keyTextUsed : null]}>{letter}</Text>
            </Pressable>
          );
        })}
      </View>

      {finished ? (
        <View style={[styles.result, finished === "won" ? styles.correctBox : styles.wrongBox]}>
          <Text style={styles.resultTitle}>{finished === "won" ? "Solved!" : "Review later"}</Text>
          <Text style={styles.resultAnswer}>{word.text}</Text>
        </View>
      ) : null}

      <View style={styles.actions}>
        <PrimaryButton label="Exit" tone="ghost" onPress={() => router.replace("/home")} style={styles.exit} />
        <PrimaryButton label={finished ? "Next" : isSolved ? "Next" : "Skip"} tone={finished ? "green" : "blue"} onPress={finished ? next : () => finish("lost", masked.join(""))} style={styles.next} />
      </View>
    </Screen>
  );
}

const styles = StyleSheet.create({
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
    gap: spacing.lg,
    justifyContent: "center",
    padding: spacing.lg
  },
  topic: {
    color: colors.skyDark,
    fontSize: 15,
    fontWeight: "900"
  },
  meaning: {
    color: colors.ink,
    fontSize: 36,
    fontWeight: "900",
    letterSpacing: 0,
    textAlign: "center"
  },
  maskRow: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: spacing.sm,
    justifyContent: "center"
  },
  maskBox: {
    alignItems: "center",
    backgroundColor: colors.blueSoft,
    borderColor: "#A8DFFF",
    borderRadius: 8,
    borderWidth: 2,
    height: 48,
    justifyContent: "center",
    width: 40
  },
  maskText: {
    color: colors.ink,
    fontSize: 26,
    fontWeight: "900",
    textTransform: "uppercase"
  },
  chances: {
    color: colors.muted,
    fontSize: 15,
    fontWeight: "900"
  },
  keyboard: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: spacing.sm,
    justifyContent: "center"
  },
  key: {
    alignItems: "center",
    backgroundColor: colors.surface,
    borderColor: colors.border,
    borderRadius: 8,
    borderWidth: 2,
    height: 42,
    justifyContent: "center",
    shadowColor: colors.shadow,
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 1,
    shadowRadius: 0,
    width: 42
  },
  keyPressed: {
    transform: [{ translateY: 2 }],
    shadowOffset: { width: 0, height: 1 }
  },
  keyUsed: {
    backgroundColor: "#E8EEE8",
    shadowOpacity: 0
  },
  keyText: {
    color: colors.ink,
    fontSize: 16,
    fontWeight: "900"
  },
  keyTextUsed: {
    color: "#A4AEA6"
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
    color: colors.skyDark,
    fontSize: 24,
    fontWeight: "900",
    marginTop: spacing.xs
  },
  actions: {
    flexDirection: "row",
    gap: spacing.md
  },
  exit: {
    flex: 0.35
  },
  next: {
    flex: 0.65
  }
});
