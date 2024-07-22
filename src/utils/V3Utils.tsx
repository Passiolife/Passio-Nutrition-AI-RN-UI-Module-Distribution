import {
  PassioIDEntityType,
  PassioSDK,
  type PassioFoodItem,
  type PassioNutrients,
  type UnitMass,
} from '@passiolife/nutritionai-react-native-sdk-v3';
import type {
  FoodItem,
  FoodLog,
  MealLabel,
  Nutrient,
  NutrientType,
  ServingSize,
  ServingUnit,
} from '../models';
import uuid4 from 'react-native-uuid';
import { convertDateToDBFormat } from './DateFormatter';
import { getMealLog } from '../utils';
import type { PassioIngredient } from '@passiolife/nutritionai-react-native-sdk-v3/src';
import type { QuickSuggestion } from 'src/models/QuickSuggestion';
import type { DefaultNutrients } from '../screens/foodCreator/views/OtherNutritionFacts';

export const convertPassioFoodItemToFoodLog = (
  item: PassioFoodItem,
  logDate: Date | undefined,
  logMeal: MealLabel | undefined
): FoodLog => {
  const uuid: string = uuid4.v4() as string;
  const date = logDate ?? new Date();
  const meal = logMeal ?? getMealLog(date, undefined);

  const dateFormat = convertDateToDBFormat(date);

  const foodItem = item;

  let newFoodIngredient = (foodItem.ingredients ?? []).map(
    convertPassioIngredientToFoodItem
  );

  const selectedUnit = foodItem.amount.servingSizes?.find(
    (i) => i.unitName === foodItem?.amount.selectedUnit
  );

  if (selectedUnit === undefined) {
    foodItem.amount.selectedUnit = 'gram';
    foodItem.amount.selectedQuantity = foodItem.amount?.weight.value;
    newFoodIngredient.forEach((fi) => {
      fi.nutrients.forEach((i) => {
        i.amount =
          (foodItem.amount?.weight.value * i.amount) / fi.computedWeight.value;
      });
    });
  }

  const log: FoodLog = {
    name: foodItem.name,
    uuid: uuid,
    longName: foodItem.details,
    passioID: foodItem.refCode ?? foodItem.id,
    refCode: foodItem.refCode,
    eventTimestamp: dateFormat,
    isOpenFood: foodItem.isOpenFood,
    meal: meal,
    imageName: foodItem.iconId,
    iconID: foodItem.iconId,
    entityType: PassioIDEntityType.item,
    foodItems: newFoodIngredient,
    computedWeight: {
      unit: foodItem.amount.weight.unit,
      value: foodItem.amount.weight.value,
    },
    selectedUnit: foodItem.amount.selectedUnit,
    selectedQuantity: foodItem.amount.selectedQuantity,
    servingSizes: (foodItem.amount.servingSizes ?? []).map((i) => {
      const size: ServingSize = {
        quantity: i.quantity,
        unit: i.unitName,
      };
      return size;
    }),
    servingUnits: (foodItem.amount.servingUnits ?? []).map((i) => {
      const size: ServingUnit = {
        mass: i.value,
        unit: i.unitName,
      };
      return size;
    }),
  };
  return log;
};

function convertPassioIngredientToFoodItem(item: PassioIngredient): FoodItem {
  let passioIngredient = item;
  const selectedUnit = passioIngredient.amount.servingSizes?.find(
    (i) => i.unitName === passioIngredient?.amount.selectedUnit
  );
  if (selectedUnit === undefined) {
    passioIngredient.amount.selectedUnit = 'gram';
    passioIngredient.amount.selectedQuantity =
      passioIngredient.amount?.weight.value;
  }

  const nutrients = PassioSDK.getNutrientsOfPassioFoodItem(
    {
      ingredients: [passioIngredient],
      name: passioIngredient.name,
      iconId: passioIngredient.iconId,
      amount: passioIngredient.amount,
      weight: passioIngredient.weight,
      id: passioIngredient.id,
    },
    passioIngredient.amount.weight
  );
  const foodItem: FoodItem = {
    passioID: passioIngredient.refCode ?? passioIngredient.id,
    name: passioIngredient.name,
    imageName: passioIngredient.id,
    iconId: passioIngredient.iconId,
    entityType: PassioIDEntityType.item,
    computedWeight: {
      unit: passioIngredient.amount.weight.unit,
      value: passioIngredient.amount.weight.value,
    },
    nutrients: nutrientV3(nutrients),
    selectedUnit: passioIngredient.amount.selectedUnit,
    selectedQuantity: passioIngredient.amount.selectedQuantity,
    servingSizes: (passioIngredient.amount.servingSizes ?? []).map((i) => {
      const size: ServingSize = {
        quantity: i.quantity,
        unit: i.unitName,
      };
      return size;
    }),
    servingUnits: (passioIngredient.amount.servingUnits ?? []).map((i) => {
      const size: ServingUnit = {
        mass: i.value,
        unit: i.unitName,
      };
      return size;
    }),
  };
  return foodItem;
}

