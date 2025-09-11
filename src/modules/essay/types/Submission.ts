export enum IELTSWritingSubmissionType {
  Task1 = 'Task 1',
  Task2 = 'Task 2',
}

export enum IELTSWritingSubmissionStatus {
  IDLE = 'IDLE',
  IN_PROGRESS = 'IN_PROGRESS',
  ANALYZED = 'ANALYZED',
  FAILED_TO_CHECK = 'FAILED_TO_CHECK',
}

export enum IELTSWritingTopicEnum {
  GENERATED = 'GENERATED',
  CUSTOM = 'CUSTOM',
}

export enum IELTSWritingTargetScore {
  BAND_SEVEN = 'BAND_SEVEN',
  BAND_EIGHT = 'BAND_EIGHT',
  BAND_NINE = 'BAND_NINE',
}

export interface Submission {
  _id: string;
  body: string;
  status: IELTSWritingSubmissionStatus;
  topic: IELTSWritingTopicEnum;
  targetScore: IELTSWritingTargetScore;
  score: number;
  aiFeedback: {
    mistakes: string[];
    suggestions: string[];
    improvedVersions?: {
      band7: {
        introduction: string;
        body?: string[];
        body_one?: string;
        body_two?: string;
        conclusion: string;
      };
      band8: {
        introduction: string;
        body?: string[];
        body_one?: string;
        body_two?: string;
        conclusion: string;
      };
      band9: {
        introduction: string;
        body?: string[];
        body_one?: string;
        body_two?: string;
        conclusion: string;
      };
    };
  };
  createdAt: string;
  updatedAt: string;
  criteriaScores?: {
    taskResponse: number;
    coherence: number;
    lexical: number;
    grammar: number;
  };
}
