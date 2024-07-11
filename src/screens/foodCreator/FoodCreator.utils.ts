import {
  CustomFood,
  FoodItem,
  Nutrient,
  NutrientType,
  nutrientUnits,
} from '../../models';
import uuid4 from 'react-native-uuid';
import type { FoodCreatorFoodDetailType } from './views/FoodCreatorFoodDetail';
import type { RequireNutritionFactsType } from './views/RequireNutritionFacts';
import type { PassioFoodItem } from '@passiolife/nutritionai-react-native-sdk-v3';
import { convertPassioFoodItemToFoodLog } from '../../utils/V3Utils';

export interface createFoodLogUsingFoodCreator {
  info: Record<FoodCreatorFoodDetailType, string>;
  requireNutritionFact: Record<RequireNutritionFactsType, string>;
  otherNutritionFact: Record<NutrientType, string>;
  oldRecord?: CustomFood;
}

export const WEIGHT_UNIT_SPLIT_IDENTIFIER = '-';

export const createFoodLogUsingFoodCreator = ({
  info,
  requireNutritionFact,
  otherNutritionFact,
  oldRecord,
}: createFoodLogUsingFoodCreator) => {
  const uuid: string = oldRecord?.uuid ?? (uuid4.v4() as string);

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

  const factUnits = requireNutritionFact?.Units!;
  const isUnitGramOrML =
    factUnits.toLowerCase() === 'g' || factUnits.toLowerCase() === 'ml';
  const factWeight = Number(
    isUnitGramOrML ? Number(requireNutritionFact?.ServingSize!) : weight
  );

  const foodItem: FoodItem = {
    computedWeight: {
      unit: unit,
      value: factWeight,
    },
    passioID: '',
    name: info?.name!,
    barcode: info?.barcode,
    imageName: '',
    entityType: 'user-food',
    nutrients: nutrients,
    selectedUnit: factUnits!,
    selectedQuantity: Number(requireNutritionFact?.ServingSize!),
    servingSizes: [
      {
        quantity: Number(requireNutritionFact?.ServingSize!),
        unit: factUnits,
      },
      {
        quantity: 1,
        unit: 'gram',
      },
    ],
    servingUnits: [
      {
        mass: factWeight / Number(requireNutritionFact?.ServingSize!),
        unit: factUnits,
      },
      {
        mass: 1,
        unit: 'gram',
      },
    ],
  };

  const foodLog: CustomFood = {
    ...oldRecord,
    foodItems: [foodItem],
    ...foodItem,
    barcode: info.barcode,
    brandName: info.brand,
    uuid: uuid,
  };

  return foodLog;
};

export const convertPassioFoodItemToCustomFood = (
  foodItem: PassioFoodItem,
  barcode?: string
) => {
  const foodLog = convertPassioFoodItemToFoodLog(
    foodItem,
    undefined,
    undefined
  );
  const customFood: CustomFood = {
    ...foodLog,
    barcode: barcode,
    brandName: foodItem.details,
  };
  return customFood;
};

export const cleanedDecimalNumber = (text: string) => {
  return text;
};

export const isValidDecimalNumber = (text?: string, isCharacter?: boolean) => {
  if (text) {
    if (text.length === 0) {
      return false;
    } else if (isCharacter) {
      return text.length > 0;
    } else {
      return /^\d+(\.\d+)?$/.test(text);
    }
  } else {
    return false;
  }
};
