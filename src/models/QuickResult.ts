import type { PassioFoodItem } from '@passiolife/nutritionai-react-native-sdk-v3';

export interface QuickResult {
  passioID?: string;
  name: string;
  passioIDAttributes?: PassioFoodItem | null;
  barcode?: string;
  packageFood?: string;
  type: 'Barcode' | 'PackageFood' | 'Candidate';
}
