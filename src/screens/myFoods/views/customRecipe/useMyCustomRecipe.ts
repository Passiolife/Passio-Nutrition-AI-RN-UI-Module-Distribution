import { useState, useEffect, useRef } from 'react';
import { useBranding, useServices } from '../../../../contexts';
import type { CustomFood, CustomRecipe, FoodLog } from '../../../../models';
import { useIsFocused, useNavigation } from '@react-navigation/native';
import uuid4 from 'react-native-uuid';
import { getMealLog, ShowToast } from '../../../../utils';
import { convertDateToDBFormat } from '../../../../utils/DateFormatter';
import type { ScreenNavigationProps } from '../../useMyFoodScreen';
import type { RecipeOptionsRef } from '../../../../components';
import { CUSTOM_USER_RECIPE__PREFIX } from '../../../../screens/foodCreator/FoodCreator.utils';

export const useMyCustomRecipe = () => {
  const branding = useBranding();
  const services = useServices();
  const navigation = useNavigation<ScreenNavigationProps>();
  const recipeOptionsRef = useRef<RecipeOptionsRef>(null);

  const [customRecipes, setCustomRecipe] = useState<CustomRecipe[]>();
  const isFocused = useIsFocused();
  const isSubmitting = useRef<boolean>(false);

  useEffect(() => {
    function init() {
      services.dataService.getCustomRecipes().then((data) => {
        setCustomRecipe(data);
      });
    }
    init();
  }, [services.dataService, isFocused]);

  const onDeletePress = (food: CustomFood) => {
    services.dataService.deleteCustomRecipe(food.uuid).then(() => {
      setCustomRecipe((i) => i?.filter((c) => c.uuid !== food.uuid));
    });
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
      refCode: food.uuid,
      refCustomFoodID: food.uuid,
    };

    return foodLog;
  };

  const onLogPress = async (food: CustomFood) => {
    if (isSubmitting.current) {
      return;
    }
    isSubmitting.current = true;
    const log = getFoodLog(food);
    await services.dataService.saveFoodLog(log);
    ShowToast('Added your food into ' + log.meal);
    isSubmitting.current = false;
  };

  const onEditCustomRecipePress = (
    food: CustomFood,
    isRequirePop?: boolean
  ) => {
    navigation.navigate('EditRecipeScreen', {
      recipe: JSON.parse(JSON.stringify(food)),
      from: 'MyFood',
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
    navigation.push('FoodSearchScreen', {
      from: 'Recipe',
      onSaveData: (foodLog) => {
        navigation.navigate('EditIngredientScreen', {
          foodItem: foodLog.foodItems[0],
          updateIngredient: (_item) => {
            navigation.pop(1);
            navigation.replace('EditRecipeScreen', {
              recipe: foodLog,
              from: 'Recipe',
            });
          },
        });
      },
    });
  };

  const onFavorite = () => {};

  const onCreateNewRecipePress = () => {
    const uuid: string = uuid4.v4() as string;
    navigation.push('EditRecipeScreen', {
      recipe: {
        uuid: uuid,
        iconID: CUSTOM_USER_RECIPE__PREFIX,
        foodItems: [],
        name: '',
        selectedUnit: 'serving',
        selectedQuantity: 1,
        servingSizes: [],
        servingUnits: [],
      },
      from: 'Recipe',
    });

    // recipeOptionsRef.current?.onOpen();
  };

  return {
    branding,
    customRecipes,
    recipeOptionsRef,
    onFoodDetailPress,
    onEditCustomRecipePress,
    onCreateNewRecipePress,
    onFoodSearch,
    onFavorite,
    onDeletePress,
    onLogPress,
  };
};
