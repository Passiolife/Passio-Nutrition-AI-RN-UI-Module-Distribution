import type { FoodLog } from './FoodLog';
import type {
  PassioFoodDataInfo,
  RefCode,
} from '@passiolife/nutritionai-react-native-sdk-v3';

export interface QuickSuggestion {
  foodName: string;
  iconID: string;
  foodLog?: FoodLog;
  refCode?: RefCode | string;
  passioFoodDataInfo?: PassioFoodDataInfo;
}
