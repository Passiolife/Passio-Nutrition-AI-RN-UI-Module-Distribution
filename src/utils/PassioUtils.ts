import { type NutrientType, unitForNutrient } from '../models/Nutrient';
import {
  type PassioFoodItem,
  type PassioID,
  type PassioIDAttributes,
  type PassioRecipe,
  PassioSDK,
  type UnitMass,
} from '@passiolife/nutritionai-react-native-sdk-v3/src/sdk/v2';
import type {
  FavoriteFoodItem,
  FoodItem,
  FoodLog,
  FoodRecipe,
  MealLabel,
  Nutrient,
  NutrientUnit,
  Recipe,
  ServingSize,
  ServingUnit,
} from '../models';
import { convertDateToDBFormat } from './DateFormatter';
import { calculateComputedWeightAmount } from '../screens';
import { ActivityLevelType } from '../models/ActivityLevel';
import type { ScreenType } from '../models/ScreenType';
import { getLogToDate, getMealLog } from './ScaningUtils';
import { AsyncStorageHelper } from './AsyncStorageHelper';
import uuid4 from 'react-native-uuid';
import type { RefCode } from '@passiolife/nutritionai-react-native-sdk-v3';

const ENTITY_TYPE_RECIPE_PREFIX = 'user-recipe';

export async function getAlternateFoodItems(
  passioIDAttributes: PassioIDAttributes
): Promise<PassioIDAttributes[]> {
  const childrenAttributes = passioIDAttributes.children.map(
    async ({ passioID }) => {
      return PassioSDK.getAttributesForPassioID(passioID);
    }
  );
  const siblingAttributes = passioIDAttributes.siblings.map(
    async ({ passioID }) => {
      return PassioSDK.getAttributesForPassioID(passioID);
    }
  );
  const parentAttributes = passioIDAttributes.parents.map(
    async ({ passioID }) => {
      return PassioSDK.getAttributesForPassioID(passioID);
    }
  );

  const combinedAttributes = [
    ...childrenAttributes,
    ...siblingAttributes,
    ...parentAttributes,
  ];

  const attrs = await Promise.all(combinedAttributes);
  return attrs.filter(notEmpty);
}

export async function getAttributesForPassioID(
  passioID: PassioID
): Promise<PassioIDAttributes | null> {
  return await PassioSDK.getAttributesForPassioID(passioID);
}

export function createFoodLogFromPassioIDAttributes(
  attributes: PassioIDAttributes,
  meal: MealLabel,
  date: Date,
  uuid: string = uuid4.v4() as string
): FoodLog {
  const dateFormat = convertDateToDBFormat(date);
  const { foodItem, recipe } = attributes;
  return {
    name: attributes.name,
    uuid: uuid,
    entityType: attributes.entityType,
    meal: meal,
    refCode: '',
    eventTimestamp: dateFormat,
    selectedQuantity: convertSelectedQuantity(foodItem ?? recipe),
    selectedUnit: convertSelectedUnit(foodItem ?? recipe),
    foodItems: foodItemsFromAttributes(attributes),
    servingUnits: convertServingUnits(foodItem ?? recipe),
    servingSizes: convertServingSizes(foodItem ?? recipe),
  };
}

export function createFoodLogFromFavoriteFoodItem(
  favoriteFoodItem: FavoriteFoodItem,
  meal: MealLabel,
  date: Date
): FoodLog {
  const dateFormat = convertDateToDBFormat(date);
  return {
    ...favoriteFoodItem,
    uuid: uuid4.v4() as string,
    eventTimestamp: dateFormat,
    meal: meal,
  };
}

function convertServingSizes(
  foodData: PassioFoodItem | PassioRecipe | undefined
): ServingSize[] {
  if (!foodData) {
    return [];
  }
  return foodData.servingSizes.map((value) => {
    return { quantity: value.quantity, unit: value.unitName };
  });
}

function convertSelectedQuantity(
  foodData: PassioFoodItem | PassioRecipe | undefined
): number {
  if (!foodData) {
    return 0;
  }
  return foodData.selectedQuantity;
}

