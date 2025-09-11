import http from '@/services/api';
import { Topic } from './types/Topic';

export const topicAPI = {
  getAll: () =>
    http.get<{ data: Topic[] }>('ielts-writing').then(res => res.data.data),
};
