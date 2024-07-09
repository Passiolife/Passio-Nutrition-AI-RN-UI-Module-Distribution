import type {
  PassioID,
  PassioIDEntityType,
} from '@passiolife/nutritionai-react-native-sdk-v3/src/sdk/v2';

import type { FoodItem } from './FoodItem';
import type { MealLabel } from './MealLabel';
import type { ServingInfo } from './ServingInfo';

export interface FoodLog extends ServingInfo {
  name: string;
  uuid: string;
  passioID: PassioID;
  refCode?: string;
  eventTimestamp: string;
  isOpenFood?: boolean;
  longName?: string;
  meal: MealLabel;
  imageName: string;
  userImage?: string;
  entityType: PassioIconType;
  foodItems: FoodItem[];
}

export type PassioIconType = PassioIDEntityType | 'user-recipe' | 'user-food';
