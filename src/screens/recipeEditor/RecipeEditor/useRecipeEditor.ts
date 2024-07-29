import type { FoodItem, FoodLog, MealLabel, Recipe } from '../../../models';
import {
  createFoodLogFromRecipe,
  getLogToDate,
  getMealLog,
} from '../../../utils';
import { useEffect, useMemo, useState } from 'react';

import type { PassioID } from '@passiolife/nutritionai-react-native-sdk-v3/src/sdk/v2';
import { totalNutrientsOfFoodItems } from '../../../models';
import { useServices } from '../../../contexts';
import uuid from 'react-native-uuid';

interface MacroValues {
  calories: number;
  carbs: number;
  fat: number;
  protein: number;
}

export function useRecipeEditor(
  recipe?: Recipe,
  logToDate?: Date,
  logToMeal?: MealLabel
) {
  const services = useServices();

  const [ingredients, setIngredients] = useState<FoodItem[]>([]);
  const [recipeName, setRecipeName] = useState('');

  const [isOpenActionSheet, setIsOpenActionSheet] = useState(false);
  const [totalServings, setTotalServings] = useState<number>(
    recipe?.totalServings ?? 0
  );

  const macrosPerServing = useMemo<MacroValues>(() => {
    if (totalServings <= 0) {
      return { calories: 0, carbs: 0, fat: 0, protein: 0 };
    }
    const { calories, carbs, fat, protein } =
      totalNutrientsOfFoodItems(ingredients);
    return {
      calories: (calories || 0) / totalServings,
      carbs: (carbs || 0) / totalServings,
      fat: (fat || 0) / totalServings,
      protein: (protein || 0) / totalServings,
    };
  }, [ingredients, totalServings]);

  useEffect(() => {
    if (recipe) {
      setIngredients(recipe.ingredients);
      setRecipeName(recipe.name);
      setTotalServings(recipe.totalServings);
    }
  }, [recipe]);

  const openActionSheet = () => {
    setIsOpenActionSheet(true);
  };

  const updateIngredientsItem = (foodItem: FoodItem) => {
    setIngredients(
      addOrUpdateIngredients(foodItem.refCode, foodItem, ingredients)
    );
  };
  const deleteIngredientsItem = (foodItem: FoodItem) => {
    setIngredients(deleteIngredient(foodItem.refCode, ingredients));
  };

  const updateRecipeName = (name: string) => {
    setRecipeName(name);
  };
  const updateTotalServings = (totalServing: number) => {
    setTotalServings(totalServing);
  };

  async function saveRecipe() {
    await services.dataService.saveRecipe(createUpdatedRecipe());
  }

  async function deleteRecipe() {
    await services.dataService.deleteRecipe(createUpdatedRecipe().uuid);
  }

  async function saveRecipeAndConvertLog(): Promise<FoodLog> {
    await saveRecipe();
    return convertRecipeToFoodLog(createUpdatedRecipe(), logToDate, logToMeal);
  }

  function convertRecipeToFoodLog(
    logRecipe: Recipe,
    logToDateForRecipe?: Date,
    logToMealRecipe?: MealLabel
  ): FoodLog {
    const date = getLogToDate(logToDateForRecipe, logToMealRecipe);
    const meal = getMealLog(date, logToMealRecipe);
    return createFoodLogFromRecipe(logRecipe, meal, date);
  }

  function createUpdatedRecipe(): Recipe {
    return {
      ingredients: ingredients,
      totalServings: totalServings,
      name: recipeName,
      uuid: recipe?.uuid ?? uuid.v4(),
    } as Recipe;
  }

  const onCloseActionSheet = () => {
    setIsOpenActionSheet(false);
  };

  function deleteIngredient(
    refCode: PassioID,
    foodItems: FoodItem[]
  ): FoodItem[] {
    return foodItems.filter((value) => value.refCode !== refCode);
  }

  function addOrUpdateIngredients(
    refCode: PassioID,
    foodItem: FoodItem,
    foodItems: FoodItem[]
  ): FoodItem[] {
    return [...foodItems.filter((o) => o.refCode !== refCode), { ...foodItem }];
  }

  return {
    recipeName,
    totalServings,
    isOpenActionSheet,
    ingredients,
    macrosPerServing,
    openActionSheet,
    onCloseActionSheet,
    updateIngredientsItem,
    deleteIngredientsItem,
    updateRecipeName,
    updateTotalServings,
    saveRecipe,
    saveRecipeAndConvertLog,
    deleteRecipe,
  };
}
