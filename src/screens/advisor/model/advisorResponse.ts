import type { PassioAdvisorResponse } from '@passiolife/nutritionai-react-native-sdk-v3';

export type messageType = 'text' | 'image' | 'response' | 'typing';
export interface AdvisorResponse {
  type: messageType;
  message?: string;
  error?: string;
  uri?: string;
  response?: PassioAdvisorResponse | null;
}