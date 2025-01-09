import {
  PassioAdvisorFoodInfo,
  PassioFoodItem,
} from '@passiolife/nutritionai-react-native-sdk-v3';
import type { FoodLog, MealLabel, Services, ServingUnit } from '..';
import { getLogToDate, mealLabelByDate } from './ScaningUtils';
import {
  convertPassioFoodItemToFoodLog,
  updateQuantityOfFoodLog,
} from './V3Utils';
import { PhotoLoggingResults } from '../screens/photoLoggingResult/usePhotoLogging';
import RNFS from 'react-native-fs';
import { generateCustomNutritionFactID } from '../screens/foodCreator/FoodCreator.utils';
import { Platform } from 'react-native';

export const createFoodLogUsingFoodDataInfo = async (
  foods: PhotoLoggingResults[],
  services: Services,
  date?: Date,
  mealLabel?: MealLabel
) => {
  const logToDate = getLogToDate(date, mealLabel);
  const meal = date === undefined ? mealLabelByDate(logToDate) : mealLabel;
  const foodLogs: FoodLog[] = [];

  for (const item of foods) {
    if (item && item.passioFoodItem) {
      const foodItem = item.passioFoodItem;
      if (foodItem) {
        const foodLog = convertPassioFoodItemToFoodLog(
          foodItem,
          logToDate,
          meal
        );
        let iconID = foodLog.iconID;
        let name = foodLog.name;

        if (!iconID && item.assets) {
          const uri =
            Platform.OS === 'android' ? `file://${item.assets}` : item.assets;
          const response = await RNFS.readFile(uri, 'base64');
          let id = generateCustomNutritionFactID();
          let customFoodImageID = await services.dataService.saveImage({
            id: id,
            base64: response,
          });
          iconID = customFoodImageID;
        }

        if (!name && item.resultType === 'nutritionFacts') {
          name = 'Scanned Nutrition Label';
        }

        foodLogs.push({ ...foodLog, iconID: iconID });
      }
    }
  }

  return foodLogs;
};

export const createFoodLogUsingWeightGram = (
  foodItem: PassioFoodItem,
  logToDate: Date,
  meal: MealLabel,
  _weightGram: number,
  _portionSize: string
) => {
  let foodLog = convertPassioFoodItemToFoodLog(foodItem, logToDate, meal);

  return foodLog;
};

export const createFoodLogUsingPortionSize = (
  foodItem: PassioFoodItem,
  logToDate: Date,
  meal: MealLabel,
  weightGram: number,
  portionSize: string
) => {
  const array = portionSize.split(' ');

  let qty = 1;
  let unit = '';

  const value = array[0];

  if (array.length > 1) {
    if (/^\d+$/.test(value)) {
      qty = Number(value);
      unit = array.slice(1, array.length).join('');
    } else {
      unit = array.slice(0, array.length).join('');
    }
  } else {
    unit = array[0];
  }

  let foodLog = convertPassioFoodItemToFoodLog(foodItem, logToDate, meal);

  let isUnitNotIncludeInServingUnits =
    foodItem?.amount.servingUnits?.filter(
      (i) => i.unitName?.toString() === unit?.toString()
    ).length === 0;

  let isDefaultSelectedUnitNotSame = foodLog.selectedUnit !== unit;

  let isUnitGram =
    qty > 0 &&
    (unit.toLowerCase() === 'g' ||
      unit.toLowerCase() === 'gram' ||
      unit.toLowerCase() === 'ml' ||
      unit.toLowerCase() === 'grams');

  // isUnitGram ? 1 : qty,
  if (isUnitNotIncludeInServingUnits || isDefaultSelectedUnitNotSame) {
    foodLog = recalculatedFoodLogPerQtyUnitWeight(
      foodLog,
      isUnitGram ? 1 : 1,
      'gram',
      weightGram
    );
  }

  // It's include but not default selected
  if (!isUnitNotIncludeInServingUnits && isDefaultSelectedUnitNotSame) {
    foodLog = updateFoodLogByServingUnits(
      foodLog,
      foodLog.servingUnits.find((i) => i.unit === unit)
    );
  }

  return foodLog;
};

export const recalculatedFoodLogPerQtyUnitWeight = (
  foodLog: FoodLog,
  qty: number,
  unit: string,
  weighGram: number
) => {
  const { computedWeight, foodItems } = foodLog;
  const servingWeight =
    computedWeight?.value ?? foodItems[0]?.computedWeight.value;
  const defaultWeight = servingWeight ?? 0;
  const newQuantity = Number(defaultWeight / Number(qty));
  foodLog.selectedQuantity = Number(newQuantity);
  foodLog.selectedUnit = unit;
  foodLog = updateQuantityOfFoodLog(foodLog, weighGram);
  return foodLog;
};

export const updateFoodLogByServingUnits = (
  foodLog: FoodLog,
  servingUnit?: ServingUnit
) => {
  if (servingUnit) {
    const { computedWeight, foodItems } = foodLog;
    const servingWeight =
      computedWeight?.value ?? foodItems[0]?.computedWeight.value;
    const defaultWeight = servingWeight ?? 0;
    const newQuantity = Number(defaultWeight / servingUnit.mass);
    foodLog.selectedQuantity = Number(
      newQuantity < 10 ? newQuantity.toFixed(2) : Math.round(newQuantity)
    );
    foodLog.selectedUnit = servingUnit.unit;
    return foodLog;
  } else {
    return foodLog;
  }
};

export const getUpdatedCaloriesOfPassioAdvisorFoodInfo = (
  passio: PassioAdvisorFoodInfo
) => {
  const npCalories = passio?.foodDataInfo?.nutritionPreview?.calories ?? 0;
  const npWeightQuantity =
    passio?.foodDataInfo?.nutritionPreview?.weightQuantity ?? 0;
  const ratio = npCalories / npWeightQuantity;
  const advisorInfoWeightGram = passio?.weightGrams ?? 0;
  const calories = ratio * advisorInfoWeightGram;

  return {
    calories: passio?.foodDataInfo?.nutritionPreview?.calories ?? calories,
    advisorInfoWeightGram: advisorInfoWeightGram,
  };
};

export function extractNumberAndString(input: string) {
  const regex = /(\d+)\s*(.*)/;
  const match = input.match(regex);

  if (match) {
    return {
      number: parseInt(match[1], 10),
      otherString: match[2],
    };
  } else {
    return null;
  }
}
