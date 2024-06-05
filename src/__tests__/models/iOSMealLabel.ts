export interface IOSMealLabel {
  day: number;
  meal?: MealEntity[] | null;
}
export interface MealEntity {
  mealLabel: string;
  record?: RecordEntity[] | null;
}
export interface RecordEntity {
  ingredients?: null[] | null;
  unitQuantity: string;
  mealName: string;
  passioID: string;
  servingSize: number;
}
