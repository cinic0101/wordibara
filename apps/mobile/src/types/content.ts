export type WordTopic = {
  id: string;
  nameEn: string;
  nameZh: string;
};

export type WordEntry = {
  id: string;
  displayOrder: number;
  text: string;
  answerText: string;
  acceptedAnswers: string[];
  meaningZh: string;
  partOfSpeech: string | null;
  topic: WordTopic;
  source: {
    type: "pdf" | "xls";
    file: string;
    page?: number;
    sheet?: string;
    row?: number;
    topicEn?: string;
  };
  is1200: boolean | null;
  isMultiWord: boolean;
  letterGameEligible: boolean;
};

export type WordPack = {
  schemaVersion: number;
  packId: "en-600" | "en-1500";
  title: string;
  sourceFile: string;
  sourceType: "pdf" | "xls";
  sourceSha256: string;
  wordCount: number;
  uniqueAnswerCount: number;
  topicCount: number;
  topics: WordTopic[];
  entries: WordEntry[];
};

export type PackId = WordPack["packId"];

