import type { FoodLog } from './FoodLog';

export interface CustomRecipe
  extends Omit<
    FoodLog,
    | 'refCode'
    | 'eventTimestamp'
    | 'meal'
    | 'isOpenFood'
    | 'longName'
    | 'passioID'
  > {
  barcode?: string;
  brandName?: string;
  userFoodImage?: string;
}