function convertSelectedUnit(
  foodData: PassioFoodItem | PassioRecipe | undefined
): string {
  if (!foodData) {
    return '-';
  }
  return foodData.selectedUnit;
}

function convertServingUnits(
  foodData: PassioFoodItem | PassioRecipe | undefined
): ServingUnit[] {
  if (!foodData) {
    return [];
  }
  return foodData.servingUnits.map((value) => {
    return { mass: value.value, unit: value.unitName };
  });
}

export function foodItemsFromAttributes({
  foodItem,
  recipe,
}: PassioIDAttributes): FoodItem[] {
  if (foodItem) {
    return [convertPassioFoodItem(foodItem)];
  } else if (recipe) {
    return recipe.foodItems.map(convertPassioFoodItem);
  } else {
    return [];
  }
}

export function convertPassioFoodItem(foodItem: PassioFoodItem): FoodItem {
  return {
    ...foodItem,
    refCode: '',
    servingSizes: convertServingSizes(foodItem),
    servingUnits: convertServingUnits(foodItem),
    nutrients: nutrientsFromFoodItem(foodItem),
  };
}

export function convertPassioIDAttributesToFoodItem(
  passioIDAttributes: PassioIDAttributes
): FoodItem {
  if (passioIDAttributes.foodItem) {
    return {
      ...convertPassioFoodItem(<PassioFoodItem>passioIDAttributes.foodItem),
      name: passioIDAttributes.name,
    };
  } else {
    const servingUnits = [
      {
        unit: 'serving',
        mass: calculateServingMass(foodItemsFromAttributes(passioIDAttributes)),
      },
    ];
    const selectedQuantity = 1;
    const selectedUnit = 'serving';
    return {
      computedWeight: {
        unit: 'serving',
        value: calculateComputedWeightAmount(
          selectedQuantity,
          servingUnits,
          selectedUnit
        ),
      },
      entityType: passioIDAttributes.entityType,
      name: passioIDAttributes.name,
      refCode: '',
      nutrients: nutrientsFromFoodItem(passioIDAttributes.recipe),
      selectedUnit: selectedUnit,
      selectedQuantity: selectedQuantity,
      servingUnits: servingUnits,
      servingSizes: [
        {
          unit: 'serving',
          quantity: 1,
        },
      ],
    };
  }
}

export function convertPassioRecipe(recipe: PassioRecipe): FoodRecipe {
  return {
    ...recipe,
    servingSizes: convertServingSizes(recipe),
    servingUnits: convertServingUnits(recipe),
    ingredients: recipe.foodItems.map(convertPassioFoodItem),
  };
}

// Convert foodLogs Data Into  FavoriteFoodItem
export function convertFoodLogsToFavoriteFoodLog(
  name: string,
  foodLog: FoodLog
): FavoriteFoodItem {
  return {
    ...foodLog,
    name: name,
    uuid: uuid4.v4() as string,
  };
}

