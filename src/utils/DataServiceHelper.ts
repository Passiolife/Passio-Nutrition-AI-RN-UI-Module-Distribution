import { convertToNextMidnight, convertToPreviousMidnight } from './DateUtils';
import type { Services } from '../contexts';
import {
  calculateDailyMacroNutrition,
  calculateTargetNutritionProfile,
} from '../screens';

export async function getMealLogsForDate(date: Date, services: Services) {
  return await services.dataService.getMealLogs(
    convertToPreviousMidnight(date),
    convertToNextMidnight(date)
  );
}

export async function getWatersForDate(date: Date, services: Services) {
  return await services.dataService.getWaters(
    convertToPreviousMidnight(date),
    convertToNextMidnight(date)
  );
}

export async function getWeightForDate(date: Date, services: Services) {
  return await services.dataService.getWeight(
    convertToPreviousMidnight(date),
    convertToNextMidnight(date)
  );
}
export async function getLatestWeight(services: Services) {
  return await services.dataService.getLatestWeight();
}

export async function getMealLogsFormDateToDate(
  start: Date,
  end: Date,
  services: Services
) {
  return await services.dataService.getMealLogs(
    convertToPreviousMidnight(start),
    convertToNextMidnight(end)
  );
}

export async function getNutritionProfile(services: Services) {
  return await services.dataService.getNutritionProfile();
}

export const getFavoriteFoodItems = (services: Services) => {
  return services.dataService.getFavoriteFoodItems();
};

export const getDailyMacrosProgress = async (
  startDate: Date,
  endDate: Date,
  service: Services
) => {
  let [profile, foodLogs] = await Promise.all([
    service.dataService.getNutritionProfile(),
    service.dataService.getMealLogs(startDate, endDate),
  ]);

  return {
    ...calculateDailyMacroNutrition(foodLogs),
    ...calculateTargetNutritionProfile(profile),
  };
};
