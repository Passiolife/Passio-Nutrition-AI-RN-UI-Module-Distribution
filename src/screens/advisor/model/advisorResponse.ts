import type {
  PassioAdvisorFoodInfo,
  PassioAdvisorResponse,
} from '@passiolife/nutritionai-react-native-sdk-v3';

export type messageType =
  | 'text'
  | 'image'
  | 'response'
  | 'records'
  | 'typing'
  | 'imageScanning'
  | 'sessionError'
  | 'defaultResponse';

export type RecordType = 'image' | 'searchTool';
export interface AdvisorResponse {
  type: messageType;
  message?: string;
  error?: string;
  uri?: string[];
  response?: PassioAdvisorResponse | null;
  records?: Selection[];
  recordType?: RecordType;
  defaultResponse?: string;
  isLogged?: boolean;
  isLoading?: boolean;
  uuID: string;
}

export interface Selection extends PassioAdvisorFoodInfo {
  index: number;
  isLogged?: boolean;
}
