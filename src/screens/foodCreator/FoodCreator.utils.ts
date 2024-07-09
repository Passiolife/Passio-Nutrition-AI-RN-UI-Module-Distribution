import {
  FoodItem,
  FoodLog,
  Nutrient,
  NutrientType,
  nutrientUnits,
} from '../../models';
import uuid4 from 'react-native-uuid';
import { getMealLog } from '../../utils';
import { convertDateToDBFormat } from '../../utils/DateFormatter';
import type { FoodCreatorFoodDetailType } from './views/FoodCreatorFoodDetail';
import type { RequireNutritionFactsType } from './views/RequireNutritionFacts';

export interface createFoodLogUsingFoodCreator {
  info: Record<FoodCreatorFoodDetailType, string>;
  requireNutritionFact: Record<RequireNutritionFactsType, string>;
  otherNutritionFact: Record<NutrientType, string>;
}

export const WEIGHT_UNIT_SPLIT_IDENTIFIER = '-';

export const createFoodLogUsingFoodCreator = ({
  info,
  requireNutritionFact,
  otherNutritionFact,
}: createFoodLogUsingFoodCreator) => {
  const uuid: string = uuid4.v4() as string;
  const date = new Date();
  const meal = getMealLog(date, undefined);

  const [weight, unit] = (requireNutritionFact?.Weight as string).split(
    WEIGHT_UNIT_SPLIT_IDENTIFIER
  );

  let nutrients: Nutrient[] = Object.keys(otherNutritionFact ?? []).map(
    (key) => {
      let data: Nutrient = {
        id: key as NutrientType,
        amount: Number(otherNutritionFact[key as NutrientType]) ?? 0,
        unit: nutrientUnits[key as NutrientType],
      };
      return data;
    }
  );

  nutrients = [
    ...nutrients,
    {
      id: 'calories',
      amount: Number(requireNutritionFact?.calories!),
      unit: nutrientUnits.calories,
    },
    {
      id: 'fat',
      amount: Number(requireNutritionFact?.Fat!),
      unit: nutrientUnits.fat,
    },
    {
      id: 'carbs',
      amount: Number(requireNutritionFact?.Carbs!),
      unit: nutrientUnits.carbs,
    },
    {
      id: 'protein',
      amount: Number(requireNutritionFact?.Protein!),
      unit: nutrientUnits.protein,
    },
  ];

  const foodItem: FoodItem = {
    computedWeight: {
      unit: unit,
      value: Number(weight),
    },
    passioID: '',
    name: info?.name!,
    imageName: '',
    entityType: 'user-food',
    nutrients: nutrients,
    selectedUnit: requireNutritionFact?.Units!,
    selectedQuantity: Number(requireNutritionFact?.ServingSize!),
    servingSizes: [
      {
        quantity: Number(weight),
        unit: requireNutritionFact?.Units!,
      },
      {
        quantity: 100,
        unit: 'gram',
      },
    ],
    servingUnits: [
      {
        mass: Number(weight),
        unit: requireNutritionFact?.Units!,
      },
      {
        mass: 100,
        unit: 'gram',
      },
    ],
  };

  const foodLog: FoodLog = {
    uuid: uuid,
    eventTimestamp: convertDateToDBFormat(date),
    meal: meal,
    foodItems: [foodItem],
    ...foodItem,
  };

  return foodLog;
};
