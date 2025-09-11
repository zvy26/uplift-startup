interface GeneratedTopic {
  topic: 'GENERATED';
  writing: string;
}

interface CustomTopic {
  topic: 'CUSTOM';
  customWritingQuestion: string;
}

type Topic = GeneratedTopic | CustomTopic;

export type SendSubmission = {
  targetScore: 'BAND_SEVEN' | 'BAND_EIGHT' | 'BAND_NINE';
  body: string;
} & Topic;
