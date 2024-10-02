import {
  CustomFood,
  CustomRecipe,
  FavoriteFoodItem,
  FoodItem,
  FoodLog,
  MealLabel,
  Nutrient,
  NutrientType,
  nutrientUnits,
} from '../../models';
import uuid4 from 'react-native-uuid';
import type { FoodCreatorFoodDetailType } from './views/FoodCreatorFoodDetail';
import type { RequireNutritionFactsType } from './views/RequireNutritionFacts';
import type {
  NutritionFacts,
  PassioFoodItem,
} from '@passiolife/nutritionai-react-native-sdk-v3';
import { convertPassioFoodItemToFoodLog } from '../../utils/V3Utils';
import { convertDateToDBFormat } from '../../utils/DateFormatter';
import { getMealLog } from '../../utils';
import { mergeNutrients } from '../../utils/NutritentsUtils';

export const CUSTOM_USER_FOOD_PREFIX = 'user-food-';
export const CUSTOM_USER_RECIPE__PREFIX = 'user-recipe-';
export const CUSTOM_USER_NUTRITION_FACT__PREFIX = 'user-nutrition-fact-';

export const generateCustomID = () => {
  const uuid: string = uuid4.v4() as string;
  return CUSTOM_USER_FOOD_PREFIX + uuid;
};
export const generateCustomNutritionFactID = () => {
  const uuid: string = uuid4.v4() as string;
  return CUSTOM_USER_NUTRITION_FACT__PREFIX + uuid;
};
export const generateCustomRecipeID = () => {
  const uuid: string = uuid4.v4() as string;
  return CUSTOM_USER_RECIPE__PREFIX + uuid;
};

export interface createFoodLogUsingFoodCreator {
  info: Record<FoodCreatorFoodDetailType, string>;
  requireNutritionFact: Record<RequireNutritionFactsType, string>;
  otherNutritionFact: Record<NutrientType, string>;
  oldRecord?: CustomFood;
  image?: string;
}

export const WEIGHT_UNIT_SPLIT_IDENTIFIER = '-';
export const CUSTOM_FOOD_GRAM = 'gram';
export const CUSTOM_FOOD_ML = 'ml';

export const isGramOrML = (unit: string) => {
  const isUnitGramOrML =
    unit.toLowerCase() === 'g' ||
    unit.toLowerCase() === 'gram' ||
    unit.toLowerCase() === 'ml';
  return isUnitGramOrML;
};

export const getCustomFoodUUID = () => {
  return (CUSTOM_USER_FOOD_PREFIX + uuid4.v4()) as string;
};

export const getCustomRecipeUUID = () => {
  return (CUSTOM_USER_RECIPE__PREFIX + uuid4.v4()) as string;
};

export const createFoodLogUsingFoodCreator = ({
  info,
  requireNutritionFact,
  otherNutritionFact,
  oldRecord,
  image,
}: createFoodLogUsingFoodCreator) => {
  const uuid: string = oldRecord?.uuid ?? getCustomFoodUUID();

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
  const isUnitGramOrML = isGramOrML(factUnits);
  const factWeight = Number(
    isUnitGramOrML ? Number(requireNutritionFact?.ServingSize!) : weight
  );

  const foodItem: FoodItem = {
    computedWeight: {
      unit: unit,
      value: factWeight,
    },
    name: info?.name!.trim(),
    barcode: info?.barcode,
    iconId: image,
    entityType: 'user-food',
    nutrients: nutrients,
    refCode: '',
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
    barcode: info.barcode.trim(),
    brandName: info.brand,
    userFoodImage: image,
    iconID: image,
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
      return text.trim().length > 0;
    } else {
      return /^\d+(\.\d+)?$/.test(text.replaceAll(',', '.').trim());
    }
  } else {
    return false;
  }
};
export const createCustomFoodUsingNutritionFact = (
  facts: NutritionFacts,
  barcode?: string
) => {
  let nutrients: Nutrient[] = [];

  if (facts.calories) {
    nutrients.push({
      id: 'calories',
      amount: facts.calories,
      unit: nutrientUnits.calories,
    });
  }

  if (facts.fat) {
    nutrients.push({
      id: 'fat',
      amount: facts.fat,
      unit: nutrientUnits.fat,
    });
  }

  if (facts.carbs) {
    nutrients.push({
      id: 'carbs',
      amount: facts.carbs,
      unit: nutrientUnits.carbs,
    });
  }

  if (facts.protein) {
    nutrients.push({
      id: 'protein',
      amount: facts.protein,
      unit: nutrientUnits.protein,
    });
  }

  if (facts.saturatedFat) {
    nutrients.push({
      id: 'satFat',
      amount: facts.saturatedFat,
      unit: nutrientUnits.satFat,
    });
  }

  if (facts.transFat) {
    nutrients.push({
      id: 'transFat',
      amount: facts.transFat,
      unit: nutrientUnits.fat,
    });
  }

  if (facts.cholesterol) {
    nutrients.push({
      id: 'cholesterol',
      amount: facts.cholesterol,
      unit: nutrientUnits.cholesterol,
    });
  }

  if (facts.sugars) {
    nutrients.push({
      id: 'sugars',
      amount: facts.sugars,
      unit: nutrientUnits.sugars,
    });
  }

  if (facts.sugarAlcohol) {
    nutrients.push({
      id: 'sugarAlcohol',
      amount: facts.sugarAlcohol,
      unit: nutrientUnits.sugarAlcohol,
    });
  }

  if (facts.dietaryFiber) {
    nutrients.push({
      id: 'fiber',
      amount: facts.dietaryFiber,
      unit: nutrientUnits.fiber,
    });
  }

  if (facts.sodium) {
    nutrients.push({
      id: 'sodium',
      amount: facts.sodium,
      unit: nutrientUnits.sodium,
    });
  }

  const foodItems: FoodItem = {
    nutrients: nutrients,
    name: '',
    entityType: 'user-food',
    computedWeight: {
      unit: facts.servingSizeUnit ?? 'g',
      value: facts.servingSizeGram ?? 0,
    },
    iconId: CUSTOM_USER_NUTRITION_FACT__PREFIX,
    selectedUnit: facts.servingSizeUnitName ?? '',
    selectedQuantity: facts.servingSizeQuantity ?? 0,
    refCode: '',
    servingSizes: [],
    servingUnits: [],
  };
  const customFood: CustomFood = {
    barcode: barcode,
    foodItems: [foodItems],
    ...foodItems,
    iconID: CUSTOM_USER_NUTRITION_FACT__PREFIX,
    uuid: getCustomFoodUUID(),
  };
  return customFood;
};

