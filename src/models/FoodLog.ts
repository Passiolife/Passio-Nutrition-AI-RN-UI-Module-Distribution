import type { PassioIDEntityType } from '@passiolife/nutritionai-react-native-sdk-v3/src/sdk/v2';

import type { FoodItem } from './FoodItem';
import type { MealLabel } from './MealLabel';
import type { ServingInfo } from './ServingInfo';

export interface FoodLog extends ServingInfo {
  name: string;
  uuid: string;
  refCode?: string;
  eventTimestamp: string;
  isOpenFood?: boolean;
  longName?: string;
  meal: MealLabel;
  iconID?: string;
  entityType?: PassioIconType;
  foodItems: FoodItem[];
  // Not used
  imageName?: string;
}

export type PassioIconType = PassioIDEntityType | 'user-recipe' | 'user-food';
