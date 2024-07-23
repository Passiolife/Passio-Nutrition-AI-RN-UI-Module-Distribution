import { convertPassioFoodItemToFoodLog } from './../../utils/V3Utils';
import type { FoodItem, FoodLog } from '../../models';
import { useCallback, useState } from 'react';

import { content } from '../../constants/Content';
import { useBranding } from '../../contexts';
import { ShowToast } from '../../utils';
import {
  StackActions,
  useNavigation,
  useRoute,
  type RouteProp,
} from '@react-navigation/native';
import type { ParamList } from '../../navigaitons';
import type { StackNavigationProp } from '@react-navigation/stack';

export type EditRecipeScreenNavigationProps = StackNavigationProp<
  ParamList,
  'EditRecipeScreen'
>;

export function useEditRecipe() {
  const { params } = useRoute<RouteProp<ParamList, 'EditRecipeScreen'>>();
  const branding = useBranding();
  const navigation = useNavigation<EditRecipeScreenNavigationProps>();

  const [foodLog, setFoodLog] = useState<FoodLog>(params.foodLog);

  const recalculateFoodLogServing = useCallback((value: FoodLog) => {
    const updatedFoodLog = { ...value };
    const sum = updatedFoodLog.foodItems.reduce(
      (acc, item) => acc + item.computedWeight.value,
      0
    );
    updatedFoodLog.computedWeight = {
      value: sum,
      unit: 'g',
    };
    updatedFoodLog.selectedUnit = 'serving';
    updatedFoodLog.selectedQuantity = 1;
    updatedFoodLog.servingUnits = [
      {
        unit: 'serving',
        mass: sum,
      },
      {
        unit: 'gram',
        mass: 1,
      },
    ];
    if (updatedFoodLog.foodItems.length === 1) {
      updatedFoodLog.name = `${content.recipeWith} ${updatedFoodLog.name}`;
    }
    return updatedFoodLog;
  }, []);

  const addIngredient = useCallback(
    (foodItem: FoodItem) => {
      const updatedFoodLog = { ...foodLog };
      updatedFoodLog.foodItems.push(foodItem);
      setFoodLog(recalculateFoodLogServing(updatedFoodLog));
      ShowToast('Ingredient added successfully');
      navigation.goBack();
    },
    [foodLog, navigation, recalculateFoodLogServing]
  );

  const deleteIngredient = useCallback(
    (foodItem: FoodItem) => {
      const newFoodLog = {
        ...foodLog,
        foodItems: foodLog.foodItems.filter(
          (value) => value.refCode !== foodItem.refCode
        ),
      };
      setFoodLog(recalculateFoodLogServing(newFoodLog));
    },
    [foodLog, recalculateFoodLogServing]
  );

  const updateIngredient = useCallback(
    (foodLogObj: FoodItem) => {
      let updatedFoodItems = foodLog.foodItems.map((value) =>
        value.refCode === foodLogObj.refCode ? foodLogObj : value
      );
      let foodLogData: FoodLog = { ...foodLog, foodItems: updatedFoodItems };
      setFoodLog(recalculateFoodLogServing(foodLogData));
      navigation.goBack();
    },
    [foodLog, navigation, recalculateFoodLogServing]
  );

  const onUpdateFoodLog = useCallback((item: FoodLog) => {
    setFoodLog({ ...item });
  }, []);

  const onSavePress = async () => {
    try {
      params?.onSaveLogPress?.({ ...foodLog });
    } catch (e) {}
  };

  const onCancelPress = async () => {
    navigation.dispatch(StackActions.pop(2));
    params?.onCancelPress?.();
  };

  const onAddIngredientPress = () => {
    navigation.navigate('FoodSearchScreen', {
      onSaveData: (item) => {
        const foodItem = convertPassioFoodItemToFoodLog(
          item,
          new Date(),
          undefined
        ).foodItems[0];
        if (foodItem) {
          addIngredient(foodItem);
        }
      },
      from: 'Ingredient',
    });
  };

  const onEditIngredientPress = useCallback(
    (foodItem: FoodItem) => {
      navigation.navigate('EditIngredientScreen', {
        foodItem: foodItem,
        deleteIngredient: (food) => {
          deleteIngredient(food);
          navigation.goBack();
        },
        updateIngredient,
      });
    },
    [navigation, updateIngredient, deleteIngredient]
  );

  return {
    from: params.prevRouteName,
    branding,
    foodLog,
    deleteIngredient,
    onAddIngredientPress,
    onEditIngredientPress,
    onCancelPress,
    onSavePress,
    onUpdateFoodLog,
  };
}
