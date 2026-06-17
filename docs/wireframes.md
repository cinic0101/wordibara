# Wordibara Wireframes

These are first-pass mobile wireframes for review before implementation.

## App Flow

```txt
Launch
  -> Choose Profile
    -> Create Profile
      -> Choose Word Scope
        -> Home
  -> Home
    -> Game 1: Type English
    -> Game 2: Letter Pattern
    -> Wrong Word Review
    -> Collection
    -> Parent Settings
```

## 1. Choose Profile

```txt
+--------------------------------------+
| Wordibara                            |
|                                      |
| Who is learning today?               |
|                                      |
| +----------+  +----------+           |
| | Avatar   |  | Avatar   |           |
| | Mia      |  | Leo      |           |
| | 42 words |  | 10 words |           |
| +----------+  +----------+           |
|                                      |
| +----------------------------------+ |
| | +  New learner                  | |
| +----------------------------------+ |
|                                      |
| Parent settings                         |
+--------------------------------------+
```

## 2. Create Profile

```txt
+--------------------------------------+
| New learner                      X   |
|                                      |
| Pick an avatar                      |
|                                      |
|  (A)    (B)    (C)    (D)           |
|                                      |
| Name                                |
| +----------------------------------+ |
| |                                  | |
| +----------------------------------+ |
|                                      |
| +----------------------------------+ |
| | Continue                         | |
| +----------------------------------+ |
+--------------------------------------+
```

## 3. Choose Word Scope

```txt
+--------------------------------------+
| Choose your word world               |
|                                      |
| +----------------------------------+ |
| | Starter 600                      | |
| | Daily words and short answers    | |
| | Friendly first adventure         | |
| +----------------------------------+ |
|                                      |
| +----------------------------------+ |
| | Challenge 1500                   | |
| | More words and bigger rewards    | |
| | Best after starter practice      | |
| +----------------------------------+ |
|                                      |
| +----------------------------------+ |
| | Start learning                   | |
| +----------------------------------+ |
+--------------------------------------+
```

## 4. Home

```txt
+--------------------------------------+
| Avatar  Mia                 Scope 600 |
|                                      |
|        [animated avatar / creature]  |
|                                      |
| Today                               |
| [======------] 8 / 15 words          |
|                                      |
| +----------------+ +----------------+ |
| | Type English   | | Letter Game    | |
| +----------------+ +----------------+ |
|                                      |
| +----------------------------------+ |
| | Review wrong words        5      | |
| +----------------------------------+ |
|                                      |
| Collection                 Settings  |
+--------------------------------------+
```

## 5. Game 1: Type English

```txt
+--------------------------------------+
| Type English                   3 / 10 |
|                                      |
| Topic: Food & drink                  |
|                                      |
| +----------------------------------+ |
| | Chinese meaning                  | |
| |                                  | |
| |              蘋果                | |
| |                                  | |
| | Part of speech: noun             | |
| +----------------------------------+ |
|                                      |
| English answer                      |
| +----------------------------------+ |
| | apple                            | |
| +----------------------------------+ |
|                                      |
| +----------------+ +----------------+ |
| | Check          | | Hear word      | |
| +----------------+ +----------------+ |
+--------------------------------------+
```

## 6. Game 1 Result

```txt
+--------------------------------------+
| Type English                   3 / 10 |
|                                      |
|        Correct sparkle animation     |
|                                      |
|              apple                   |
|              蘋果                    |
|                                      |
| +----------------------------------+ |
| | Next word                        | |
| +----------------------------------+ |
+--------------------------------------+
```

Wrong state:

```txt
+--------------------------------------+
| Type English                   3 / 10 |
|                                      |
|         Gentle shake animation       |
|                                      |
| Your answer: appel                   |
| Correct: apple                       |
|                                      |
| Added to review                      |
|                                      |
| +----------------------------------+ |
| | Try next                         | |
| +----------------------------------+ |
+--------------------------------------+
```

## 7. Game 2: Letter Pattern

```txt
+--------------------------------------+
| Letter Game                    4 / 10 |
|                                      |
| Meaning: 好的                        |
|                                      |
|        g  _  _  d                    |
|                                      |
| Wrong chances: 5                     |
| [heart] [heart] [heart] [heart] [heart] |
|                                      |
| A B C D E F G H I                   |
| J K L M N O P Q R                   |
| S T U V W X Y Z                     |
|                                      |
| Hint after 2 misses                  |
+--------------------------------------+
```

## 8. Wrong Word Review

```txt
+--------------------------------------+
| Review                         5 left |
|                                      |
| Missed words come back first         |
|                                      |
| +----------------------------------+ |
| | fish                             | |
| | 魚肉                             | |
| | Food & drink                     | |
| +----------------------------------+ |
|                                      |
| +----------------+ +----------------+ |
| | Practice       | | I know this    | |
| +----------------+ +----------------+ |
+--------------------------------------+
```

## 9. Collection

```txt
+--------------------------------------+
| Collection                           |
|                                      |
| +----------+ +----------+ +----------+ |
| | Creature | | Locked   | | Locked   | |
| | Level 2  | | 20 stars | | 50 stars | |
| +----------+ +----------+ +----------+ |
|                                      |
| Recent unlock                        |
| +----------------------------------+ |
| | Spark badge: 10 correct streak   | |
| +----------------------------------+ |
+--------------------------------------+
```

## 10. Parent Settings

```txt
+--------------------------------------+
| Parent Settings                      |
|                                      |
| Learner: Mia                         |
| Scope: Starter 600                   |
|                                      |
| +----------------------------------+ |
| | Change word scope                | |
| +----------------------------------+ |
| | Reset local progress             | |
| +----------------------------------+ |
| | Privacy                          | |
| +----------------------------------+ |
|                                      |
| No account. Local data only.         |
+--------------------------------------+
```
