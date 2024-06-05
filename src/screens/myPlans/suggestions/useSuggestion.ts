import { useEffect, useState } from 'react';
import { useServices } from '../../../contexts';
import type { FoodLog, MealLog } from '../../../models';
import { getSuggestions } from '../../../utils/MealPlanUtils';
import { useNavigation } from '@react-navigation/native';
import type { MealPlanScreenNavigationProps } from '../MyPlanScreen';

export function useSuggestion(logToDate: Date | undefined) {
  const services = useServices();
  const [suggestedMealLogs, setSuggestedMealLogs] = useState<MealLog[]>([]);
  const navigation = useNavigation<MealPlanScreenNavigationProps>();

  useEffect(() => {
    async function init() {
      const suggestions = await getSuggestions(logToDate);
      const result = suggestions.reduce((previousValue: MealLog[], current) => {
        let dateGroup: MealLog | undefined = previousValue.find(
          (x) => x.title === current.meal
        );
        if (dateGroup === undefined) {
          dateGroup = { title: current.meal.toString(), data: [] } as MealLog;
          previousValue.push(dateGroup);
        }
        dateGroup.data.push(current);
        return previousValue;
      }, []);
      setSuggestedMealLogs(result);
    }
    init();
  }, [logToDate]);

  const onAddFoodLog = async (foodLog: FoodLog) => {
    await services.dataService.saveFoodLog(foodLog);
    navigation.pop();
  };

  return {
    suggestedMealLogs,
    onAddFoodLog,
  };
}