function nutrientV3(food: PassioNutrients): Nutrient[] {
  if (food === undefined) {
    return [];
  }
  let key: keyof typeof food;
  let nutrients: Nutrient[] = [];
  for (key in food) {
    const amount = food[key] as unknown as UnitMass;
    nutrients.push({
      id: key as NutrientType,
      amount: amount.value,
      unit: amount.unit,
    });
  }

  return nutrients;
}

export const round = (value: number) => {
  return value < 1 ? Number(value.toFixed(2)) : Math.round(value);
};
export const round2Digit = (value: number) => {
  return value.toFixed(2);
};

export const updateServing = (
  foodLog: FoodLog,
  { mass, unit }: ServingUnit
) => {
  const { computedWeight, foodItems } = foodLog;
  const servingWeight =
    computedWeight?.value ?? foodItems[0]?.computedWeight.value;
  const defaultWeight = servingWeight ?? 0;
  const newQuantity = Number(defaultWeight / mass);
  foodLog.selectedQuantity = Number(
    newQuantity < 10 ? newQuantity.toFixed(2) : Math.round(newQuantity)
  );
  foodLog.selectedUnit = unit;
  return foodLog;
};

export const updateQuantityOfFoodLog = (foodLog: FoodLog, qty: number) => {
  const copyOfFoodLog = { ...foodLog };

  if (qty > 0) {
    const oldQuantity = copyOfFoodLog.selectedQuantity;
    const oldWeight =
      copyOfFoodLog.computedWeight?.value ??
      copyOfFoodLog.foodItems[0]?.computedWeight.value ??
      0;
    const oldServingUnit =
      copyOfFoodLog.computedWeight?.unit ??
      copyOfFoodLog.foodItems[0]?.computedWeight.unit ??
      'g';

    const newWeight = (oldWeight * qty) / oldQuantity;
    copyOfFoodLog.computedWeight = {
      value: newWeight,
      unit: oldServingUnit,
    };
    copyOfFoodLog.selectedQuantity = qty;

    copyOfFoodLog.foodItems.forEach((oi) => {
      const newComputedWeight = {
        value:
          (newWeight *
            (oi.computedWeight.value > 0 ? oi.computedWeight.value : 1)) /
          oldWeight,
        unit: oi.computedWeight.unit,
      };
      oi.selectedQuantity =
        (newWeight * (oi.selectedQuantity > 0 ? oi.selectedQuantity : 1)) /
        oldWeight;
      oi.computedWeight = newComputedWeight;
      oi.nutrients.forEach((ni) => {
        ni.amount = (newWeight * ni.amount) / oldWeight;
      });
    });
  }
  return copyOfFoodLog;
};

export const passioSuggestedFoods = async (
  meal: MealLabel
): Promise<(QuickSuggestion | null)[]> => {
  const list = await PassioSDK.fetchSuggestions(meal);
  return await Promise.all(
    (list ?? []).map(async (item) => {
      const quickSuggestion: QuickSuggestion = {
        foodName: item.foodName,
        passioFoodDataInfo: item,
        iconID: item.iconID,
      };
      return quickSuggestion;
    })
  );
};

export const macroNutrientPercentages = (
  carbsG?: number,
  fatG?: number,
  proteinG?: number
) => {
  // Calculate calories contributed by each macro nutrient
  let carbsContributeOfCalories = (carbsG ?? 0) * 4;
  let fatContributeOfCalories = (fatG ?? 0) * 9;
  let proteinContributeOfCalories = (proteinG ?? 0) * 4;

  // Calculate total calories from macro nutrients
  let totalMacroNutrientCalories =
    carbsContributeOfCalories +
    fatContributeOfCalories +
    proteinContributeOfCalories;

  // Calculate percentages
  let carbsPercentage =
    (carbsContributeOfCalories / totalMacroNutrientCalories) * 100;
  let fatPercentage =
    (fatContributeOfCalories / totalMacroNutrientCalories) * 100;
  let proteinPercentage =
    (proteinContributeOfCalories / totalMacroNutrientCalories) * 100;

  return {
    carbsPercentage: isNaN(carbsPercentage) ? 0 : carbsPercentage,
    fatPercentage: isNaN(fatPercentage) ? 0 : fatPercentage,
    proteinPercentage: isNaN(proteinPercentage) ? 0 : proteinPercentage,
  };
};

export function sumNutrients(
  nutrients: DefaultNutrients[]
): DefaultNutrients[] {
  const nutrientMap = nutrients.reduce(
    (acc, nutrient) => {
      if (nutrient.value !== undefined) {
        acc[nutrient.label] = (acc[nutrient.label] || 0) + nutrient.value;
      }
      return acc;
    },
    {} as Record<NutrientType, number>
  );

  return Object.keys(nutrientMap).map((label) => ({
    label: label as NutrientType,
    value: nutrientMap[label as NutrientType],
  }));
}
