import type { RefCode } from '@passiolife/nutritionai-react-native-sdk-v3';
import type { FoodLog } from './FoodLog';
import type { ScreenType } from './ScreenType';

export interface PassioAnalytics {}

export interface AnalyticsFoodLogs {
  screenType: ScreenType;
  id: RefCode | string;
  engagement: number;
  foodLog?: FoodLog;
}
