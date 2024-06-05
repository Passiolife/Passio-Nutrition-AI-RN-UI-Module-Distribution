import { useEffect, useState, useRef } from 'react';
import type { QuickSuggestion } from '../models/QuickSuggestion';
import { useServices } from '../contexts';
import { passioSuggestedFoods } from '../utils/V3Utils';
import { getLast30SaysQuickSuggestions, mealLabelByDate } from '../utils';
import type { FoodLog } from 'src/models';

export function useQuickSuggestion(foodLogs: FoodLog[]) {
  const services = useServices();
  const [quickSuggestedFoodItems, setQuickSuggestedFoodItem] = useState<
    QuickSuggestion[]
  >([]);

  const prePopulatedQuickScaRef = useRef<Array<QuickSuggestion>>([]);
  const last30DayQuickScanRef = useRef<Array<QuickSuggestion>>([]);

  const removeQuickSuggestion = (_suggestion: QuickSuggestion) => {};
  useEffect(() => {
    const initData = async () => {
      let quickSuggestions: QuickSuggestion[] = [];
      const meal = mealLabelByDate(new Date());
      const currentMealLogsNames = foodLogs
        .filter((o) => o.meal === meal)
        .flatMap((i) => i.name.toLowerCase());

      //Collect last 30 days data
      quickSuggestions = await getLast30SaysQuickSuggestions(meal, services);
      last30DayQuickScanRef.current = quickSuggestions;

      // Pre populate quick suggestions
      if (
        prePopulatedQuickScaRef.current.length === 0 &&
        last30DayQuickScanRef.current.length < 30
      ) {
        const prePopulatedQuickSuggestions = (
          await passioSuggestedFoods(meal)
        ).filter(
          (item): item is QuickSuggestion =>
            !!item &&
            last30DayQuickScanRef.current.find(
              (i) => i.foodName.toLowerCase() === item.foodName.toLowerCase()
            ) === undefined
        );

        prePopulatedQuickScaRef.current = prePopulatedQuickSuggestions;
      }

      quickSuggestions = [
        ...last30DayQuickScanRef.current,
        ...prePopulatedQuickScaRef.current,
      ];

      const dupedFoodNameQuickSuggestion = quickSuggestions
        .filter((i) => !currentMealLogsNames.includes(i.foodName.toLowerCase()))
        .slice(0, 30);

      setQuickSuggestedFoodItem(dupedFoodNameQuickSuggestion);
    };

    initData();
  }, [foodLogs, services]);

  return {
    quickSuggestedFoodItems,
    removeQuickSuggestion,
  };
}
