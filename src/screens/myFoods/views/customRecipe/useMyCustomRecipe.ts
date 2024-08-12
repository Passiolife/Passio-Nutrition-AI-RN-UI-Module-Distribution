import { useState, useEffect, useRef } from 'react';
import { useBranding, useServices } from '../../../../contexts';
import type { CustomFood, CustomRecipe, FoodLog } from '../../../../models';
import { useIsFocused, useNavigation } from '@react-navigation/native';
import uuid4 from 'react-native-uuid';
import { getMealLog, ShowToast } from '../../../../utils';
import { convertDateToDBFormat } from '../../../../utils/DateFormatter';
import type { ScreenNavigationProps } from '../../useMyFoodScreen';
import { convertPassioFoodItemToFoodLog } from '../../../../utils/V3Utils';
import { Alert } from 'react-native';
import type { RecipeOptionsRef } from 'src/components';

export const useMyCustomRecipe = () => {
  const branding = useBranding();
  const services = useServices();
  const navigation = useNavigation<ScreenNavigationProps>();
  const recipeOptionsRef = useRef<RecipeOptionsRef>(null);

  const [customRecipes, setCustomRecipe] = useState<CustomRecipe[]>();
  const isFocused = useIsFocused();

  useEffect(() => {
    function init() {
      services.dataService.getCustomRecipes().then((data) => {
        setCustomRecipe(data);
      });
    }
    init();
  }, [services.dataService, isFocused]);

  const onDeletePress = (food: CustomFood) => {
    Alert.alert('Are you sure want to delete this from my recipe?', undefined, [
      {
        text: 'Cancel',
        style: 'cancel',
      },
      {
        text: 'Delete',
        onPress: () => {
          services.dataService.deleteCustomRecipe(food.uuid).then(() => {
            setCustomRecipe((i) => i?.filter((c) => c.uuid !== food.uuid));
          });
        },
        style: 'destructive',
      },
    ]);
  };

  const getFoodLog = (food: CustomFood) => {
    const date = new Date();
    const meal = getMealLog(date, undefined);
    const uuid: string = uuid4.v4() as string;

    const foodLog: FoodLog = {
      ...food,
      eventTimestamp: convertDateToDBFormat(date),
      meal: meal,
      uuid: uuid,
    };

    return foodLog;
  };

  const onLogPress = async (food: CustomFood) => {
    const log = getFoodLog(food);
    await services.dataService.saveFoodLog(log);
    ShowToast('Added your food into ' + log.meal);
  };

  const onEditCustomRecipePress = (
    food: CustomFood,
    isRequirePop?: boolean
  ) => {
    navigation.navigate('EditRecipeScreen', {
      recipe: food,
      prevRouteName: 'MyFood',
      onSaveLogPress: () => {
        if (isRequirePop) {
          navigation.pop();
        }
      },
    });
  };

  const onFoodDetailPress = (food: CustomFood) => {
    const log = getFoodLog(food);
    navigation.navigate('EditFoodLogScreen', {
      foodLog: log,
      prevRouteName: 'MyFood',
      onEditRecipeFood: () => {
        onEditCustomRecipePress(food, true);
      },
    });
  };

  const onFoodSearch = () => {
    navigation.navigate('FoodSearchScreen', {
      from: 'Recipe',
      onSaveData: (item) => {
        const foodLog = convertPassioFoodItemToFoodLog(
          item,
          undefined,
          undefined,
          true
        );
        navigation.navigate('EditIngredientScreen', {
          foodItem: foodLog.foodItems[0],
          updateIngredient: (_item) => {
            navigation.pop(1);
            navigation.replace('EditRecipeScreen', {
              recipe: foodLog,
              prevRouteName: 'Recipe',
            });
          },
        });
      },
    });
  };

  const onCreateNewRecipePress = () => {
    recipeOptionsRef.current?.onOpen();
  };

  return {
    branding,
    customRecipes,
    recipeOptionsRef,
    onFoodDetailPress,
    onEditCustomRecipePress,
    onCreateNewRecipePress,
    onFoodSearch,
    onDeletePress,
    onLogPress,
  };
};
