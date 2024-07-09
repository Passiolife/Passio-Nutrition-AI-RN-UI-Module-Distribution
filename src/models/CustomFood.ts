import type { FoodLog } from './FoodLog';

export interface CustomFood
  extends Omit<
    FoodLog,
    | 'refCode'
    | 'eventTimestamp'
    | 'meal'
    | 'isOpenFood'
    | 'longName'
    | 'passioID'
  > {}
