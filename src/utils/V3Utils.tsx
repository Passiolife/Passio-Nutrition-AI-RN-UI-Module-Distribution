import {
  PassioIDEntityType,
  PassioSDK,
  type PassioFoodItem,
  type PassioNutrients,
  type UnitMass,
  ServingUnit as PassioServingUnit,
  ServingSize as PassioServingSize,
  PassioFoodAmount,
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
import { CUSTOM_USER_RECIPE__PREFIX } from '../screens/foodCreator/FoodCreator.utils';

export const convertPassioFoodItemToFoodLog = (
  item: PassioFoodItem,
  logDate: Date | undefined,
  logMeal: MealLabel | undefined,
  isRecipe?: boolean
): FoodLog => {
  const uuid: string = `${uuid4.v4() as string}`;
  const date = logDate ?? new Date();
  const meal = logMeal ?? getMealLog(date, undefined);

  const dateFormat = convertDateToDBFormat(date);

  const foodItem = item;

  let newFoodIngredient = (foodItem.ingredients ?? []).map((i) =>
    convertPassioIngredientToFoodItem(
      i,
      foodItem.ingredients && foodItem.ingredients?.length === 1
        ? foodItem.iconId
        : i.iconId
    )
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
    refCode: foodItem.refCode,
    eventTimestamp: dateFormat,
    isOpenFood: foodItem.isOpenFood,
    meal: meal,
    iconID: isRecipe ? CUSTOM_USER_RECIPE__PREFIX : foodItem.iconId,
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

function convertPassioIngredientToFoodItem(
  item: PassioIngredient,
  iconID?: string
): FoodItem {
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
      iconId:
        passioIngredient.iconId?.length > 0
          ? passioIngredient.iconId
          : (iconID ?? ''),
      amount: passioIngredient.amount,
      ingredientWeight: passioIngredient.weight,
      id: passioIngredient.id,
      refCode: '',
    },
    passioIngredient.amount.weight
  );
  const foodItem: FoodItem = {
    name: passioIngredient.name,
    refCode: passioIngredient.refCode ?? '',
    iconId:
      passioIngredient.iconId?.length > 0
        ? passioIngredient.iconId
        : (iconID ?? ''),
    entityType: PassioIDEntityType.item,
    barcode: passioIngredient?.metadata?.barcode,
    ingredientsDescription: passioIngredient?.metadata?.ingredientsDescription,
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
    if (key === 'weight') {
    } else {
      const amount = food[key] as unknown as UnitMass;
      nutrients.push({
        id: key as NutrientType,
        amount: amount.value,
        unit: amount.unit,
      });
    }
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

export function updateSlider(value: number): [number, number, number] {
  let sliderStep: number;
  let sliderMax: number;

  if (value < 5) {
    sliderStep = 0.5;
    sliderMax = 4.5;
  } else if (value <= 9) {
    sliderStep = 1;
    sliderMax = 9;
  } else if (value <= 49) {
    sliderStep = 1;
    sliderMax = 49;
  } else if (value <= 250) {
    sliderMax = 250;
    sliderStep = sliderMax / 50;
  } else {
    sliderMax = value;
    sliderStep = sliderMax / 50;
  }

  // let sliderSteps = Math.floor(sliderMax / sliderStep) + 1;
  if (sliderStep > 50) {
    sliderStep = 50;
  }

  return [0, sliderMax, sliderStep]; // min, max, step
}
export const sumOfAllPassioNutrients = (data: PassioNutrients[]) => {
  const summedNutrients: PassioNutrients = {
    weight: { unit: 'g', value: 0 },
  };

  data.forEach((nutrient) => {
    for (const key in nutrient) {
      let keys = key as NutrientType;
      if (nutrient[keys] && keys !== 'weight') {
        if (!summedNutrients[keys]) {
          summedNutrients[keys] = {
            unit: (nutrient[keys] as UnitMass)?.unit ?? '',
            value: (nutrient[keys] as UnitMass)?.value ?? 0,
          };
        } else {
          summedNutrients[keys]!.value += nutrient[keys]!.value;
        }
      }
      // disable
    }
  });

  return summedNutrients;
};
export const createRecipeUsingPassioFoodItem = (data: PassioFoodItem[]) => {
  const sum = data.reduce((acc, item) => acc + item.amount.weight.value, 0);
  let servingSizes: PassioServingSize[] = [
    {
      unitName: 'serving',
      quantity: 1,
    },
    {
      unitName: 'gram',
      quantity: sum,
    },
  ];

  let servingUnits: PassioServingUnit[] = [
    {
      unitName: 'serving',
      value: sum,
      unit: 'g',
    },
    {
      unitName: 'gram',
      value: 1,
      unit: 'g',
    },
  ];

  let amount: PassioFoodAmount = {
    selectedQuantity: 1,
    selectedUnit: 'serving',
    servingSizes: servingSizes,
    servingUnits: servingUnits,
    weight: {
      unit: 'g',
      value: sum,
    },
    weightGrams: sum,
  };

  let ingredients: PassioIngredient[] = [];

  data.map((i) => {
    if (i.ingredients) {
      const ingredient: PassioIngredient = {
        ...i.ingredients?.[0],
        amount: i.amount,
        iconId: i.iconId,
        name: i.name,
      };
      if (ingredient) {
        ingredients.push(ingredient);
      }
    }
  });

  const passioFoodItem: PassioFoodItem = {
    amount: amount,
    refCode: uuid4.v4() as unknown as string,
    ingredientWeight: {
      unit: 'g',
      value: sum,
    },
    name: '',
    ingredients: ingredients,
    iconId: '',
    id: uuid4.v4() as unknown as string,
  };

  return passioFoodItem;
};

export const isMissingNutrition = (item?: PassioFoodItem | null) => {
  if (!item) {
    return true;
  }

  const qty = item?.amount?.selectedQuantity;
  const selectedUnit = item?.amount?.selectedUnit;
  const weight = item?.amount?.weight?.value;
  const ingredients = item?.ingredients?.[0];

  const calories = ingredients?.referenceNutrients?.calories;
  const carbs = ingredients?.referenceNutrients?.carbs;
  const protein = ingredients?.referenceNutrients?.protein;
  const fat = ingredients?.referenceNutrients?.fat;

  return (
    !qty ||
    !selectedUnit ||
    !weight ||
    !ingredients ||
    !calories ||
    !carbs ||
    !protein ||
    !fat
  );
};

export const createBlankPassioFoodITem = (barcode?: string) => {
  const passioAmount: PassioFoodAmount = {
    weight: {
      unit: 'g',
      value: 10,
    },
    selectedUnit: 'gram',
    servingSizes: [
      {
        quantity: 1,
        unitName: 'gram',
      },
    ],
    servingUnits: [
      {
        unit: 'g',
        value: 100,
        unitName: 'gram',
      },
    ],
    selectedQuantity: 10,
  };
  const item: PassioFoodItem = {
    amount: passioAmount,
    name: '',
    iconId: '',
    refCode: '',
    ingredientWeight: passioAmount.weight,
    id: '',
    ingredients: [
      {
        amount: passioAmount,
        refCode: '',
        name: '',
        id: '',
        iconId: '',
        metadata: {
          barcode: barcode,
        },
        weight: passioAmount.weight,
        referenceNutrients: {
          weight: passioAmount.weight,
        },
      },
    ],
  };
  return item;
};

export const inValidInput = (s: string) => {
  return s.length === 0;
};
