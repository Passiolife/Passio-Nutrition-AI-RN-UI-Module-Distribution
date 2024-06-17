import {
  PassioAdvisorFoodInfo,
  PassioSDK,
} from '@passiolife/nutritionai-react-native-sdk-v3';
import type { FoodLog, MealLabel } from '..';
import { getLogToDate, mealLabelByDate } from './ScaningUtils';
import { convertPassioFoodItemToFoodLog } from './V3Utils';

export const createFoodLogUsingFoodDataInfo = async (
  foods: PassioAdvisorFoodInfo[],
  date?: Date,
  mealLabel?: MealLabel
) => {
  const logToDate = getLogToDate(date, mealLabel);
  const meal = date === undefined ? mealLabelByDate(logToDate) : mealLabel;
  const foodLogs: FoodLog[] = [];

  for (const item of foods) {
    if (item && item.foodDataInfo) {
      const foodItem = await PassioSDK.fetchFoodItemForDataInfo(
        item.foodDataInfo
      );
      if (foodItem) {
        const foodLog = convertPassioFoodItemToFoodLog(
          foodItem,
          logToDate,
          meal
        );
        foodLogs.push(foodLog);
      }
    }
  }

  return foodLogs;
};
