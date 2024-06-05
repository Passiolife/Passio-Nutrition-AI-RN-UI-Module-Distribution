import type { FoodItem } from './FoodItem';
import type { PassioID } from '@passiolife/nutritionai-react-native-sdk-v3/src/sdk/v2';
import type { ServingSize } from './ServingSize';
import type { ServingUnit } from './ServingUnit';

export interface FoodRecipe {
  passioID: PassioID;
  name: string;
  imageName: string;
  selectedUnit: string;
  selectedQuantity: number;
  servingSizes: ServingSize[];
  servingUnits: ServingUnit[];
  ingredients: FoodItem[];
}
