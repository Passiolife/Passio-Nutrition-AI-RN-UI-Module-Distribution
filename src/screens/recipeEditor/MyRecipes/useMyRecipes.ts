import { useIsFocused } from '@react-navigation/native';
import type { FoodLog, MealLabel, Recipe } from '../../../models';
import { useCallback, useState } from 'react';
import { useServices } from '../../../contexts';
import {
  createFoodLogFromRecipe,
  getLogToDate,
  getMealLog,
} from '../../../utils';

export function useMyRecipes(
  logToDate: Date | undefined,
  logToMeal: MealLabel | undefined
) {
  const services = useServices();
  const [recipes, setRecipes] = useState<Recipe[]>([]);
  const [recipesForFilter, setRecipesForFilter] = useState<Recipe[]>([]);
  const [searchQuery, setSearchQuery] = useState<string>('');
  const reloadData = useCallback(async () => {
    const recipesData = await services.dataService.getRecipes();
    setRecipes(recipesData);
    setRecipesForFilter(recipesData);
  }, [services.dataService]);

  const isFocused = useIsFocused();
  if (isFocused) {
    reloadData();
  }

  const onSearchRecipe = async (q: string) => {
    if (q.length > 0) {
      setSearchQuery(q);
      let searchedRecipe = recipesForFilter.filter((item) =>
        item.name.toLowerCase().includes(q.toLowerCase())
      );
      setRecipes(searchedRecipe);
    } else {
      refreshRecipes();
      clearSearchResult();
    }
  };

  const refreshRecipes = useCallback(async () => {
    setRecipes(recipesForFilter);
  }, [recipesForFilter]);

  const convertRecipeToFoodLog = (recipe: Recipe): FoodLog => {
    const date = getLogToDate(logToDate, logToMeal);
    const meal = getMealLog(date, logToMeal);
    return createFoodLogFromRecipe(recipe, meal, date);
  };

  const clearSearchResult = useCallback(() => {
    setSearchQuery('');
    refreshRecipes();
  }, [refreshRecipes]);

  const deleteRecipe = useCallback(
    async (item: Recipe) => {
      await services.dataService.deleteRecipe(item.uuid);
      const filtered = recipes.filter((value) => value.uuid !== item.uuid);
      setRecipes(filtered);
    },
    [recipes, services.dataService]
  );

  return {
    recipes,
    onSearchRecipe,
    searchQuery,
    clearSearchResult,
    refreshRecipes,
    convertRecipeToFoodLog,
    deleteRecipe,
  };
}
