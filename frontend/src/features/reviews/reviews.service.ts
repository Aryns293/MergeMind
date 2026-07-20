import api from '@/services/api';

export interface InitiateReviewPayload {
  repoId: string;
  targetType: 'COMMIT' | 'PR';
  targetId: string;
  githubToken: string;
  correlationId?: string;
}

import { ReviewResponse } from './types';
export const reviewsService = {
  initiateReview: async (payload: InitiateReviewPayload): Promise<ReviewResponse> => {
    const { data } = await api.post('/reviews', payload);
    return data.data; // Depending on backend response, usually returns the pending review
  },

  getReview: async (id: string): Promise<ReviewResponse> => {
    const { data } = await api.get(`/reviews/${id}`);
    return data.data;
  },

  getRepoReviews: async (repoId: string): Promise<ReviewResponse[]> => {
    const { data } = await api.get(`/reviews/repo/${repoId}`);
    return data.data;
  }
};