export const combineCustomFoodAndFoodLog = (
  customFood: CustomFood,
  foodLog: FoodLog
): FoodLog => {
  const mergedServingUnits = [...customFood.servingUnits];

  const mergedServingSizes = [...customFood.servingSizes];

  const uniqueServingUnits = mergedServingUnits.filter(
    (unit, index, self) =>
      index ===
      self.findIndex((t) => t.unit === unit.unit && t.mass === unit.mass)
  );
  const uniqueServingSizes = mergedServingSizes.filter(
    (unit, index, self) =>
      index ===
      self.findIndex(
        (t) => t.unit === unit.unit && t.quantity === unit.quantity
      )
  );

  return {
    ...foodLog,
    ...customFood,
    uuid: foodLog.uuid,
    refCode: foodLog.refCode,
    meal: foodLog.meal,
    eventTimestamp: foodLog.eventTimestamp,
    isOpenFood: foodLog.isOpenFood,
    refCustomFoodID: customFood?.uuid,
    servingUnits: uniqueServingUnits,
    servingSizes: uniqueServingSizes,
    selectedQuantity: customFood.selectedQuantity,
    selectedUnit: customFood.selectedUnit,
    computedWeight: customFood.computedWeight,
    longName: customFood.brandName ?? foodLog.longName,
  };
};

export const createFoodLogByCustomFood = (
  food: CustomFood,
  date?: Date,
  meal?: MealLabel
) => {
  const uuid: string = uuid4.v4() as string;
  const updateDate = date ?? new Date();
  const updateMeal = meal ?? getMealLog(updateDate, undefined);
  const foodLog: FoodLog = {
    ...food,
    eventTimestamp: convertDateToDBFormat(updateDate),
    meal: updateMeal,
    uuid: uuid,
    longName: food?.brandName ?? food.barcode,
    refCode: food.uuid,
  };
  return foodLog;
};
export const createFoodLogByCustomRecipe = (
  food: CustomRecipe,
  date?: Date,
  meal?: MealLabel
) => {
  const updateDate = date ?? new Date();
  const updateMeal = meal ?? getMealLog(updateDate, undefined);
  const uuid: string = uuid4.v4() as string;

  const foodLog: FoodLog = {
    ...food,
    eventTimestamp: convertDateToDBFormat(updateDate),
    meal: updateMeal,
    uuid: uuid,
    refCode: food.uuid,
    refCustomFoodID: food.uuid,
  };
  return foodLog;
};
export const createFoodItemByFavorite = (food: FavoriteFoodItem) => {
  const foodItem: FoodItem = {
    ...food,
    nutrients: mergeNutrients(food.foodItems?.flatMap((i) => i.nutrients)),
    refCode: food.refCode ?? '',
    iconId: food?.iconID ?? food.foodItems[0].iconId,
    computedWeight: {
      value:
        food.computedWeight?.value ?? food.foodItems[0]?.computedWeight?.value,
      unit:
        food.computedWeight?.unit ?? food.foodItems[0]?.computedWeight?.unit,
    },
    entityType: 'user-food',
  };

  return foodItem;
};
