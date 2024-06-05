import type { FoodItem } from '../models';

export interface Recipe {
  uuid: string;
  name: string;
  totalServings: number;
  ingredients: FoodItem[];
}
