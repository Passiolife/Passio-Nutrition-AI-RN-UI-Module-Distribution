import type { PassioID } from '@passiolife/nutritionai-react-native-sdk-v3/src/sdk/v2';
import type { MealLabel } from './MealLabel';

export interface MealPlan {
  name: string;
  type: MealLabel;
  servingSize: number;
  day: number;
  unitQuantity: string;
  passioID: PassioID;
}

export interface Suggestion {
  type: MealLabel;
  passioID: PassioID;
  name: String;
}
