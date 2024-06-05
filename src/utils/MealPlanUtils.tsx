import { PassioSDK } from '@passiolife/nutritionai-react-native-sdk-v3/src/sdk/v2';
import { DateTime } from 'luxon';
import { ActionPlanType, type FoodLog } from '../models';
import type { MealPlan, Suggestion } from '../models/MealPlan';
import {
  createFoodLogFromPassioIDAttributes,
  getLogToDate,
  getMealLog,
} from '../utils';

const balanced =
  require('../assets/json/meal-plan-balanced.json') as MealPlan[];
const kidneyDisease =
  require('../assets/json/meal-plan-chronic-kidney-disease.json') as MealPlan[];
const pescatarian =
  require('../assets/json/meal-plan-pescatarian.json') as MealPlan[];
const healthyCureObesity =
  require('../assets/json/meal-plan-healthy-cure-obesity.json') as MealPlan[];
const preDiabetes =
  require('../assets/json/meal-plan-pre-diabetes.json') as MealPlan[];
const heartFailure =
  require('../assets/json/meal-plan-congestive-heart-failure.json') as MealPlan[];

const suggestions: Suggestion[] = require('../assets/json/food-suggestion.json');

const createFoodLogFromSuggestion = async (
  suggestion: Suggestion,
  logToDate: Date | undefined
): Promise<FoodLog | null> => {
  const attribute = await PassioSDK.getAttributesForPassioID(
    suggestion.passioID
  );
  if (attribute == null) return null;
  const date = getLogToDate(logToDate, suggestion.type);
  const meal = getMealLog(date, suggestion.type);
  const foodLog = createFoodLogFromPassioIDAttributes(attribute, meal, date);
  return foodLog;
};

const createFoodLogFrom = async (
  mealPlanDirectory: MealPlan,
  logToDate: Date | undefined
): Promise<FoodLog | null> => {
  const attribute = await PassioSDK.getAttributesForPassioID(
    mealPlanDirectory.passioID
  );
  if (attribute == null) return null;
  const date = getLogToDate(logToDate, mealPlanDirectory.type);
  const meal = getMealLog(date, mealPlanDirectory.type);
  const foodLog = createFoodLogFromPassioIDAttributes(attribute, meal, date);
  foodLog.name = mealPlanDirectory.name;
  return foodLog;
};

export const getMealDay = (date: Date): number => {
  const diff = DateTime.fromJSDate(date).diff(DateTime.fromJSDate(new Date()), [
    'years',
    'months',
    'days',
  ]);
  const mealDay = Number((diff.days % 14).toFixed(0));
  return Math.abs(mealDay) + 1;
};

export const getDayMealPlanFoods = async (
  day: number,
  loggedDate: Date,
  actionPlan: ActionPlanType
): Promise<FoodLog[]> => {
  const createFoodLog = async (mealPlanDirectory: MealPlan) => {
    return createFoodLogFrom(mealPlanDirectory, loggedDate);
  };
  switch (actionPlan) {
    case ActionPlanType.balanced: {
      const results = await Promise.all(
        balanced.filter((item) => item.day === day).map(createFoodLog)
      );
      return results.filter((item) => item !== null) as FoodLog[];
    }
    case ActionPlanType.chronicKidneyDisease: {
      const results = await Promise.all(
        kidneyDisease.filter((item) => item.day === day).map(createFoodLog)
      );
      return results.filter((item) => item !== null) as FoodLog[];
    }
    case ActionPlanType.congestiveHeartFailure: {
      const results = await Promise.all(
        heartFailure.filter((item) => item.day === day).map(createFoodLog)
      );
      return results.filter((item) => item !== null) as FoodLog[];
    }
    case ActionPlanType.cureObesity: {
      const results = await Promise.all(
        healthyCureObesity.filter((item) => item.day === day).map(createFoodLog)
      );
      return results.filter((item) => item !== null) as FoodLog[];
    }
    case ActionPlanType.type2Diabetes: {
      const results = await Promise.all(
        preDiabetes.filter((item) => item.day === day).map(createFoodLog)
      );
      return results.filter((item) => item !== null) as FoodLog[];
    }
    case ActionPlanType.vegetarian: {
      const results = await Promise.all(
        pescatarian.filter((item) => item.day === day).map(createFoodLog)
      );
      return results.filter((item) => item !== null) as FoodLog[];
    }
    default:
      return [];
  }
};

export const getSuggestions = async (
  date: Date | undefined
): Promise<FoodLog[]> => {
  const createFoodLog = async (item: Suggestion) => {
    return createFoodLogFromSuggestion(item, date);
  };

  const results = await Promise.all(suggestions.map(createFoodLog));
  return results.filter((item) => item !== null) as FoodLog[];
};
