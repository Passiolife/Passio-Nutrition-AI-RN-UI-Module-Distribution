import { PassioSDK } from '@passiolife/nutritionai-react-native-sdk-v3/src/sdk/v2';
import { useCallback, useEffect, useState } from 'react';

import type { FoodSearchScreenNavigationProps } from './FoodSearchScreen';
import { useDebounce } from '../../utils/UseDebounce';
import {
  useNavigation,
  useRoute,
  type RouteProp,
} from '@react-navigation/native';
import { useBranding, useServices } from '../../contexts';
import { getLogToDate, mealLabelByDate } from '../../utils';
import { FoodSearchScreenRoute } from '../../navigaitons/Route';
import type { ParamList } from '../../navigaitons';
import type {
  PassioFoodDataInfo,
  PassioFoodItem,
} from '@passiolife/nutritionai-react-native-sdk-v3';
import { convertPassioFoodItemToFoodLog } from '../../utils/V3Utils';

export function useFoodSearch() {
  const navigation = useNavigation<FoodSearchScreenNavigationProps>();
  const route = useRoute<RouteProp<ParamList, 'FoodSearchScreen'>>();
  const branding = useBranding();
  const services = useServices();

  const [loading, setLoading] = useState<boolean>(false);
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [alternatives, setAlternative] = useState<string[]>([]);

  const [results, setResults] = useState<PassioFoodDataInfo[]>([]);

  const debouncedSearchTerm: string = useDebounce<string>(searchQuery, 300);

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
      } else {
        cleanSearch();
      }
      setLoading(false);
    },
    [cleanSearch]
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

  const onSearchItemPress = async (
    item: PassioFoodItem,
    isOpenEditor: boolean
  ) => {
    if (route.params.from === 'Search') {
      const logToDate = getLogToDate(
        route.params.logToDate,
        route.params.logToMeal
      );
      const meal =
        route.params.logToMeal === undefined
          ? mealLabelByDate(logToDate)
          : route.params.logToMeal;

      const foodLog = convertPassioFoodItemToFoodLog(item, logToDate, meal);

      if (isOpenEditor) {
        navigation.navigate('EditFoodLogScreen', {
          foodLog: foodLog,
          prevRouteName: FoodSearchScreenRoute,
        });
      } else {
        await services.dataService.saveFoodLog(foodLog);
        navigation.pop(1);
        navigation.navigate('BottomNavigation', {
          screen: 'MealLogScreen',
        });
      }

      route.params.onSaveData?.(item);
    } else {
      route.params.onSaveData?.(item);
      navigation.replace;
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
    searchQuery,
    cancelPress,
    cleanSearch,
    onSearchItemPress,
    onSearchFood,
  };
}
