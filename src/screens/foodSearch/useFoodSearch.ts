import { PassioSDK } from '@passiolife/nutritionai-react-native-sdk-v3/src/sdk/v2';
import { useCallback, useEffect, useState, useRef } from 'react';

import type { FoodSearchScreenNavigationProps } from './FoodSearchScreen';
import { useDebounce } from '../../utils/UseDebounce';
import {
  CommonActions,
  useNavigation,
  useRoute,
  type RouteProp,
} from '@react-navigation/native';
import { useBranding, useServices } from '../../contexts';
import { getLogToDate, mealLabelByDate } from '../../utils';
import type { ParamList } from '../../navigaitons';
import type {
  PassioFoodDataInfo,
  PassioFoodItem,
} from '@passiolife/nutritionai-react-native-sdk-v3';
import { convertPassioFoodItemToFoodLog } from '../../utils/V3Utils';
import type { CustomFood, CustomRecipe, FoodLog } from '../../models';
import { createFoodLogByCustomFood } from '../foodCreator/FoodCreator.utils';

export interface SearchMyFood {
  customFood?: CustomFood;
  customRecipe?: CustomRecipe;
}

export function useFoodSearch() {
  const navigation = useNavigation<FoodSearchScreenNavigationProps>();
  const route = useRoute<RouteProp<ParamList, 'FoodSearchScreen'>>();
  const branding = useBranding();
  const services = useServices();

  const [loading, setLoading] = useState<boolean>(false);
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [alternatives, setAlternative] = useState<string[]>([]);

  const [results, setResults] = useState<PassioFoodDataInfo[]>([]);
  const [myFoodResult, setMyFoodResult] = useState<SearchMyFood[]>([]);

  const allCustomFoodRef = useRef<CustomFood[]>([]);
  const allCustomRecipe = useRef<CustomRecipe[]>([]);

  useEffect(() => {
    services.dataService
      ?.getCustomFoodLogs()
      .then((data) => (allCustomFoodRef.current = data));
    services.dataService
      ?.getCustomRecipes()
      .then((data) => (allCustomRecipe.current = data));
  }, [services.dataService]);

  const debouncedSearchTerm: string = useDebounce<string>(searchQuery, 300);

  const searchMyFood = useCallback((q: string) => {
    if (!q) {
      setMyFoodResult([]);
      return;
    }

    const customFoodResult =
      allCustomFoodRef?.current?.filter((i: CustomFood) =>
        i.name.toLowerCase().trim().includes(q.trim().toLowerCase())
      ) || [];

    const customRecipeResult =
      allCustomRecipe?.current?.filter(
        (i: CustomRecipe) =>
          i.name.toLowerCase().trim().includes(q.trim().toLowerCase()) ||
          i?.brandName?.toLowerCase().trim().includes(q.trim().toLowerCase())
      ) || [];

    const resultOfCustomFood: SearchMyFood[] = customFoodResult.map((i) => ({
      customFood: i,
    }));

    const resultOfCustomRecipe: SearchMyFood[] = customRecipeResult.map(
      (i) => ({
        customRecipe: i,
      })
    );

    setMyFoodResult([...resultOfCustomFood, ...resultOfCustomRecipe]);
  }, []);

  const cleanSearch = useCallback(() => {
    setSearchQuery('');
    setResults([]);
    setAlternative([]);
    setLoading(false);
  }, []);

  const callSearchApi = useCallback(
    async (val: string) => {
      if (val.length > 0) {
        setLoading(true);
        const searchFoods = await PassioSDK.searchForFood(val);
        setResults(searchFoods?.results ?? []);
        setAlternative(searchFoods?.alternatives ?? []);
        searchMyFood(val);
      } else {
        cleanSearch();
      }
      setLoading(false);
    },
    [cleanSearch, searchMyFood]
  );

  const onSearchFood = async (q: string) => {
    if (q.length > 0) {
      setSearchQuery(q);
      setResults([]);
      setAlternative([]);
    } else {
      cleanSearch();
    }
  };

  const cancelPress = () => {
    navigation.goBack();
  };

  const getFoodLog = (item: PassioFoodItem, isRecipe?: boolean) => {
    const logToDate = getLogToDate(
      route.params.logToDate,
      route.params.logToMeal
    );
    const meal =
      route.params.logToMeal === undefined
        ? mealLabelByDate(logToDate)
        : route.params.logToMeal;

    const foodLog = convertPassioFoodItemToFoodLog(
      item,
      logToDate,
      meal,
      isRecipe
    );
    return foodLog;
  };

  const convertSearchMyFoodToFoodLog = (item: SearchMyFood) => {
    const logToDate = getLogToDate(
      route.params.logToDate,
      route.params.logToMeal
    );
    const meal =
      route.params.logToMeal === undefined
        ? mealLabelByDate(logToDate)
        : route.params.logToMeal;

    if (item.customFood) {
      const foodLog = createFoodLogByCustomFood(
        item.customFood,
        logToDate,
        meal
      );
      return foodLog;
    } else if (item.customRecipe) {
      const foodLog = createFoodLogByCustomFood(
        item.customRecipe,
        logToDate,
        meal
      );
      return foodLog;
    } else {
      return undefined;
    }
  };

  const redirectToMyFood = (isCustomFood: boolean) => {
    navigation.dispatch(
      CommonActions.reset({
        index: 0,
        routes: [
          {
            name: 'BottomNavigation',
            params: {
              screen: 'MealLogScreen',
            },
          },
        ],
      })
    );
    setTimeout(() => {
      navigation.navigate('MyFoodsScreen', {
        logToDate: new Date(),
        logToMeal: undefined,
        tab: isCustomFood ? 'CustomFood' : 'Recipe',
      });
    }, 50);
  };

  const onEditFoodCreatorPress = (food: CustomFood) => {
    navigation.navigate('FoodCreatorScreen', {
      foodLog: food,
      onSave: () => {
        redirectToMyFood(true);
      },
    });
  };

  const onEditCustomRecipePress = (food: CustomFood) => {
    navigation.navigate('EditRecipeScreen', {
      recipe: food,
      from: 'MyFood',
      onSaveLogPress: () => {
        redirectToMyFood(false);
      },
    });
  };

  const navigateToItemPress = async (
    foodLog: FoodLog,
    isOpenEditor: boolean,
    myFood?: SearchMyFood
  ) => {
    if (route.params.from === 'Search') {
      if (isOpenEditor) {
        if (myFood) {
          foodLog.refCustomFoodID =
            myFood.customFood?.uuid ?? myFood.customRecipe?.uuid;
          navigation.navigate('EditFoodLogScreen', {
            foodLog: foodLog,
            prevRouteName: 'MyFood',
            customFood: myFood.customFood,
            onEditCustomFood: (_food) => {
              if (myFood.customFood) {
                onEditFoodCreatorPress(myFood.customFood);
              }
            },
            onEditRecipeFood: (_food) => {
              if (myFood.customRecipe) {
                onEditCustomRecipePress(myFood.customRecipe);
              }
            },
          });
        } else {
          navigation.navigate('EditFoodLogScreen', {
            foodLog: foodLog,
            prevRouteName: 'Search',
          });
        }
      } else {
        await services.dataService.saveFoodLog(foodLog);
        navigation.pop(1);
        navigation.navigate('BottomNavigation', {
          screen: 'MealLogScreen',
        });
      }
      route.params.onSaveData?.(foodLog);
    } else if (route.params.from === 'Ingredient') {
      if (isOpenEditor) {
        route.params.onEditFoodData?.(foodLog);
      } else {
        route.params.onSaveData?.(foodLog);
      }
    } else {
      route.params.onSaveData?.(foodLog);
    }
  };

  const onSearchItemPress = async (
    item: PassioFoodItem,
    isOpenEditor: boolean
  ) => {
    const foodLog = getFoodLog(item, route.params.from === 'Recipe');
    navigateToItemPress(foodLog, isOpenEditor);
  };

  const onSearchMyFoodItemPress = async (
    myFood: SearchMyFood,
    isOpenEditor: boolean
  ) => {
    const log = convertSearchMyFoodToFoodLog(myFood);
    if (log) {
      log.refCustomFoodID =
        myFood.customFood?.uuid ?? myFood.customRecipe?.uuid;
      navigateToItemPress(log, isOpenEditor, myFood);
    }
  };

  useEffect(() => {
    if (debouncedSearchTerm.length > 0) {
      callSearchApi(debouncedSearchTerm);
    } else {
      cleanSearch();
    }
  }, [callSearchApi, debouncedSearchTerm, cleanSearch]);

  return {
    alternatives,
    branding,
    loading,
    results,
    myFoodResult,
    searchQuery,
    cancelPress,
    onSearchMyFoodItemPress,
    cleanSearch,
    onSearchItemPress,
    onSearchFood,
  };
}
