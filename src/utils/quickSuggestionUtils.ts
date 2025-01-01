import { PassioSDK } from '@passiolife/nutritionai-react-native-sdk-v3';
import type { MealLabel } from '../models/MealLabel';
import type { QuickSuggestion } from '../models/QuickSuggestion';
import type { Services } from '../contexts';
import { substrateDate } from '../utils/DateUtils';
import { AsyncStorageHelper } from '../utils/AsyncStorageHelper';
import type { AnalyticsFoodLogs } from '../models/PassioAnalytics';
import type { FoodLog } from '../models';

export const createQuickSuggestionFromAnalyticsFoodLog = async (
  analyticsFoodLog: AnalyticsFoodLogs
): Promise<QuickSuggestion | null> => {
  const attribute = await PassioSDK.fetchFoodItemForRefCode(
    analyticsFoodLog.id
  );
  if (attribute === null) return null;
  return {
    refCode: analyticsFoodLog.id,
    iconID: attribute.iconId,
    foodName: attribute.name,
  } as QuickSuggestion;
};

export const getAllAnalyticQuickSuggestionRecords = async () => {
  const analyticsFoodLogs = await AsyncStorageHelper.getAnalyticsFoodLogs();
  const quickSuggestion = await Promise.all(
    analyticsFoodLogs
      // sort the data as engagement high
      .sort((dataA, dataB) => dataB.engagement - dataA.engagement)
      .reduce((previous: AnalyticsFoodLogs[], current) => {
        // avoid duplicate passioID
        const logs = previous.find(
          (item) =>
            item.id === current.id ||
            (item.foodLog &&
              current.foodLog &&
              item.foodLog?.name === current.foodLog?.name)
        );
        if (!logs) {
          return previous.concat([current]);
        } else {
          return previous;
        }
      }, [])
      .map(createQuickSuggestionFromAnalyticsFoodLog)
  );
  return quickSuggestion.filter((item) => item !== null) as QuickSuggestion[];
};

export async function getLast30SaysQuickSuggestions(
  foodMealLabel: MealLabel,
  service: Services
): Promise<Array<QuickSuggestion>> {
  const meals = await service.dataService.getMealLogs(
    substrateDate(30),
    new Date()
  );
  return orderFrequencySort(
    meals.filter((value) => {
      return value.meal.toLowerCase().includes(foodMealLabel.toLowerCase());
    })
  );
}

export function orderFrequencySort(items: FoodLog[]): QuickSuggestion[] {
  const frequencyMap: Map<string, number> = new Map();

  // Count frequencies of each item
  items.forEach((item) => {
    const itemName = item.name;
    frequencyMap.set(itemName, (frequencyMap.get(itemName) || 0) + 1);
  });

  // Sort items based on frequency
  const sortedItems = [...frequencyMap.entries()].sort((a, b) => b[1] - a[1]);

  // Extract items with highest frequency and remove duplicates
  const result: QuickSuggestion[] = [];
  const addedItems: Set<string> = new Set();

  sortedItems.forEach(([itemName]) => {
    if (!addedItems.has(itemName)) {
      const find = items.find((i) => i.name === itemName);
      if (find) {
        result.push({
          refCode: find.refCode ?? find.refCode,
          foodLog: find,
          foodName: find.name,
          iconID: find.iconID ?? '',
        });
      }
      addedItems.add(itemName);
    }
  });

  return result;
}