// getting nutrient from passio food item
function nutrientsFromFoodItem(
  food: PassioFoodItem | PassioRecipe | undefined
): Nutrient[] {
  if (food === undefined) {
    return [];
  }
  let key: keyof typeof food;
  let nutrients: Nutrient[] = [];
  for (key in food) {
    const unit: NutrientUnit | undefined = unitForNutrient(key as NutrientType);
    if (unit !== undefined) {
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

function notEmpty<TValue>(value: TValue | null | undefined): value is TValue {
  return value !== null && value !== undefined;
}
export function calculateServingMass(foodItems: FoodItem[]): number {
  let servingMass = 0;
  foodItems.forEach((foodItem) => {
    servingMass =
      servingMass +
      calculateComputedWeightAmount(
        foodItem.selectedQuantity,
        foodItem.servingUnits,
        foodItem.selectedUnit
      );
  });
  return servingMass;
}

export function createFoodLogFromRecipe(
  recipe: Recipe,
  meal: MealLabel,
  date: Date,
  _passioID?: PassioID
): FoodLog {
  const uuid: string = uuid4.v4() as string;
  return {
    eventTimestamp: convertDateToDBFormat(date),
    foodItems: recipe.ingredients,
    meal: meal,
    entityType: ENTITY_TYPE_RECIPE_PREFIX,
    uuid: uuid,
    name: recipe.name,
    selectedUnit: 'serving',
    selectedQuantity: 1,
    servingUnits: [
      {
        unit: 'grams',
        mass: 1,
      },
      {
        unit: 'serving',
        mass: calculateServingMass(recipe.ingredients),
      },
    ],
    servingSizes: [
      {
        unit: 'grams',
        quantity: 100,
      },
      {
        unit: 'serving',
        quantity: 1,
      },
    ],
  };
}

export function getActivityLevels(): Array<ActivityLevelType> {
  return [
    ActivityLevelType.notActive,
    ActivityLevelType.lightlyActive,
    ActivityLevelType.moderatelyActive,
    ActivityLevelType.active,
  ];
}

/**
 * Provide data in metric unit system
 * height in meter
 * weight in kg
 * age in number
 * gender male | female
 */
export function getBMR(
  age: number,
  height: number,
  weight: number,
  gender: 'male' | 'female'
) {
  if (gender === 'male') {
    return 10 * weight + 6.25 * height - 5 * age + 5; // Kg, cm
  } else {
    return 10 * weight + 6.25 * height - 5 * age - 161; // Kg, cm
  }
}

/**
 * Provide data in metric unit system
 * height in meter
 * weight in kg
 * age in number
 * gender male | female
 */
export function calculateBMR(
  age: number,
  height: number,
  weight: number,
  gender: 'male' | 'female',
  level: ActivityLevelType
): number {
  const bmr = getBMR(age, height, weight, gender);
  switch (level) {
    case ActivityLevelType.notActive:
      return bmr * 1.2;
    case ActivityLevelType.lightlyActive:
      return bmr * 1.375;
    case ActivityLevelType.moderatelyActive:
      return bmr * 1.55;
    case ActivityLevelType.active:
      return bmr * 1.725;
  }
}
/**
 *
 * @param passioID : string
 * @param screen: quickScan = 'quickScan', 'multiScan', 'search', 'recipe', 'mealLogScreen'
 * store foodItem of passioId and screen in local storage for analytics ..
 */

export async function recordAnalyticsFoodLogs({
  id,
  screen,
  foodLog,
}: {
  id: RefCode | string;
  screen: ScreenType;
  foodLog?: FoodLog;
}) {
  /**
   *  Getting store analytics food log's and increase engagement if passioId and screen match in result
   */
  const storedAnalyticsFoodLogs =
    await AsyncStorageHelper.getAnalyticsFoodLogs();
  const index = storedAnalyticsFoodLogs.findIndex(
    (data) => data.id === id && data.screenType === screen
  );
  let NOT_FOUND = -1;
  if (index === NOT_FOUND) {
    storedAnalyticsFoodLogs.push({
      id: id,
      foodLog: foodLog,
      screenType: screen,
      engagement: 1,
    });
  } else {
    const previousItem = storedAnalyticsFoodLogs[index];
    if (previousItem) {
      storedAnalyticsFoodLogs[index] = {
        ...previousItem,
        engagement: previousItem?.engagement ?? 0 + 1,
      };
    }
  }
  await AsyncStorageHelper.setAnalyticsFoodLogs(storedAnalyticsFoodLogs);
}

export async function createFoodLogFromPassioId(
  passioId: PassioID,
  date: Date | undefined,
  mealLabel: MealLabel | undefined
): Promise<FoodLog> {
  const attribute = await getAttributesForPassioID(passioId);
  if (attribute !== null) {
    return createFoodLogFromPassioIDAttributes(
      attribute,
      getMealLog(getLogToDate(date, mealLabel), mealLabel),
      getLogToDate(date, mealLabel)
    );
  } else {
    return Promise.reject('Attribute not found');
  }
}

export function isRecipe(passioID: PassioID) {
  return passioID.startsWith(ENTITY_TYPE_RECIPE_PREFIX);
}
