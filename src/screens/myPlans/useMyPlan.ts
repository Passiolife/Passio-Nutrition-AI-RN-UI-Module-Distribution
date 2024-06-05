import { useState } from 'react';

export type MyPlanTab = 'MealPlan' | 'Suggestion';

export function useMyPlan() {
  const [tab, updateTab] = useState<MyPlanTab>('MealPlan');

  const selectSuggestion = () => {
    updateTab('Suggestion');
  };

  const selectMealPlan = () => {
    updateTab('MealPlan');
  };

  return {
    tab,
    selectSuggestion,
    selectMealPlan,
  };
}
