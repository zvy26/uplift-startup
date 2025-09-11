export interface Topic {
  _id: string;
  title: string;
  question: string;
  type: 'TASK_ONE' | 'TASK_TWO';
  createdAt: string;
  updatedAt: string;
}
